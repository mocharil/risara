// src/lib/geminiConfig.ts
import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Get Gemini credentials from environment variables
 * Supports both GEMINI_CREDS_JSON (JSON string) and GEMINI_CREDS_PATH (file path)
 *
 * Priority:
 * 1. GEMINI_CREDS_JSON (for Vercel deployment without file upload)
 * 2. GEMINI_CREDS_PATH (for local development with credentials file)
 */
export function getGeminiCredentials(): any | null {
  try {
    // Priority 1: Try GEMINI_CREDS_JSON environment variable (for Vercel)
    const credentialsJson = process.env.GEMINI_CREDS_JSON;
    if (credentialsJson) {
      console.log('✅ Using GEMINI_CREDS_JSON from environment variable');
      return JSON.parse(credentialsJson);
    }

    // Priority 2: Try GEMINI_CREDS_PATH (for local development)
    const credentialsPath = process.env.GEMINI_CREDS_PATH;
    if (credentialsPath) {
      const fullPath = path.resolve(process.cwd(), credentialsPath);
      if (fs.existsSync(fullPath)) {
        console.log('✅ Using GEMINI_CREDS_PATH from file:', credentialsPath);
        const credentialsContent = fs.readFileSync(fullPath, 'utf-8');
        return JSON.parse(credentialsContent);
      } else {
        console.warn('⚠️  GEMINI_CREDS_PATH file not found:', fullPath);
      }
    }

    console.warn('⚠️  No Gemini credentials found. Set GEMINI_CREDS_JSON or GEMINI_CREDS_PATH');
    return null;
  } catch (error) {
    console.error('❌ Error loading Gemini credentials:', error);
    return null;
  }
}

/**
 * Initialize Vertex AI with credentials from environment
 */
export function initializeVertexAI(): VertexAI | null {
  try {
    const projectId = process.env.GEMINI_PROJECT_ID;
    if (!projectId) {
      console.error('❌ GEMINI_PROJECT_ID not set in environment variables');
      return null;
    }

    const credentials = getGeminiCredentials();
    if (!credentials) {
      console.error('❌ Failed to load Gemini credentials');
      return null;
    }

    const vertexAI = new VertexAI({
      project: projectId,
      location: 'us-central1',
      googleAuthOptions: {
        credentials: credentials,
      },
    });

    console.log('✅ VertexAI initialized successfully');
    return vertexAI;
  } catch (error) {
    console.error('❌ Error initializing VertexAI:', error);
    return null;
  }
}

/**
 * Default Gemini model configuration
 */
export const GEMINI_MODEL = 'gemini-2.5-flash-lite';

/**
 * Default safety settings for Gemini
 */
export const GEMINI_SAFETY_SETTINGS = [
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
 * Default generation config for Gemini
 */
export const GEMINI_GENERATION_CONFIG = {
  temperature: 0.0,
  topP: 1,
  topK: 32,
  maxOutputTokens: 2048,
};
