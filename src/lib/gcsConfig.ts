// src/lib/gcsConfig.ts
import { Storage } from '@google-cloud/storage';

/**
 * Get GCS credentials from environment variables
 * Supports both GCS_CREDENTIALS_JSON (JSON string) and GCS_CREDENTIALS_PATH (file path)
 *
 * Priority:
 * 1. GCS_CREDENTIALS_JSON (for Vercel deployment without file upload)
 * 2. LLAMA_CREDS_JSON (use same credentials as LLAMA)
 * 3. GCS_CREDENTIALS_PATH (for local development with credentials file)
 * 4. LLAMA_CREDS_PATH (use same file as LLAMA)
 */
export function getGCSCredentials(): any | null {
  // Priority 1: Try GCS_CREDENTIALS_JSON environment variable (for Vercel)
  const credentialsJson = process.env.GCS_CREDENTIALS_JSON;
  if (credentialsJson && credentialsJson.trim()) {
    const trimmed = credentialsJson.trim();
    if (!trimmed.startsWith('{')) {
      console.log(`⚠️  GCS_CREDENTIALS_JSON exists but invalid (starts with: "${trimmed.substring(0, 5)}"), skipping...`);
    } else {
      try {
        console.log('✅ Using GCS_CREDENTIALS_JSON from environment variable');
        return JSON.parse(credentialsJson);
      } catch (error) {
        console.error('❌ Failed to parse GCS_CREDENTIALS_JSON, trying fallback...');
      }
    }
  }

  // Priority 2: Use same credentials as LLAMA if available
  const llamaCredentialsJson = process.env.LLAMA_CREDS_JSON;
  if (llamaCredentialsJson && llamaCredentialsJson.trim() && llamaCredentialsJson.trim().startsWith('{')) {
    try {
      console.log('✅ Using LLAMA_CREDS_JSON for GCS (fallback)');
      return JSON.parse(llamaCredentialsJson);
    } catch (error) {
      console.error('❌ Failed to parse LLAMA_CREDS_JSON, trying fallback...');
    }
  }

  // Priority 3: Try GCS_CREDENTIALS_PATH (file path)
  const credentialsPath = process.env.GCS_CREDENTIALS_PATH;
  if (credentialsPath) {
    try {
      console.log('✅ Using GCS_CREDENTIALS_PATH from environment variable');
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.resolve(process.cwd(), credentialsPath);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('❌ Failed to read GCS_CREDENTIALS_PATH, trying fallback...');
    }
  }

  // Priority 4: Use same file as LLAMA if available
  const llamaCredentialsPath = process.env.LLAMA_CREDS_PATH;
  if (llamaCredentialsPath) {
    try {
      console.log('✅ Using LLAMA_CREDS_PATH for GCS (fallback)');
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.resolve(process.cwd(), llamaCredentialsPath);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('❌ Failed to read LLAMA_CREDS_PATH');
    }
  }

  console.warn('⚠️  No GCS credentials found. Set GCS_CREDENTIALS_JSON, LLAMA_CREDS_JSON, GCS_CREDENTIALS_PATH, or LLAMA_CREDS_PATH');
  return null;
}

/**
 * Initialize Google Cloud Storage with credentials from environment
 */
export function initializeGCS(): Storage | null {
  try {
    const projectId = process.env.GCS_PROJECT_ID || process.env.LLAMA_PROJECT_ID;
    if (!projectId) {
      console.error('❌ GCS_PROJECT_ID or LLAMA_PROJECT_ID not set in environment variables');
      return null;
    }

    const credentials = getGCSCredentials();
    if (!credentials) {
      console.error('❌ Failed to load GCS credentials');
      return null;
    }

    const storage = new Storage({
      projectId: projectId,
      credentials: credentials,
    });

    console.log('✅ Google Cloud Storage initialized successfully');
    return storage;
  } catch (error) {
    console.error('❌ Error initializing GCS:', error);
    return null;
  }
}

/**
 * Ensure bucket exists, create if it doesn't
 *
 * Note: If service account doesn't have storage.buckets.get permission,
 * we'll skip the check and assume bucket exists (fail on upload if it doesn't)
 *
 * @param storage - Storage instance
 * @param bucketName - Bucket name to check/create
 * @returns true if bucket exists or was created successfully
 */
