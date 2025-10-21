import { NextResponse } from 'next/server';
import { getTikTokCollection } from '@/lib/mongodb';
import { enhancedTikTokPosts } from '@/lib/enhancedDummyData';

// Check if we should use dummy data
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

interface PostSource {
  username: string;
  post_caption: string;
  post_created_at: string;
  topic_classification?: string;
  sentiment?: string;
  urgency_level?: number;
  affected_region?: string;
  link_post?: string;
  post_mentions?: string | string[];
  post_hashtags?: string | string[];
}

// Helper function to ensure array type
const ensureArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return [value];
    }
  }
  return [];
};

// Helper function to format mentions
const formatMentions = (mentions: unknown): string[] => {
  const mentionsArray = ensureArray(mentions);
  return mentionsArray.map(mention => {
    const cleanMention = String(mention).replace(/^@+/, '');
    return `@${cleanMention}`;
  });
};

// Helper function to format hashtags
const formatHashtags = (hashtags: unknown): string[] => {
  const hashtagsArray = ensureArray(hashtags);
  return hashtagsArray.map(hashtag => {
    const cleanHashtag = String(hashtag).replace(/^#+/, '');
    return `#${cleanHashtag}`;
  });
};

export async function GET(request: Request) {
  let originalUsername = '';
  let cleanUsername = '';

  try {
    const { searchParams } = new URL(request.url);
    originalUsername = searchParams.get('username') || '';

    if (!originalUsername) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Remove @ and # from input
    cleanUsername = originalUsername.replace(/[@#]/g, '');
    console.log('Original input:', originalUsername);
    console.log('Cleaned username:', cleanUsername);

    // Determine node type based on original input
    const nodeType = originalUsername.startsWith('@') ? 'user/mention' :
                    originalUsername.startsWith('#') ? 'hashtag' : 'user';

    let docs: any[];

    if (USE_DUMMY_DATA) {
      console.log('🎭 Using enhanced dummy data for user tweets');

      // Filter enhanced dummy data
      docs = enhancedTikTokPosts.filter((doc: any) => {
        if (nodeType === 'hashtag') {
          // Search for posts with this hashtag
          const hashtags = ensureArray(doc.post_hashtags);
          return hashtags.some(h =>
            h.toLowerCase().includes(cleanUsername.toLowerCase()) ||
            h.toLowerCase().includes(originalUsername.toLowerCase())
          );
        } else {
          // Search for posts by username or mentions
          const mentions = ensureArray(doc.post_mentions);
          return doc.username?.toLowerCase().includes(cleanUsername.toLowerCase()) ||
                 mentions.some(m =>
                   m.toLowerCase().includes(cleanUsername.toLowerCase()) ||
                   m.toLowerCase().includes(originalUsername.toLowerCase())
                 );
        }
      }).sort((a: any, b: any) => (b.urgency_level || 0) - (a.urgency_level || 0)).slice(0, 30);
    } else {
      const collection = await getTikTokCollection();

      let query: any;

      if (nodeType === 'hashtag') {
        // Search for posts with this hashtag
        query = {
          $or: [
            { post_hashtags: { $regex: originalUsername, $options: 'i' } },
            { post_hashtags: { $regex: cleanUsername, $options: 'i' } }
          ]
        };
      } else {
        // Search for posts by username or mentions
        query = {
          $or: [
            { username: { $regex: cleanUsername, $options: 'i' } },
            { post_mentions: { $regex: originalUsername, $options: 'i' } },
            { post_mentions: { $regex: cleanUsername, $options: 'i' } }
          ]
        };
      }

      docs = await collection
        .find(query)
        .sort({ urgency_level: -1 })
        .limit(30)
        .toArray();
    }

    if (docs.length === 0) {
      return NextResponse.json({
        tweets: [],
        meta: {
          total: 0,
          query_term: originalUsername,
          clean_query_term: cleanUsername,
          node_type: nodeType,
          breakdown: { as_author: 0, as_mentioned: 0, in_hashtag: 0 }
        }
      });
    }

    const posts = docs.map((doc: any) => {
      const source = doc as PostSource;

      return {
        username: source.username,
        full_text: source.post_caption,
        date: source.post_created_at,
        topic_classification: source.topic_classification || 'Unclassified',
        sentiment: source.sentiment || 'Neutral',
        urgency_level: source.urgency_level || 0,
        target_audience: source.affected_region || '',
        link_post: source.link_post,
        mentions: formatMentions(source.post_mentions),
        hastags: formatHashtags(source.post_hashtags),
        relation_type: nodeType === 'hashtag' ? 'hashtag' :
                      cleanUsername.toLowerCase() === source.username?.toLowerCase() ? 'author' :
                      formatMentions(source.post_mentions).some(m =>
                        m.toLowerCase().includes(cleanUsername.toLowerCase())
                      ) ? 'mentioned' : 'unknown'
      };
    });

    const meta = {
      total: docs.length,
      query_term: originalUsername,
      clean_query_term: cleanUsername,
      node_type: nodeType,
      breakdown: {
        as_author: posts.filter(p => p.relation_type === 'author').length,
        as_mentioned: posts.filter(p => p.relation_type === 'mentioned').length,
        in_hashtag: posts.filter(p => p.relation_type === 'hashtag').length
      }
    };

    return NextResponse.json({ tweets: posts, meta });

  } catch (error: any) {
    console.error('Error details:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch related posts',
        details: error instanceof Error ? error.message : 'Unknown error',
        query: {
          original: originalUsername,
          clean: cleanUsername
        }
      },
      { status: 500 }
    );
  }
}
