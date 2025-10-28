// src/app/api/llama/summarize/route.ts
import { NextResponse } from 'next/server';
import { generateLlamaContent } from '@/lib/llamaConfig';

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

    // Call LLAMA API using OpenAI-compatible endpoint
    const text = await generateLlamaContent(prompt);

    if (!text) {
      return NextResponse.json(
        { error: 'No response from LLAMA API' },
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
    console.error('LLAMA API error:', error);
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
