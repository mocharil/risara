# LLAMA 4 API Integration via Vertex AI

This document explains how the application integrates with LLAMA 4 models using Vertex AI's OpenAI-compatible API endpoint.

## 🎯 Overview

LLAMA models in Vertex AI use an **OpenAI-compatible REST API** instead of the standard Vertex AI SDK. This integration uses:

- **LLAMA 4 Models**: `llama-4-maverick-17b-128e-instruct-maas` or `llama-4-scout-17b-16e-instruct-maas`
- **OpenAI-compatible Endpoint**: `https://us-central1-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/us-central1/endpoints/openapi/chat/completions`
- **Authentication**: Google Cloud access tokens (via service account credentials)

---

## 🔧 Implementation Details

### API Endpoint Format

```
https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/endpoints/openapi/chat/completions
```

### Request Format (OpenAI-compatible)

```json
{
  "model": "meta/llama-4-maverick-17b-128e-instruct-maas",
  "messages": [
    {
      "role": "user",
      "content": "Your prompt here"
    }
  ],
  "temperature": 0.0,
  "top_p": 1,
  "max_tokens": 2048,
  "stream": false
}
```

### Response Format (OpenAI-compatible)

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "LLAMA's response here"
      }
    }
  ]
}
```

---

## 📦 Configuration Files

### `src/lib/llamaConfig.ts`

This file contains:

1. **Credential Loading** - `getLlamaCredentials()`
   - Loads from `LLAMA_CREDS_JSON` or `LLAMA_CREDS_PATH`
   - Same format as previous Gemini credentials

2. **Access Token Generation** - `getAccessToken()`
   - Uses `google-auth-library` to generate OAuth2 tokens
   - Required for API authentication

3. **LLAMA API Call** - `generateLlamaContent(prompt)`
   - Main function to call LLAMA API
   - Handles authentication, request formatting, and response parsing

---

## 🚀 Usage

### In API Routes

```typescript
import { generateLlamaContent } from '@/lib/llamaConfig';

export async function POST(request: Request) {
  const prompt = "Your prompt here";

  try {
    const response = await generateLlamaContent(prompt);
    return NextResponse.json({ result: response });
  } catch (error) {
    console.error('LLAMA API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Current Integrations

1. **`/api/llama/summarize`**
   - Used by Network Analysis for AI summaries
   - Generates structured JSON summaries from TikTok posts

2. **`/api/social-monitoring/executive-summary`**
   - Generates comprehensive executive summaries
   - Combines TikTok and News insights

---

## 🔑 Environment Variables

Same as before, just renamed from GEMINI to LLAMA:

```bash
# Required
LLAMA_PROJECT_ID=your-gcp-project-id
LLAMA_CREDS_JSON={"type":"service_account",...}

# Or use file path (local development)
LLAMA_CREDS_PATH=path/to/credentials.json
```

---

## 🎨 Available Models

### LLAMA 4 Models (Current)

| Model | Context | Use Case |
|-------|---------|----------|
| `meta/llama-4-maverick-17b-128e-instruct-maas` | 128K tokens | General purpose, long context |
| `meta/llama-4-scout-17b-16e-instruct-maas` | 16K tokens | Faster inference, shorter context |

**Currently using**: `llama-4-maverick-17b-128e-instruct-maas`

To switch models, update `LLAMA_MODEL` in `src/lib/llamaConfig.ts`:

```typescript
export const LLAMA_MODEL = 'meta/llama-4-scout-17b-16e-instruct-maas';
```

---

## 🔄 Migration from Previous Implementation

### What Changed

**Before:**
```typescript
// Used Vertex AI SDK
const vertexAI = initializeVertexAI();
const model = vertexAI.getGenerativeModel({ model: LLAMA_MODEL });
const result = await model.generateContent(prompt);
```

**After:**
```typescript
// Uses OpenAI-compatible REST API
import { generateLlamaContent } from '@/lib/llamaConfig';
const response = await generateLlamaContent(prompt);
```

### Why the Change

- LLAMA models in Vertex AI use OpenAI-compatible API format (like the curl example)
- Different from Gemini models which use `getGenerativeModel()`
- Allows direct use of LLAMA 4 models without Model Garden deployment

---

## 🧪 Testing

### Test API Endpoint

```bash
# Test with curl (replace PROJECT_ID)
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/endpoints/openapi/chat/completions \
  -d '{
    "model": "meta/llama-4-maverick-17b-128e-instruct-maas",
    "messages": [{"role": "user", "content": "Hello, LLAMA!"}]
  }'
```

### Test in Application

1. Start development server:
   ```bash
   npm run dev
   ```

2. Go to Network Analysis page

3. Click on a node to trigger AI summary

4. Check console logs for:
   ```
   🚀 Calling LLAMA API: { model: '...', endpoint: '...' }
   ✅ LLAMA API response received
   ```

---

## ❌ Troubleshooting

### Error: "Failed to get access token"

**Cause**: Invalid credentials or missing permissions

**Solution**:
1. Verify `LLAMA_CREDS_JSON` is valid JSON
2. Check service account has `roles/aiplatform.user` role
3. Ensure `LLAMA_PROJECT_ID` matches credentials

### Error: "LLAMA API request failed: 403"

**Cause**: Service account doesn't have Vertex AI permissions

**Solution**:
```bash
# Grant Vertex AI User role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_SA_EMAIL" \
  --role="roles/aiplatform.user"
```

### Error: "LLAMA API request failed: 404"

**Cause**: Invalid model name or endpoint

**Solution**:
1. Check model name is correct: `meta/llama-4-maverick-17b-128e-instruct-maas`
2. Verify endpoint region matches: `us-central1`
3. Confirm project ID is correct

---

## 💡 Best Practices

1. **Error Handling**: Always wrap `generateLlamaContent()` in try-catch
2. **Timeouts**: Set appropriate timeout for long-running requests
3. **Retries**: Implement retry logic for transient failures
4. **Caching**: Cache access tokens (they're valid for ~1 hour)
5. **Monitoring**: Log all API calls for debugging

---

## 📊 Performance

### Response Times

- **LLAMA 4 Maverick (128e)**: ~2-5 seconds (longer context)
- **LLAMA 4 Scout (16e)**: ~1-3 seconds (shorter context, faster)

### Cost Considerations

- Pricing based on input/output tokens
- Check current rates: https://cloud.google.com/vertex-ai/pricing
- Consider using Scout model for cost-effective inference

---

## 📚 Additional Resources

- [Vertex AI LLAMA Models Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/llama)
- [OpenAI API Compatibility](https://cloud.google.com/vertex-ai/docs/generative-ai/multimodal/overview#openai-compatibility)
- [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs)

---

## 🎯 Summary

✅ **LLAMA 4 integration complete**
✅ **Using OpenAI-compatible API** (as shown in curl example)
✅ **Same credentials as before** (just renamed GEMINI → LLAMA)
✅ **No Model Garden deployment needed**
✅ **Ready to use out-of-the-box**
