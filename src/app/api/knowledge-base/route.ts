// src/app/api/knowledge-base/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeBaseCollection } from '@/lib/mongodb';
import { uploadFileToGCS, generateUniqueFileName } from '@/lib/gcsConfig';

// Configure route for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds for file upload

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const topic_classification = formData.get('topic_classification') as string;
    const keywordsString = formData.get('keywords') as string;
    const file = formData.get('file') as File | null;

    // Validate required fields
    if (!title || !content || !topic_classification) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, or topic_classification' },
        { status: 400 }
      );
    }

    // Parse keywords
    const keywords = keywordsString
      ? keywordsString.split(',').map((k) => k.trim()).filter(Boolean)
      : [];

    // Prepare document for MongoDB
    const knowledgeBaseDoc: any = {
      title,
      content,
      topic_classification,
      keywords,
      created_at: new Date(),
      updated_at: new Date(),
      file_url: null,
      file_name: null,
      file_size: null,
      file_type: null,
    };

    // Handle file upload to GCS if file exists
    if (file) {
      console.log(`=� Processing file: ${file.name} (${file.size} bytes)`);

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size exceeds 10MB limit' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only PDF, DOCX, and TXT files are allowed' },
          { status: 400 }
        );
      }

      try {
        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Generate unique file name
        const uniqueFileName = generateUniqueFileName(file.name);

        // Upload to GCS
        const fileUrl = await uploadFileToGCS(buffer, uniqueFileName);

        if (!fileUrl) {
          console.error('Failed to upload file to GCS');
          return NextResponse.json(
            { error: 'Failed to upload file to cloud storage' },
            { status: 500 }
          );
        }

        // Add file metadata to document
        knowledgeBaseDoc.file_url = fileUrl;
        knowledgeBaseDoc.file_name = file.name;
        knowledgeBaseDoc.file_size = file.size;
        knowledgeBaseDoc.file_type = file.type;

        console.log(` File uploaded successfully: ${fileUrl}`);
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        return NextResponse.json(
          {
            error: 'Failed to upload file',
            details: uploadError instanceof Error ? uploadError.message : 'Unknown error'
          },
          { status: 500 }
        );
      }
    }

    // Save to MongoDB
    try {
      const collection = await getKnowledgeBaseCollection();
      const result = await collection.insertOne(knowledgeBaseDoc);

      console.log(` Knowledge base entry saved to MongoDB: ${result.insertedId}`);

      return NextResponse.json({
        message: 'Knowledge base entry added successfully',
        id: result.insertedId,
        file_url: knowledgeBaseDoc.file_url,
      });
    } catch (dbError) {
      console.error('Error saving to MongoDB:', dbError);
      return NextResponse.json(
        {
          error: 'Failed to save knowledge base entry',
          details: dbError instanceof Error ? dbError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const collection = await getKnowledgeBaseCollection();

    // Get total count
    const total = await collection.countDocuments();

    // Get paginated results
    const entries = await collection
      .find({})
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      data: entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching knowledge base entries:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch knowledge base entries',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
