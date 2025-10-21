// src/app/api/gemini/summarize/route.ts
import { NextResponse } from 'next/server';
import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import * as fs from 'fs';
import * as path from 'path';

const projectId = process.env.GEMINI_PROJECT_ID || '';
const credentialsPath = process.env.GEMINI_CREDS_PATH || '';

// Read credentials file
let credentials: any = null;
try {
  const fullPath = path.resolve(process.cwd(), credentialsPath);
  if (fs.existsSync(fullPath)) {
    const credentialsContent = fs.readFileSync(fullPath, 'utf-8');
    credentials = JSON.parse(credentialsContent);
  }
} catch (error) {
  console.error('Error reading credentials file:', error);
}

// Initialize Vertex AI
let vertexAI: VertexAI | null = null;
try {
  vertexAI = new VertexAI({
    project: projectId,
    location: 'us-central1',
    googleAuthOptions: credentials ? {
      credentials: credentials,
    } : {
      keyFilename: credentialsPath,
    },
  });
} catch (error) {
  console.error('Error initializing VertexAI:', error);
}

const model = 'gemini-2.5-flash-lite';

const safetySettings = [
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

const generationConfig = {
  temperature: 0.0,
  topP: 1,
  topK: 32,
  maxOutputTokens: 2048,
};

function generateSummaryPrompt(posts: Array<{ full_text: string; contextual_content: string }>) {
  const postsText = posts
    .map((post, index) => `Post ${index + 1}:\n${post.full_text}\nContext: ${post.contextual_content}`)
    .join('\n\n');

  return `Given a list of TikTok posts, analyze and summarize the main issues, problems, and provide suggestions. Output should be in JSON format.

Guidelines:

1. Main Issue: Identify the primary theme or topic that appears across multiple posts
2. Problem: Describe the specific problems or concerns raised in the posts
3. Suggestion: Provide actionable recommendations to address the issues
4. Urgency Score: Rate from 0-100 based on the severity and time-sensitivity of the issues

Return the output in JSON format:
{
  "main_issue": "Brief description of the main issue",
  "problem": "Detailed description of the problems",
  "suggestion": "Actionable suggestions",
  "urgency_score": "0-100"
}

TikTok Posts:
${postsText}`;
}

export async function POST(request: Request) {
  try {
    // Validate VertexAI initialization
    if (!vertexAI) {
      console.error('VertexAI not initialized. Check credentials and project ID.');
      return NextResponse.json(
        {
          error: 'Gemini service not initialized',
          details: 'Check GEMINI_PROJECT_ID and GEMINI_CREDS_PATH environment variables'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { search_results } = body;

    if (!Array.isArray(search_results) || search_results.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty search_results' },
        { status: 400 }
      );
    }

    // Generate prompt
    const prompt = generateSummaryPrompt(search_results);

    // Get generative model
    const generativeModel = vertexAI.getGenerativeModel({
      model: model,
      safetySettings: safetySettings,
      generationConfig: generationConfig,
    });

    // Generate content
    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      return NextResponse.json(
        { error: 'No response from Gemini API' },
        { status: 500 }
      );
    }

    // Parse JSON from response
    let summary;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || text.match(/(\{[\s\S]*\})/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      summary = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', text);
      return NextResponse.json(
        { error: 'Failed to parse summary', details: text },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        error: 'Failed to generate summary',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
