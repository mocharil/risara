# Gemini AI Setup Guide

This guide explains how to configure Gemini AI credentials for the Risara application, both for local development and Vercel deployment.

## 🔑 Two Methods to Configure Credentials

### Method 1: GEMINI_CREDS_JSON (✅ Recommended for Vercel)

Use this method when deploying to Vercel or any cloud platform where you cannot upload credential files.

**Steps:**

1. **Get your service account JSON file** from Google Cloud Console
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to: IAM & Admin → Service Accounts
   - Find your service account → Click "..." → Manage Keys
   - Add Key → Create New Key → JSON
   - Download the JSON file

2. **Copy the entire JSON content**
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "xxx...",
     "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n",
     "client_email": "your-sa@your-project.iam.gserviceaccount.com",
     ...
   }
   ```

3. **For Local Development:**
   Add to `.env.local`:
   ```bash
   GEMINI_PROJECT_ID=your-project-id
   GEMINI_CREDS_JSON='{"type":"service_account",...}'  # Paste entire JSON as single line
   ```

4. **For Vercel Deployment:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add these variables for **Production**, **Preview**, and **Development**:

   | Key | Value |
   |-----|-------|
   | `GEMINI_PROJECT_ID` | your-gcp-project-id |
   | `GEMINI_CREDS_JSON` | Paste entire JSON as single line |

   **Important:**
   - The JSON must be on a **single line** (no line breaks)
   - Keep the newlines in private_key as `\n` (don't convert them)
   - Example: `{"type":"service_account","project_id":"xxx","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n",...}`

---

### Method 2: GEMINI_CREDS_PATH (For Local Development Only)

Use this method for local development when you have the credential file on your machine.

**Steps:**

1. **Place your credential file** in the project root
   ```
   your-project/
   ├── skilled-compass.json  ← Your credential file
   ├── .env.local
   └── ...
   ```

2. **Add to `.env.local`:**
   ```bash
   GEMINI_PROJECT_ID=your-project-id
   GEMINI_CREDS_PATH=skilled-compass.json  # or ./path/to/your/credentials.json
   ```

3. **Add credential file to `.gitignore`:**
   ```bash
   # .gitignore
   *.json  # Make sure credential files are not committed to git
   !package.json
   !tsconfig.json
   ```

---

## 🔄 How Credentials are Loaded (Priority)

The application checks credentials in this order:

1. **GEMINI_CREDS_JSON** (environment variable) ← **Priority 1**
2. **GEMINI_CREDS_PATH** (file path) ← **Priority 2**

If neither is set, Gemini features will be disabled (app will use dummy data).

---

## 📋 Environment Variables Summary

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_PROJECT_ID` | ✅ Yes | Your GCP Project ID | `paper-ds-production` |
| `GEMINI_CREDS_JSON` | For Vercel | Service account JSON as string | `{"type":"service_account",...}` |
| `GEMINI_CREDS_PATH` | For Local | Path to credential file | `skilled-compass.json` |

---

## 🚀 Testing Your Setup

### Local Development

```bash
# 1. Set environment variables in .env.local
# 2. Run the app
npm run dev

# 3. Check the console logs
# You should see: ✅ Using GEMINI_CREDS_JSON from environment variable
# Or: ✅ Using GEMINI_CREDS_PATH from file: skilled-compass.json
```

### Vercel Deployment

```bash
# 1. Set environment variables in Vercel Dashboard
# 2. Redeploy your app
# 3. Check deployment logs

# You should see: ✅ VertexAI initialized successfully
```

---

## ❌ Troubleshooting

### Error: "VertexAI not initialized"

**Cause:** Credentials not found or invalid

**Solutions:**
1. Check `GEMINI_PROJECT_ID` is set correctly
2. If using `GEMINI_CREDS_JSON`:
   - Make sure JSON is on single line
   - Check for syntax errors in JSON
   - Verify newlines in private_key are `\n` not actual line breaks
3. If using `GEMINI_CREDS_PATH`:
   - Verify file exists at the specified path
   - Check file has valid JSON format
   - Ensure file has proper permissions

### Error: "Error reading credentials file"

**Cause:** File path is incorrect or file doesn't exist

**Solutions:**
1. Use absolute path: `/path/to/credentials.json`
2. Or relative path from project root: `./credentials/file.json`
3. Verify file exists: `ls -la skilled-compass.json`

### Vercel: "No Gemini credentials found"

**Cause:** Environment variables not set in Vercel

**Solutions:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add `GEMINI_PROJECT_ID` and `GEMINI_CREDS_JSON`
3. Make sure to select all environments: Production, Preview, Development
4. Redeploy the application

---

## 🔐 Security Best Practices

1. **Never commit credential files to Git**
   - Add `*.json` to `.gitignore`
   - Keep credentials in `.env.local` (also gitignored)

2. **Use environment variables for production**
   - Always use `GEMINI_CREDS_JSON` in Vercel
   - Never hardcode credentials in code

3. **Rotate credentials regularly**
   - Generate new service account keys periodically
   - Delete old keys after rotation

4. **Limit service account permissions**
   - Only grant "Vertex AI User" role
   - Don't use Owner or Editor roles

---

## 📚 Additional Resources

- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Vertex AI Authentication](https://cloud.google.com/vertex-ai/docs/authentication)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 💡 Quick Copy-Paste for Vercel

1. Open your service account JSON file
2. Copy the entire content
3. Minify it to single line using:
   ```bash
   # Using jq (if installed)
   cat skilled-compass.json | jq -c

   # Or manually: Remove all line breaks except in private_key
   ```
4. Paste in Vercel Environment Variables as `GEMINI_CREDS_JSON`

**Example minified JSON:**
```
{"type":"service_account","project_id":"paper-ds-production","private_key_id":"xxx","private_key":"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n","client_email":"ai@paper-ds.iam.gserviceaccount.com","client_id":"xxx","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/ai%40paper-ds.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```
