// src/lib/gcsConfig.ts
import { Storage } from '@google-cloud/storage';

/**
 * Get GCS credentials from environment variables
 * Supports both GCS_CREDENTIALS_JSON (JSON string) and GCS_CREDENTIALS_PATH (file path)
 *
 * Priority:
 * 1. GCS_CREDENTIALS_JSON (for Vercel deployment without file upload)
 * 2. GCS_CREDENTIALS_PATH (for local development with credentials file)
 */
export function getGCSCredentials(): any | null {
  try {
    // Priority 1: Try GCS_CREDENTIALS_JSON environment variable (for Vercel)
    const credentialsJson = process.env.GCS_CREDENTIALS_JSON;
    if (credentialsJson) {
      console.log('✅ Using GCS_CREDENTIALS_JSON from environment variable');
      return JSON.parse(credentialsJson);
    }

    // Priority 2: Use same credentials as Gemini if available
    const geminiCredentialsJson = process.env.GEMINI_CREDS_JSON;
    if (geminiCredentialsJson) {
      console.log('✅ Using GEMINI_CREDS_JSON for GCS (fallback)');
      return JSON.parse(geminiCredentialsJson);
    }

    console.warn('⚠️  No GCS credentials found. Set GCS_CREDENTIALS_JSON or GEMINI_CREDS_JSON');
    return null;
  } catch (error) {
    console.error('❌ Error loading GCS credentials:', error);
    return null;
  }
}

/**
 * Initialize Google Cloud Storage with credentials from environment
 */
export function initializeGCS(): Storage | null {
  try {
    const projectId = process.env.GCS_PROJECT_ID || process.env.GEMINI_PROJECT_ID;
    if (!projectId) {
      console.error('❌ GCS_PROJECT_ID or GEMINI_PROJECT_ID not set in environment variables');
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