async function ensureBucketExists(storage: Storage, bucketName: string): Promise<boolean> {
  try {
    const bucket = storage.bucket(bucketName);

    // Check if bucket exists
    const [exists] = await bucket.exists();

    if (exists) {
      console.log(`✅ Bucket exists: ${bucketName}`);
      return true;
    }

    // Create bucket if it doesn't exist
    console.log(`📦 Bucket not found, creating: ${bucketName}`);

    const projectId = process.env.GCS_PROJECT_ID || process.env.LLAMA_PROJECT_ID;
    const location = process.env.GCS_BUCKET_LOCATION || 'us-central1';

    await storage.createBucket(bucketName, {
      location,
      storageClass: 'STANDARD',
      uniformBucketLevelAccess: {
        enabled: true,
      },
    });

    console.log(`✅ Bucket created successfully: ${bucketName}`);
    return true;
  } catch (error: any) {
    // If we get 403 error, it likely means bucket exists but we don't have permission to check
    // In this case, we'll proceed with upload and let it fail there if bucket truly doesn't exist
    if (error?.code === 403) {
      console.log(`⚠️  No permission to check bucket, assuming it exists: ${bucketName}`);
      return true;
    }

    console.error(`❌ Error ensuring bucket exists: ${bucketName}`, error);
    return false;
  }
}

/**
 * Upload file to Google Cloud Storage
 *
 * @param file - File buffer to upload
 * @param fileName - Name for the file in GCS
 * @param bucketName - GCS bucket name (from env or parameter)
 * @returns Public URL of uploaded file or null if failed
 */
export async function uploadFileToGCS(
  file: Buffer,
  fileName: string,
  bucketName?: string
): Promise<string | null> {
  try {
    const storage = initializeGCS();
    if (!storage) {
      throw new Error('GCS not initialized');
    }

    const bucket = bucketName || process.env.GCS_BUCKET_NAME;
    if (!bucket) {
      throw new Error('GCS_BUCKET_NAME not set in environment variables');
    }

    // Ensure bucket exists, create if it doesn't
    const bucketReady = await ensureBucketExists(storage, bucket);
    if (!bucketReady) {
      throw new Error(`Failed to ensure bucket exists: ${bucket}`);
    }

    console.log(`📤 Uploading file to GCS bucket: ${bucket}/${fileName}`);

    const blob = storage.bucket(bucket).file(fileName);

    // Upload file
    await blob.save(file, {
      metadata: {
        contentType: getContentType(fileName),
      },
    });

    // Make file public (optional, remove if you want private files)
    await blob.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket}/${fileName}`;
    console.log(`✅ File uploaded successfully: ${publicUrl}`);

    return publicUrl;
  } catch (error) {
    console.error('❌ Error uploading file to GCS:', error);
    return null;
  }
}

/**
 * Delete file from Google Cloud Storage
 *
 * @param fileName - Name of the file to delete
 * @param bucketName - GCS bucket name (from env or parameter)
 * @returns true if deleted successfully, false otherwise
 */
export async function deleteFileFromGCS(
  fileName: string,
  bucketName?: string
): Promise<boolean> {
  try {
    const storage = initializeGCS();
    if (!storage) {
      throw new Error('GCS not initialized');
    }

    const bucket = bucketName || process.env.GCS_BUCKET_NAME;
    if (!bucket) {
      throw new Error('GCS_BUCKET_NAME not set in environment variables');
    }

    console.log(`🗑️  Deleting file from GCS: ${bucket}/${fileName}`);

    await storage.bucket(bucket).file(fileName).delete();

    console.log(`✅ File deleted successfully: ${fileName}`);
    return true;
  } catch (error) {
    console.error('❌ Error deleting file from GCS:', error);
    return false;
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();

  const contentTypes: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'doc': 'application/msword',
    'txt': 'text/plain',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
  };

  return contentTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Generate unique file name with timestamp
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(`.${extension}`, '').replace(/[^a-zA-Z0-9]/g, '_');

  return `knowledge-base/${timestamp}_${randomString}_${nameWithoutExt}.${extension}`;
}
