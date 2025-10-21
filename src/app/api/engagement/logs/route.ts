import { client } from '@/lib/elasticsearch'
import { NextResponse } from 'next/server';
import { enhancedChatLogs } from '@/lib/enhancedDummyData';

// Check if we should use dummy data
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

interface ChatLog {
  user_id: string;
  username: string;
  message_text: string;
  bot_response: string;
  timestamp: string;
  response_time_ms: number;
  affected_region: string;
  topic_classification: string;
  urgency_level: number;
  sentiment:string;
}


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';

    let logs: any[];

    if (USE_DUMMY_DATA) {
      // Use enhanced dummy chat logs
      console.log('🎭 Using enhanced dummy data for chat logs');

      // Filter by search query if provided
      const filteredLogs = searchQuery
        ? enhancedChatLogs.filter(log =>
            log.message_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.bot_response.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.user_id.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : enhancedChatLogs;

      logs = filteredLogs.slice(0, 100).map(log => ({
        user_id: log.user_id,
        username: log.username,
        message_text: log.message_text,
        bot_response: log.bot_response,
        timestamp: log.timestamp,
        response_time_ms: log.response_time_seconds * 1000, // Convert to milliseconds
        affected_region: log.affected_region,
        topic_classification: log.classification_topic,
        urgency_level: log.urgency_level,
        sentiment: log.sentiment,
      }));
    } else {
      const query = {
        bool: {
          must: [
            searchQuery
              ? {
                  multi_match: {
                    query: searchQuery,
                    fields: ['message_text', 'bot_response', 'user_id'],
                  },
                }
              : {
                  match_all: {},
                },
          ],
        },
      };

      const response = await client.search({
        index: 'chat_interactions',
        body: {
          query,
          sort: [{ timestamp: { order: 'desc' } }],
          size: 100, // Limit to last 100 messages
        },
      });

      logs = response.hits.hits.map(hit => {
        const source = hit._source as ChatLog;

        return {
          user_id: source.user_id,
          username: source.username,
          message_text: source.message_text,
          bot_response: source.bot_response,
          timestamp: source.timestamp,
          response_time_ms: source.response_time_ms,
          affected_region: source.affected_region,
          topic_classification: source.topic_classification,
          urgency_level: source.urgency_level,
          sentiment: source.sentiment,
        };
      });
    }

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching chat logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat logs' },
      { status: 500 }
    );
  }
}
