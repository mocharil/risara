import { NextResponse } from 'next/server'
import { client } from '@/lib/elasticsearch'


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const searchQuery = body.query

    const searchBody = {
      size: 10,
      sort: [
        {
          post_created_at: "desc"
        }
      ],
      _source: [
        "title",
        "link_post",
        "post_media_link",
        "post_caption",
        "post_created_at",
        "topic",
        "sentiment",
        "viral_score",
        "issue",
        "region",
        "description"
      ],
      query: searchQuery
        ? {
            multi_match: {
              query: searchQuery,
              fields: ["post_caption", "title", "description"]
            }
          }
        : {
            match_all: {}
          }
    }

    const result = await client.search({
      index: 'news_data',
      body: searchBody
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search news' },
      { status: 500 }
    )
  }
}