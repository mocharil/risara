#!/bin/bash

# Check available LLAMA models in Vertex AI

echo "🔍 Checking available LLAMA models in Vertex AI..."
echo ""

PROJECT_ID="paper-ds-production"
REGION="us-central1"

echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Get access token
ACCESS_TOKEN=$(gcloud auth print-access-token)

# Try to list models via API
echo "📋 Attempting to call LLAMA API with test models..."
echo ""

# Test models to try
MODELS=(
  "meta/llama-4-scout-17b-16e-instruct-maas"
  "meta/llama-4-maverick-17b-128e-instruct-maas"
  "meta/llama-3-405b-instruct-maas"
  "meta/llama-3-70b-instruct-maas"
  "meta/llama-3-8b-instruct-maas"
)

for MODEL in "${MODELS[@]}"; do
  echo "Testing model: $MODEL"

  RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    "https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/endpoints/openapi/chat/completions" \
    -d "{\"model\":\"${MODEL}\",\"messages\":[{\"role\":\"user\",\"content\":\"Hi\"}],\"max_tokens\":10}")

  if echo "$RESPONSE" | grep -q "error"; then
    echo "❌ Not available: $MODEL"
    echo "   Error: $(echo $RESPONSE | jq -r '.error.message' 2>/dev/null || echo $RESPONSE)"
  else
    echo "✅ Available: $MODEL"
  fi
  echo ""
done

echo ""
echo "💡 To enable a model:"
echo "1. Go to: https://console.cloud.google.com/vertex-ai/model-garden"
echo "2. Search for 'Llama'"
echo "3. Click on desired model and click 'Enable'"
