// src/app/api/social-monitoring/executive-summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getInsightTikTokCollection, getInsightNewsCollection } from '@/lib/mongodb';
import { enhancedExecutiveSummary } from '@/lib/enhancedDummyData';
import { useDummyData } from '@/lib/useDummyData';
import { generateLlamaContent } from '@/lib/llamaConfig';

// Check if we should use dummy data
const USE_DUMMY_DATA = useDummyData();

function generateExecutiveSummaryPrompt(tiktokInsights: any[], newsInsights: any[], date: string) {
  const formatInsights = (insights: any[], platform: string) => {
    return insights.map((insight, idx) =>
      `${idx + 1}. [${platform}] Topic: ${insight.topic || 'General'}
   Issue: ${insight.main_issue}
   Problem: ${insight.problem}
   Suggestion: ${insight.suggestion}
   Urgency: ${insight.urgency_score}/100`
    ).join('\n\n');
  };

  const tiktokText = tiktokInsights.length > 0
    ? formatInsights(tiktokInsights, 'TikTok')
    : 'Tidak ada data TikTok';

  const newsText = newsInsights.length > 0
    ? formatInsights(newsInsights, 'News')
    : 'Tidak ada data News';

  return `Anda adalah analyst senior untuk platform RISARA (AI-powered strategic intelligence untuk Jakarta).

Tugas Anda: Buatkan EXECUTIVE SUMMARY komprehensif untuk tanggal ${date} berdasarkan data insights dari TikTok dan Media News.

**Data Insights TikTok:**
${tiktokText}

**Data Insights News:**
${newsText}

**Format Output (dalam Markdown):**

## 📊 Ringkasan Eksekutif - ${date}

### 🚨 Isu Kritis (Urgency ≥ 80)
[Jika ada isu dengan urgency ≥ 80, list maksimal 3 isu paling kritis dengan format:]
- **[Topic]** - [Main Issue]
  - Masalah: [Ringkas problem]
  - Rekomendasi: [Action item spesifik dan actionable]

[Jika tidak ada, tulis: "✅ Tidak ada isu kritis yang memerlukan perhatian segera."]

### ⚠️ Perlu Perhatian (Urgency 60-79)
[List maksimal 5 isu dengan format ringkas:]
- **[Topic]**: [Main issue dalam 1 kalimat] - [Suggestion singkat]

[Jika tidak ada, tulis: "✅ Tidak ada isu yang memerlukan perhatian khusus."]

### 📈 Trend & Insight Utama
[Analisis pattern dari data. Contoh:]
- **Topik Dominan**: [Topik yang paling sering muncul]
- **Sentimen Publik**: [Observasi sentimen dari isu-isu]
- **Platform Engagement**: [Perbandingan TikTok vs News, mana yang lebih urgent]
- **Regional Focus**: [Area Jakarta yang paling banyak disebutkan]

### 💡 Rekomendasi Aksi Prioritas
[Berikan 3-5 action items prioritized berdasarkan urgency dan impact:]
1. **[Prioritas 1]**: [Specific action untuk isu paling critical] _(Urgency: X/100)_
2. **[Prioritas 2]**: [Specific action] _(Urgency: X/100)_
3. **[Prioritas 3]**: [Specific action] _(Urgency: X/100)_

### 📌 Catatan Penting
[Tambahan insight atau warning yang perlu attention dari pemerintah]

---

**PENTING:**
- Fokus pada actionable insights untuk government decision makers
- Gunakan bahasa formal dan profesional
- Prioritaskan berdasarkan urgency score
- Jika data terbatas, acknowledge dan fokus pada insight yang ada
- Berikan specific recommendations, bukan generic advice`;
}

export async function GET(request: NextRequest) {
  try {
    // Use dummy data if enabled
    if (USE_DUMMY_DATA) {
      console.log('🎭 Using enhanced dummy data for executive summary');
      // Ensure the response structure matches what the component expects
      return NextResponse.json(enhancedExecutiveSummary);
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Fetch insights from MongoDB
    const tiktokInsightCollection = await getInsightTikTokCollection();
    const newsInsightCollection = await getInsightNewsCollection();

    const [tiktokDocs, newsDocs] = await Promise.all([
      tiktokInsightCollection.find({}).sort({ created_at: -1 }).limit(1).toArray(),
      newsInsightCollection.find({}).sort({ created_at: -1 }).limit(1).toArray()
    ]);

    // Extract insights
    const tiktokInsights = tiktokDocs[0]?.insight || [];
    const newsInsights = newsDocs[0]?.insight || [];

    // If no data available
    if (tiktokInsights.length === 0 && newsInsights.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          summary: `## 📊 Ringkasan Eksekutif - ${date}\n\n**Tidak ada data insights yang tersedia untuk tanggal ini.**\n\nSilakan periksa kembali atau tunggu hingga data dikumpulkan dari sumber TikTok dan News.`,
          rawData: {
            tiktok: [],
            news: []
          },
          metadata: {
            date,
            totalInsights: 0,
            criticalIssues: 0,
            avgUrgency: 0
          }
        },
        timestamp: new Date().toISOString()
      });
    }

    // Sort by urgency (highest first) and limit to top issues
    const sortedTikTok = tiktokInsights.sort((a: any, b: any) => b.urgency_score - a.urgency_score).slice(0, 10);
    const sortedNews = newsInsights.sort((a: any, b: any) => b.urgency_score - a.urgency_score).slice(0, 10);

    // Generate prompt
    const prompt = generateExecutiveSummaryPrompt(sortedTikTok, sortedNews, date);

    // Call LLAMA API (with automatic Gemini fallback)
    let summaryText;
    try {
      summaryText = await generateLlamaContent(prompt);
    } catch (error: any) {
      console.error('❌ Error generating executive summary:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate executive summary',
          details: error.message
        },
        { status: 500 }
      );
    }

    if (!summaryText) {
      return NextResponse.json(
        {
          success: false,
          error: 'No response from AI'
        },
        { status: 500 }
      );
    }

    // Calculate metadata
    const allInsights = [...sortedTikTok, ...sortedNews];
    const metadata = {
      date,
      totalInsights: allInsights.length,
      criticalIssues: allInsights.filter((i: any) => i.urgency_score >= 80).length,
      highPriorityIssues: allInsights.filter((i: any) => i.urgency_score >= 60 && i.urgency_score < 80).length,
      avgUrgency: allInsights.length > 0
        ? allInsights.reduce((sum: number, i: any) => sum + i.urgency_score, 0) / allInsights.length
        : 0,
      byPlatform: {
        tiktok: sortedTikTok.length,
        news: sortedNews.length
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        summary: summaryText,
        rawData: {
          tiktok: sortedTikTok,
          news: sortedNews
        },
        metadata
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating executive summary:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate executive summary',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
