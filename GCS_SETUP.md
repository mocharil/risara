# Google Cloud Storage (GCS) Setup Guide

This guide explains how to configure Google Cloud Storage for the Knowledge Base file upload feature in the Risara application.

## 📦 What's This For?

The Knowledge Base feature allows users to upload supporting documents (PDF, DOCX, TXT) when adding knowledge entries. These files are stored in Google Cloud Storage (GCS) and metadata is saved to MongoDB.

---

## 🎯 Prerequisites

1. **Google Cloud Project** with billing enabled
2. **Service Account** with proper permissions
3. **GCS Bucket** created and configured
4. **MongoDB** database connection (already configured)

---

## 🚀 Step-by-Step Setup

### Step 1: Create GCS Bucket

1. Go to [Google Cloud Console → Storage](https://console.cloud.google.com/storage)
2. Click **"Create Bucket"**
3. Configure bucket:
   - **Name**: `risara-knowledge-base` (or your preferred name)
   - **Location type**: Region
   - **Location**: `us-central1` (or closest to your app)
   - **Storage class**: Standard
   - **Access control**: Uniform (recommended)
   - **Protection tools**: None (or as needed)

4. Click **"Create"**

---

### Step 2: Configure Service Account Permissions

Your service account needs **Storage Object Admin** role.

**Option A: Add role to existing LLAMA service account**

```bash
# Get your service account email from credentials
SERVICE_ACCOUNT="ai-production-sa@paper-ds-production.iam.gserviceaccount.com"

# Add Storage Object Admin role
gcloud projects add-iam-policy-binding paper-ds-production \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/storage.objectAdmin"
```

**Option B: Using Google Cloud Console**

1. Go to [IAM & Admin → IAM](https://console.cloud.google.com/iam-admin/iam)
2. Find your service account
3. Click **"Edit"** (pencil icon)
4. Click **"Add Another Role"**
5. Select **"Storage Object Admin"**
6. Click **"Save"**

**Verify permissions:**
```bash
gcloud projects get-iam-policy paper-ds-production \
    --flatten="bindings[].members" \
    --format="table(bindings.role)" \
    --filter="bindings.members:${SERVICE_ACCOUNT}"
```

You should see:
- `roles/aiplatform.user` (for LLAMA)
- `roles/storage.objectAdmin` (for GCS)

---

### Step 3: Configure Environment Variables

#### **For Local Development (`.env.local`):**

```bash
# Google Cloud Storage Configuration
GCS_PROJECT_ID=paper-ds-production
GCS_BUCKET_NAME=risara-knowledge-base

# Will automatically use LLAMA_CREDS_JSON if GCS_CREDENTIALS_JSON not set
# Or you can set explicitly:
# GCS_CREDENTIALS_JSON={"type":"service_account",...}
```

#### **For Vercel Deployment:**

Go to Vercel Dashboard → Project → Settings → Environment Variables

Add these for **Production**, **Preview**, and **Development**:

| Variable Name | Value | Example |
|---------------|-------|---------|
| `GCS_PROJECT_ID` | Your GCP project ID | `paper-ds-production` |
| `GCS_BUCKET_NAME` | Your GCS bucket name | `risara-knowledge-base` |
| `GCS_CREDENTIALS_JSON` | Service account JSON | `{"type":"service_account",...}` |

**Note:** If you already set `LLAMA_CREDS_JSON`, the system will automatically use it for GCS. You don't need to set `GCS_CREDENTIALS_JSON` separately.

---

### Step 4: Make Bucket Public (Optional)

If you want uploaded files to be publicly accessible via URLs:

**Option A: Using gsutil**

```bash
# Make all objects in bucket public
gsutil iam ch allUsers:objectViewer gs://risara-knowledge-base
```

**Option B: Using Google Cloud Console**

1. Go to your bucket → **Permissions** tab
2. Click **"Grant Access"**
3. New principals: `allUsers`
4. Role: **Storage Object Viewer**
5. Click **"Save"**

**⚠️ Security Note:** Only do this if you want files publicly accessible. For private files, skip this step.

---

## 🧪 Testing Your Setup

### Test 1: Check GCS Connection

Create a test file `test-gcs.js`:

```javascript
const { Storage } = require('@google-cloud/storage');

const credentials = JSON.parse(process.env.LLAMA_CREDS_JSON);
const storage = new Storage({
  projectId: 'paper-ds-production',
  credentials: credentials
});

async function testGCS() {
  try {
    const [buckets] = await storage.getBuckets();
    console.log('✅ GCS connection successful!');
    console.log('Buckets:', buckets.map(b => b.name));
  } catch (error) {
    console.error('❌ GCS connection failed:', error.message);
  }
}

testGCS();
```

Run test:
```bash
node test-gcs.js
```

### Test 2: Upload a File via Knowledge Base

1. Run your Next.js app: `npm run dev`
2. Go to: http://localhost:3000/dashboard/citizen-engagement
3. Navigate to **Knowledge Base** tab
4. Fill in the form:
   - Title: "Test Upload"
   - Content: "This is a test"
   - Topic: "Testing"
   - Upload a small PDF file
5. Click **"Add Knowledge Entry"**

**Expected result:**
- Success message appears
- File uploaded to GCS
- Entry saved to MongoDB
- Console shows: `✅ File uploaded successfully: https://storage.googleapis.com/...`

---

## 📂 File Storage Structure

Files are stored with this naming pattern:

```
gs://risara-knowledge-base/
  └── knowledge-base/
      └── {timestamp}_{random}_{filename}.{ext}
```

**Example:**
```
gs://risara-knowledge-base/knowledge-base/1730123456789_a8f3e2_document.pdf
```

**Public URL:**
```
https://storage.googleapis.com/risara-knowledge-base/knowledge-base/1730123456789_a8f3e2_document.pdf
```

---

## 🗄️ MongoDB Schema

Knowledge base entries are stored in MongoDB:

**Database:** `risara`
**Collection:** `knowledge_base`

**Document Structure:**

```javascript
{
  "_id": ObjectId("..."),
  "title": "How to Apply for Business Permit",
  "content": "Detailed guide for business permit application...",
  "topic_classification": "Public Services",
  "keywords": ["business", "permit", "application"],
  "file_url": "https://storage.googleapis.com/risara-knowledge-base/...",
  "file_name": "business-permit-guide.pdf",
  "file_size": 524288,
  "file_type": "application/pdf",
  "created_at": ISODate("2025-10-27T10:30:00Z"),
  "updated_at": ISODate("2025-10-27T10:30:00Z")
}
```

---

## ❌ Troubleshooting

### Error: "GCS not initialized"

**Cause:** Missing credentials or project ID

**Solution:**
1. Check `GCS_PROJECT_ID` is set
2. Check `GCS_CREDENTIALS_JSON` or `LLAMA_CREDS_JSON` is set
3. Verify JSON format is valid

### Error: "Permission denied"

**Cause:** Service account doesn't have Storage Object Admin role

**Solution:**
```bash
gcloud projects add-iam-policy-binding paper-ds-production \
    --member="serviceAccount:your-sa@project.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"
```

### Error: "Bucket not found"

**Cause:** Bucket name is incorrect or doesn't exist

**Solution:**
1. Verify bucket name: `gsutil ls`
2. Check `GCS_BUCKET_NAME` environment variable
3. Create bucket if it doesn't exist

### Error: "File upload failed"

**Cause:** Network issue or file too large

**Solution:**
1. Check file size (max 10MB)
2. Check internet connection
3. Verify bucket permissions
4. Check server logs for detailed error

### Error: "Failed to save to MongoDB"

**Cause:** MongoDB connection issue

**Solution:**
1. Check `MONGO_URI` is correct
2. Verify MongoDB is running
3. Check network connectivity to MongoDB

---

## 🔐 Security Best Practices

1. **Never commit credentials to Git**
   ```bash
   # Add to .gitignore
   *.json
   .env.local
   ```

2. **Use environment variables for production**
   - Always use `GCS_CREDENTIALS_JSON` in Vercel
   - Never hardcode credentials in code

3. **Limit bucket access**
   - Only make public if necessary
   - Use signed URLs for private files
   - Set object lifecycle policies

4. **Rotate credentials regularly**
   - Generate new service account keys every 90 days
   - Delete old keys after rotation

5. **Monitor storage usage**
   - Set up billing alerts
   - Review storage metrics monthly
   - Clean up old/unused files

---

## 💰 Cost Considerations

**GCS Pricing (us-central1):**
- Storage: ~$0.020/GB/month
- Class A operations (uploads): $0.05 per 10,000 operations
- Class B operations (downloads): $0.004 per 10,000 operations
- Network egress: Varies by destination

**Example monthly cost for 1,000 files (100MB total):**
- Storage: $0.002
- Uploads (1,000): $0.005
- Downloads (10,000): $0.004
- **Total: ~$0.01/month**

**Very affordable!** ✅

---

## 📚 Additional Resources

- [GCS Documentation](https://cloud.google.com/storage/docs)
- [GCS Node.js Client](https://googleapis.dev/nodejs/storage/latest/)
- [IAM Roles for GCS](https://cloud.google.com/storage/docs/access-control/iam-roles)
- [GCS Pricing](https://cloud.google.com/storage/pricing)

---

## 🎉 Ready to Go!

Once setup is complete:

1. ✅ GCS bucket created
2. ✅ Service account has Storage Object Admin role
3. ✅ Environment variables configured
4. ✅ Tested file upload

Your Knowledge Base feature is ready to accept file uploads! 🚀
