# How to Use Real LLAMA Models from Model Garden

By default, the application uses Gemini models which work out-of-the-box. However, if you want to use actual LLAMA models from Meta, follow this guide.

## 🚀 Quick Setup

### Step 1: Deploy LLAMA Model in Model Garden

1. **Go to Google Cloud Console**
   - Navigate to: [Vertex AI > Model Garden](https://console.cloud.google.com/vertex-ai/model-garden)
   - Or search "Model Garden" in the Cloud Console search bar

2. **Find LLAMA Models**
   - In Model Garden, search for: `Llama 3`
   - You'll see various LLAMA models from Meta

3. **Choose Your Model**

   Available models:

   | Model | Size | Use Case |
   |-------|------|----------|
   | `llama-3-405b-instruct-maas` | 405B | Most capable, best quality |
   | `llama-3-70b-instruct-maas` | 70B | Balanced performance & cost |
   | `llama-3-8b-instruct-maas` | 8B | Fast and cost-effective |
   | `llama-3.2-90b-vision-instruct-maas` | 90B | Vision + text capabilities |

4. **Deploy the Model**
   - Click on your chosen model
   - Click **"Deploy"** or **"Enable"** button
   - Wait for deployment (may take a few minutes)
   - Note the **Model Resource Name** (you'll need this)

---

### Step 2: Get the Model Resource Name

After deployment, you need the full resource name in this format:

```
projects/YOUR_PROJECT_ID/locations/us-central1/publishers/meta/models/MODEL_NAME
```

**Example:**
```
projects/paper-prod/locations/us-central1/publishers/meta/models/llama-3-405b-instruct-maas
```

**To find it:**
1. Go to Model Garden → Deployed Models
2. Click on your LLAMA deployment
3. Copy the **Resource Name** from the details page

---

### Step 3: Update Your Configuration

**Option A: Update in Code** (Recommended for development)

Edit `src/lib/llamaConfig.ts`:

```typescript
// Replace this line:
export const LLAMA_MODEL = 'gemini-1.5-flash-002';

// With your LLAMA model resource name:
export const LLAMA_MODEL = 'projects/YOUR_PROJECT_ID/locations/us-central1/publishers/meta/models/llama-3-405b-instruct-maas';
```

**Option B: Use Environment Variable** (Recommended for production)

1. Add to `.env.local`:
   ```bash
   LLAMA_MODEL_NAME=projects/YOUR_PROJECT_ID/locations/us-central1/publishers/meta/models/llama-3-405b-instruct-maas
   ```

2. Update `src/lib/llamaConfig.ts`:
   ```typescript
   export const LLAMA_MODEL = process.env.LLAMA_MODEL_NAME || 'gemini-1.5-flash-002';
   ```

---

## 💡 Model Comparison

### Gemini Models (Default)
✅ **Pros:**
- No setup required
- Works immediately with Vertex AI credentials
- Fast inference
- Cost-effective
- Regular updates from Google

❌ **Cons:**
- Not technically "LLAMA" models
- Google's models, not Meta's

### LLAMA Models (Optional)
✅ **Pros:**
- Actual Meta LLAMA models
- Open-source architecture
- Good for specific use cases requiring LLAMA
- Can be fine-tuned

❌ **Cons:**
- Requires Model Garden deployment
- Additional setup steps
- May have different pricing
- Requires full resource name format

---

## 🧪 Testing Your Setup

After configuring LLAMA models:

```bash
# Restart your development server
npm run dev

# Test the Network Analysis feature
# 1. Go to Network Analysis page
# 2. Click on a node
# 3. Check if AI Summary generates successfully
```

**Check logs for:**
```
✅ VertexAI initialized successfully for LLAMA
✅ Using model: projects/YOUR_PROJECT/locations/us-central1/publishers/meta/models/llama-3-405b-instruct-maas
```

---

## ❌ Troubleshooting

### Error: "model parameter must be either a Model Garden model ID"

**Cause:** Invalid model name format

**Solution:**
- Make sure you're using the **full resource name**
- Format must be: `projects/PROJECT_ID/locations/LOCATION/publishers/meta/models/MODEL_NAME`
- Check that the model is deployed in Model Garden

### Error: "Model not found" or "403 Permission Denied"

**Cause:** Model not deployed or missing permissions

**Solution:**
1. Check Model Garden to confirm deployment status
2. Verify your service account has these roles:
   - `roles/aiplatform.user` (Vertex AI User)
   - `roles/ml.developer` (ML Developer - for Model Garden)

### High Costs / Slow Performance

**Cause:** Large LLAMA models (405B) are expensive and slower

**Solution:**
- Use smaller models: `llama-3-70b-instruct-maas` or `llama-3-8b-instruct-maas`
- Or stick with Gemini models which are optimized for speed/cost

---

## 💰 Cost Considerations

LLAMA models from Model Garden may have different pricing than Gemini:

- **Gemini 1.5 Flash**: ~$0.075 / 1M input tokens
- **LLAMA 3 405B**: Variable pricing (check current rates)
- **LLAMA 3 70B**: Variable pricing (check current rates)

**Recommendation:** Start with Gemini models unless you specifically need LLAMA for compatibility or research purposes.

---

## 📚 Additional Resources

- [Vertex AI Model Garden Documentation](https://cloud.google.com/vertex-ai/docs/start/explore-models)
- [Meta LLAMA Models](https://ai.meta.com/llama/)
- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)
