# RISARA MongoDB Quick Reference

## Database Connection
```javascript
MONGO_URI: mongodb+srv://paper-ai-admin:***@paper-ocr.c705m47.mongodb.net/
Database: risara
```

## Collections at a Glance

| Collection | Docs | Purpose | Key Use |
|------------|------|---------|---------|
| **tiktok_data** | 12 | TikTok posts | Real-time social monitoring |
| **news_data** | 111 | News articles | Media analysis |
| **insight_tiktok_jakarta** | 1/day | TikTok insights | Daily TikTok summary |
| **insight_news_jakarta** | 1/day | News insights | Daily news summary |

## Essential Fields for Visualizations

### Priority Monitoring
```javascript
urgency_level        // 0-100 score (>= 80 = critical, >= 70 = urgent)
sentiment            // "Positive" | "Negative" | "Neutral"
post_created_at      // Timestamp for trends
topic_classification // Main category
```

### Engagement Tracking
```javascript
// TikTok
like_count           // Engagement metric

// News
engagement_rate      // Performance score
influence_score      // Impact measurement
reach_score          // Audience size
```

### Content Analysis
```javascript
post_caption         // Main text content
contextual_keywords  // AI-extracted themes
post_hashtags        // Trending tags
```

## Common Query Patterns

### Get Critical Issues (Last 7 Days)
```javascript
collection.find({
  urgency_level: { $gte: 80 },
  post_created_at: { $gte: sevenDaysAgo }
})
```

### Sentiment Distribution by Topic
```javascript
collection.aggregate([
  { $group: {
      _id: { topic: '$topic_classification', sentiment: '$sentiment' },
      count: { $sum: 1 }
  }}
])
```

### Daily Urgency Trends
```javascript
collection.aggregate([
  { $group: {
      _id: { $substr: ['$post_created_at', 0, 10] },
      avgUrgency: { $avg: '$urgency_level' },
      count: { $sum: 1 }
  }},
  { $sort: { _id: 1 } }
])
```

## Topic Categories

### TikTok (4 topics)
- Social and Economy
- Government and Public Policy
- Infrastructure and Transportation
- Safety and Crime

### News (8 topics)
- Social and Economy
- Infrastructure and Transportation
- Government and Public Policy
- Technology and Innovation
- Environment and Disaster
- Safety and Crime
- Education and Culture
- Ecology and Green Spaces

## Urgency Thresholds

| Level | Range | Use Case |
|-------|-------|----------|
| Critical | >= 80 | Immediate alerts |
| Urgent | >= 70 | Dashboard priority |
| High | >= 60 | Monitoring |
| Medium | 40-59 | Tracking |
| Low | < 40 | Background |

## Data Stats

### TikTok
- **Date Range:** 2022-09-08 to 2025-10-11
- **Avg Urgency:** 71.25/100 (high priority)
- **Engagement:** 32-503 likes

### News
- **Date Range:** 2022-12-09 to 2025-10-12
- **Avg Urgency:** 48.65/100 (moderate)
- **Avg Engagement Rate:** 87-119

## API Endpoints

### Unified Monitoring
```
GET /api/unified-monitoring?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD&page=1
```
Returns: metrics, trends, top posts, regional distribution

### Dashboard Data
```
GET /api/dashboard?source=news|tiktok&page=1&itemsPerPage=10
```
Returns: stats, paginated content, insights

### Trending Topics
```
GET /api/trending?source=news|tiktok
```
Returns: trending topics/hashtags/locations

## Quick Visualization Ideas

### High Priority (Build First)
1. **Executive Dashboard** - KPIs, urgency gauge, critical alerts
2. **Unified Monitoring** - Cross-platform trends, sentiment analysis
3. **Engagement Analytics** - Top posts, influencer leaderboard
4. **AI Insights** - Daily recommendations from insight collections

### Medium Priority
5. **Topic Analysis** - Distribution, trends by category
6. **Keyword Trends** - Word clouds, hashtag tracking
7. **Regional Heatmap** - Geographic distribution (needs better data)

## Pro Tips

1. **Filter by urgency >= 70** for most dashboards (removes noise)
2. **Use sentiment only on urgent posts** for meaningful analysis
3. **Combine like_count (TikTok) + engagement_rate (News)** for unified metrics
4. **Date format is inconsistent** - normalize before charting
5. **Regional data is limited** - all currently "DKI Jakarta"

## Color Coding Recommendations

### Urgency
- 80-100: Red (#EF4444)
- 60-79: Orange (#F59E0B)
- 40-59: Yellow (#EAB308)
- 0-39: Green (#10B981)

### Sentiment
- Positive: Green (#10B981)
- Neutral: Gray (#6B7280)
- Negative: Red (#EF4444)

## Next Steps

1. ✅ Schema analyzed
2. ✅ Visualization mapping complete
3. ⬜ Build unified monitoring dashboard
4. ⬜ Implement real-time alerts (urgency >= 80)
5. ⬜ Create AI insights interface
6. ⬜ Enhance regional data collection
7. ⬜ Add historical trend tracking

---

**Files Generated:**
- `MONGODB_SCHEMA_ANALYSIS.md` - Comprehensive schema documentation
- `schema-visualization-mapping.json` - Developer-friendly mapping
- `QUICK_REFERENCE.md` - This quick reference guide
