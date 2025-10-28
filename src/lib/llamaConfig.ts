// src/lib/llamaConfig.ts
import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Get LLAMA credentials from environment variables
 * Supports both LLAMA_CREDS_JSON (JSON string) and LLAMA_CREDS_PATH (file path)
 *
 * Priority:
 * 1. LLAMA_CREDS_JSON (for Vercel deployment without file upload)
 * 2. LLAMA_CREDS_PATH (for local development with credentials file)
 */
export function getLlamaCredentials(): any | null {
  try {
    // Priority 1: Try LLAMA_CREDS_JSON environment variable (for Vercel)
    const credentialsJson = process.env.LLAMA_CREDS_JSON;
    if (credentialsJson) {
      console.log('✅ Using LLAMA_CREDS_JSON from environment variable');
      return JSON.parse(credentialsJson);
    }

    // Priority 2: Try LLAMA_CREDS_PATH (for local development)
    const credentialsPath = process.env.LLAMA_CREDS_PATH;
    if (credentialsPath) {
      const fullPath = path.resolve(process.cwd(), credentialsPath);
      if (fs.existsSync(fullPath)) {
        console.log('✅ Using LLAMA_CREDS_PATH from file:', credentialsPath);
        const credentialsContent = fs.readFileSync(fullPath, 'utf-8');
        return JSON.parse(credentialsContent);
      } else {
        console.warn('⚠️  LLAMA_CREDS_PATH file not found:', fullPath);
      }
    }

    console.warn('⚠️  No LLAMA credentials found. Set LLAMA_CREDS_JSON or LLAMA_CREDS_PATH');
    return null;
  } catch (error) {
    console.error('❌ Error loading LLAMA credentials:', error);
    return null;
  }
}

/**
 * Initialize Vertex AI with credentials from environment
 */
export function initializeVertexAI(): VertexAI | null {
  try {
    const projectId = process.env.LLAMA_PROJECT_ID;
    if (!projectId) {
      console.error('❌ LLAMA_PROJECT_ID not set in environment variables');
      return null;
    }

    const credentials = getLlamaCredentials();
    if (!credentials) {
      console.error('❌ Failed to load LLAMA credentials');
      return null;
    }

    const vertexAI = new VertexAI({
      project: projectId,
      location: 'us-central1',
      googleAuthOptions: {
        credentials: credentials,
      },
    });

    console.log('✅ VertexAI initialized successfully for LLAMA');
    return vertexAI;
  } catch (error) {
    console.error('❌ Error initializing VertexAI for LLAMA:', error);
    return null;
  }
}

/**
 * LLAMA Model Configuration
 * LLAMA models in Vertex AI use OpenAI-compatible API endpoints
 */
export const LLAMA_MODEL = 'meta/llama-4-maverick-17b-128e-instruct-maas';
// Alternative LLAMA 4 models:
// - 'meta/llama-4-maverick-17b-128e-instruct-maas' (Current - Balanced)
// - 'meta/llama-4-scout-17b-16e-instruct-maas' (Faster inference)

/**
 * LLAMA API Configuration
 */
export const LLAMA_API_REGION = 'us-central1';
export const LLAMA_API_ENDPOINT = `${LLAMA_API_REGION}-aiplatform.googleapis.com`;

/**
 * Default safety settings for LLAMA
 */
export const LLAMA_SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

/**
 * Default generation config for LLAMA
 */
export const LLAMA_GENERATION_CONFIG = {
  temperature: 0.0,
  top_p: 1,
  max_tokens: 2048,
};

/**
 * Get access token for LLAMA API calls
 */
async function getAccessToken(): Promise<string> {
  const credentials = getLlamaCredentials();
  const projectId = process.env.LLAMA_PROJECT_ID;

  if (!credentials || !projectId) {
    throw new Error('LLAMA credentials or project ID not found');
  }

  // Use GoogleAuth to get access token
  const { GoogleAuth } = require('google-auth-library');
  const auth = new GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();

  if (!tokenResponse.token) {
    throw new Error('Failed to get access token');
  }

  return tokenResponse.token;
}

/**
 * Generate content using LLAMA API (OpenAI-compatible endpoint)
 * Falls back to Gemini if LLAMA fails
 */
export async function generateLlamaContent(prompt: string): Promise<string> {
  const projectId = process.env.LLAMA_PROJECT_ID;
  const region = LLAMA_API_REGION;
  const endpoint = LLAMA_API_ENDPOINT;

  if (!projectId) {
    throw new Error('LLAMA_PROJECT_ID not set');
  }

  try {
    // Get access token
    const accessToken = await getAccessToken();

    // Prepare request
    const url = `https://${endpoint}/v1/projects/${projectId}/locations/${region}/endpoints/openapi/chat/completions`;

    const requestBody = {
      model: LLAMA_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: LLAMA_GENERATION_CONFIG.temperature,
      top_p: LLAMA_GENERATION_CONFIG.top_p,
      max_tokens: LLAMA_GENERATION_CONFIG.max_tokens,
      stream: false,
    };

    console.log('🚀 Calling LLAMA API:', {
      model: LLAMA_MODEL,
      endpoint: url,
    });

    // Make API call
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ LLAMA API error:', errorText);

      // If 404, model not available - fallback to Gemini
      if (response.status === 404) {
        console.log('⚠️  LLAMA model not available, falling back to Gemini...');
        return await generateGeminiContentFallback(prompt);
      }

      throw new Error(`LLAMA API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Extract content from OpenAI-compatible response
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in LLAMA API response');
    }

    console.log('✅ LLAMA API response received');
    return content;
  } catch (error: any) {
    // Fallback to Gemini on any LLAMA error
    console.log('⚠️  LLAMA failed, using Gemini fallback...', error.message);
    return await generateGeminiContentFallback(prompt);
  }
}

/**
 * Fallback to Gemini if LLAMA is not available
 */
async function generateGeminiContentFallback(prompt: string): Promise<string> {
  console.log('🔄 Using Gemini model as fallback...');

  const vertexAI = initializeVertexAI();
  if (!vertexAI) {
    throw new Error('Neither LLAMA nor Gemini is available');
  }

  const model = vertexAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    safetySettings: LLAMA_SAFETY_SETTINGS,
    generationConfig: {
      temperature: LLAMA_GENERATION_CONFIG.temperature,
      topP: LLAMA_GENERATION_CONFIG.top_p,
      maxOutputTokens: LLAMA_GENERATION_CONFIG.max_tokens,
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!text) {
    throw new Error('No response from Gemini fallback');
  }

  console.log('✅ Gemini fallback response received');
  return text;
}
