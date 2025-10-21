// ========================================
// RISARA - DUMMY DATA FOR DEMONSTRATION
// ========================================
// This file contains comprehensive dummy data for all features
// to enable full demonstration without database dependency

// ========================================
// 1. LANDING PAGE STATISTICS
// ========================================

export const landingPageStats = {
  news: {
    totalArticles: 45823,
    highUrgency: 3247,
    governmentCoverage: 12458,
    positiveSentiment: 68.5,
  },
  tiktok: {
    totalEngagements: 2847592,
    citizenReach: 8934567,
    activeDiscussions: 15834,
    positiveResponse: 72.3,
  }
};

// ========================================
// 2. DASHBOARD DATA - NEWS ARTICLES
// ========================================

const urgencyLevels = ['low', 'medium', 'high', 'critical'];
const sentiments = ['positive', 'neutral', 'negative'];
const topics = [
  'Transportasi', 'Kesehatan', 'Pendidikan', 'Infrastruktur',
  'Lingkungan', 'Keamanan', 'Ekonomi', 'Sosial',
  'Banjir', 'Kemacetan', 'Polusi', 'Sampah'
];
const regions = [
  'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan',
  'Jakarta Timur', 'Jakarta Barat', 'Kepulauan Seribu'
];
const sources = [
  'Kompas.com', 'Detik.com', 'CNN Indonesia', 'Tempo.co',
  'Tribunnews', 'Liputan6', 'Antara News', 'JPNN'
];

// Generate realistic news articles
const generateNewsArticles = (count: number) => {
  const articles = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const urgency = urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];

    // Generate date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const articleDate = new Date(now);
    articleDate.setDate(articleDate.getDate() - daysAgo);

    const urgencyScore = urgency === 'critical' ? 85 + Math.random() * 15 :
                        urgency === 'high' ? 65 + Math.random() * 20 :
                        urgency === 'medium' ? 35 + Math.random() * 30 :
                        Math.random() * 35;

    const titles = {
      'Transportasi': [
        `MRT Jakarta Rute ${region} Dilaporkan Mengalami Gangguan Teknis`,
        `Kemacetan Parah di ${region}, Warga Keluhkan Transportasi Publik`,
        `Transjakarta Tambah Armada Baru untuk ${region}`,
        `Gubernur Tinjau Proyek LRT di ${region}`,
      ],
      'Banjir': [
        `Banjir Merendam ${region}, Ratusan Warga Mengungsi`,
        `BPBD DKI: Genangan di ${region} Sudah Surut`,
        `Warga ${region} Keluhkan Drainase yang Buruk`,
        `Pompa Air di ${region} Berhasil Atasi Banjir`,
      ],
      'Kesehatan': [
        `Puskesmas di ${region} Kekurangan Tenaga Medis`,
        `Vaksinasi Gratis di ${region} Digelar Minggu Ini`,
        `RS di ${region} Tingkatkan Layanan IGD`,
        `Kasus DBD Meningkat di ${region}`,
      ],
      'Pendidikan': [
        `Sekolah di ${region} Dapat Bantuan Renovasi`,
        `Prestasi Siswa ${region} di Olimpiade Sains Nasional`,
        `Kekurangan Guru di ${region} Menjadi Perhatian`,
        `Fasilitas Sekolah di ${region} Ditingkatkan`,
      ],
      'Infrastruktur': [
        `Pembangunan Jalan Tol ${region} Mencapai 70%`,
        `Jembatan di ${region} Mulai Direnovasi`,
        `Perbaikan Trotoar ${region} untuk Pejalan Kaki`,
        `Lampu Jalan di ${region} Diperbaiki`,
      ],
    };

    const titleOptions = titles[topic as keyof typeof titles] || [
      `Pemerintah DKI Fokus Atasi Masalah ${topic} di ${region}`,
      `Warga ${region} Apresiasi Program ${topic}`,
      `${topic} di ${region} Butuh Perhatian Khusus`,
    ];

    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];

    const content = `
${title}

${region} - Pemerintah Provinsi DKI Jakarta terus berupaya menangani berbagai permasalahan terkait ${topic.toLowerCase()} yang terjadi di wilayah ${region}. Berdasarkan laporan dari warga dan monitoring media sosial, isu ini mendapat perhatian yang cukup serius dari berbagai pihak.

Gubernur DKI Jakarta menegaskan komitmen pemerintah untuk segera menindaklanjuti keluhan warga. "Kami akan segera turun ke lapangan untuk melihat kondisi riil dan mencari solusi terbaik," ujarnya dalam konferensi pers.

Sementara itu, warga ${region} berharap pemerintah dapat segera mengambil tindakan konkret untuk mengatasi permasalahan ini. Beberapa tokoh masyarakat juga telah menyampaikan aspirasinya melalui berbagai saluran komunikasi.

Pihak terkait menjanjikan akan ada langkah-langkah perbaikan dalam waktu dekat untuk meningkatkan kualitas layanan publik di area tersebut.
    `.trim();

    articles.push({
      _id: `news_${i + 1}`,
      title,
      content,
      source,
      url: `https://${source.toLowerCase().replace('.', '-')}/jakarta/${topic.toLowerCase()}/${i + 1}`,
      published_at: articleDate.toISOString(),
      post_created_at: articleDate.toISOString(),
      urgency_level: urgencyScore,
      urgency_category: urgency,
      sentiment,
      sentiment_score: sentiment === 'positive' ? 0.6 + Math.random() * 0.4 :
                      sentiment === 'negative' ? -0.6 - Math.random() * 0.4 :
                      -0.2 + Math.random() * 0.4,
      topic_classification: topic,
      affected_region: region,
      engagement_count: Math.floor(Math.random() * 5000) + 100,
      share_count: Math.floor(Math.random() * 1000) + 50,
      comment_count: Math.floor(Math.random() * 500) + 20,
      contextual_keywords: [topic, region, 'Jakarta', 'Pemerintah'].concat(
        topic === 'Banjir' ? ['air', 'genangan', 'hujan'] :
        topic === 'Transportasi' ? ['macet', 'jalan', 'angkutan'] :
        topic === 'Kesehatan' ? ['rumah sakit', 'pasien', 'layanan'] :
        []
      ),
      author: `Reporter ${source}`,
      category: topic,
    });
  }

  return articles;
};

export const newsArticles = generateNewsArticles(200);

// ========================================
// 3. DASHBOARD DATA - TIKTOK POSTS
// ========================================

const generateTikTokPosts = (count: number) => {
  const posts = [];
  const now = new Date();

  const usernames = [
    'jakarta_update', 'warga_jkt', 'citizen_voice', 'jkt_monitoring',
    'jakarta_news', 'berita_jkt', 'info_jakarta', 'jkt_realtime',
    'citizen_jkt', 'jakarta_alerts', 'jkt_watch', 'jakarta_today',
    'suara_jakarta', 'jkt_info', 'jakarta_live', 'kabar_jakarta'
  ];

  const hashtags = [
    '#JakartaUpdate', '#InfoJakarta', '#JakartaHariIni', '#BeritaJakarta',
    '#Jakarta', '#BanjirJakarta', '#MacetJakarta', '#TransportasiJakarta',
    '#KesehatanJakarta', '#PendidikanJakarta', '#InfrastrukturJakarta'
  ];

  for (let i = 0; i < count; i++) {
    const urgency = urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const username = usernames[Math.floor(Math.random() * usernames.length)];

    const daysAgo = Math.floor(Math.random() * 30);
    const postDate = new Date(now);
    postDate.setDate(postDate.getDate() - daysAgo);

    const urgencyScore = urgency === 'critical' ? 85 + Math.random() * 15 :
                        urgency === 'high' ? 65 + Math.random() * 20 :
                        urgency === 'medium' ? 35 + Math.random() * 30 :
                        Math.random() * 35;

    const captions = {
      'Banjir': [
        `Banjir lagi di ${region}! Sudah berapa kali ini tahun ini? 😢 Mohon perhatian @DKIJakarta`,
        `Genangan setinggi lutut di ${region}. Kapan drainase diperbaiki? #BanjirJakarta`,
        `Alhamdulillah banjir di ${region} sudah surut. Terima kasih tim BPBD! 🙏`,
      ],
      'Transportasi': [
        `Macet parah di ${region} pagi ini. Perlu solusi cepat! 🚗`,
        `Transjakarta koridor ${region} penuh sesak. Tolong tambah armada dong`,
        `Terima kasih MRT Jakarta! Sekarang ke ${region} jadi cepat ✨`,
      ],
      'Kesehatan': [
        `Puskesmas ${region} pelayanannya bagus banget! Recommended 👍`,
        `Antrian RS di ${region} mengular. Perlu ditambah loket pendaftaran`,
        `Program vaksinasi gratis di ${region} sangat membantu warga 💉`,
      ],
    };

    const captionOptions = captions[topic as keyof typeof captions] || [
      `Update dari ${region} hari ini terkait ${topic} #Jakarta`,
      `Kondisi ${topic} di ${region} perlu perhatian khusus`,
    ];

    const caption = captionOptions[Math.floor(Math.random() * captionOptions.length)];

    const selectedHashtags = [hashtags[0], hashtags[1], ...hashtags.slice(2).sort(() => 0.5 - Math.random()).slice(0, 3)];
    const mentions = ['@DKIJakarta', '@AniesBaswedan', '@BPBDDKI'].filter(() => Math.random() > 0.5);

    const likes = Math.floor(Math.random() * 50000) + 1000;
    const comments = Math.floor(likes * (0.05 + Math.random() * 0.1));
    const shares = Math.floor(likes * (0.02 + Math.random() * 0.05));
    const views = likes * (10 + Math.floor(Math.random() * 20));

    posts.push({
      _id: `tiktok_${i + 1}`,
      post_id: `tt_${Date.now()}_${i}`,
      username,
      user_display_name: username.replace('_', ' ').toUpperCase(),
      post_caption: caption + ' ' + selectedHashtags.join(' '),
      post_created_at: postDate.toISOString(),
      like_count: likes,
      comment_count: comments,
      share_count: shares,
      view_count: views,
      play_count: views,
      engagement_rate: ((likes + comments + shares) / views * 100).toFixed(2),
      urgency_level: urgencyScore,
      urgency_category: urgency,
      sentiment,
      sentiment_score: sentiment === 'positive' ? 0.6 + Math.random() * 0.4 :
                      sentiment === 'negative' ? -0.6 - Math.random() * 0.4 :
                      -0.2 + Math.random() * 0.4,
      topic_classification: topic,
      affected_region: region,
      post_hashtags: selectedHashtags,
      post_mentions: mentions,
      contextual_keywords: [topic, region, 'Jakarta'].concat(selectedHashtags),
      video_url: `https://tiktok.com/@${username}/video/${i + 1}`,
      thumbnail_url: `https://picsum.photos/seed/${i}/400/600`,
    });
  }

  return posts;
};

export const tiktokPosts = generateTikTokPosts(200);

// ========================================
// 4. TRENDING TOPICS
// ========================================

export const trendingTopics = {
  news: [
    { keyword: 'Banjir Jakarta', count: 1247, trend: 'up', change: 45 },
    { keyword: 'Transportasi', count: 892, trend: 'up', change: 23 },
    { keyword: 'MRT Jakarta', count: 734, trend: 'down', change: -12 },
    { keyword: 'Macet', count: 687, trend: 'up', change: 34 },
    { keyword: 'Infrastruktur', count: 542, trend: 'up', change: 18 },
    { keyword: 'Kesehatan', count: 489, trend: 'stable', change: 2 },
    { keyword: 'Pendidikan', count: 423, trend: 'up', change: 15 },
    { keyword: 'Polusi', count: 387, trend: 'down', change: -8 },
  ],
  tiktok: [
    { keyword: '#BanjirJakarta', count: 3421, trend: 'up', change: 67 },
    { keyword: '#MacetJakarta', count: 2876, trend: 'up', change: 42 },
    { keyword: '#InfoJakarta', count: 2134, trend: 'stable', change: 5 },
    { keyword: '#JakartaUpdate', count: 1987, trend: 'up', change: 28 },
    { keyword: '#TransportasiJakarta', count: 1654, trend: 'down', change: -15 },
    { keyword: '#Jakarta', count: 1523, trend: 'up', change: 33 },
    { keyword: '#KesehatanJakarta', count: 1289, trend: 'up', change: 19 },
    { keyword: '#PendidikanJakarta', count: 1087, trend: 'stable', change: 3 },
  ],
};

// ========================================
// 5. SOCIAL MONITORING - URGENCY DATA
// ========================================

export const urgencyData = {
  overview: {
    totalIssues: 3247,
    criticalIssues: 487,
    highUrgency: 1205,
    mediumUrgency: 1089,
    lowUrgency: 466,
    avgResponseTime: '2.3 jam',
    resolvedToday: 156,
    pendingCritical: 89,
  },
  byTopic: topics.map(topic => ({
    topic,
    critical: Math.floor(Math.random() * 100) + 20,
    high: Math.floor(Math.random() * 200) + 50,
    medium: Math.floor(Math.random() * 150) + 30,
    low: Math.floor(Math.random() * 80) + 10,
  })),
  byRegion: regions.map(region => ({
    region,
    critical: Math.floor(Math.random() * 80) + 10,
    high: Math.floor(Math.random() * 150) + 30,
    medium: Math.floor(Math.random() * 120) + 20,
    low: Math.floor(Math.random() * 60) + 5,
    totalIssues: 0,
  })).map(r => ({
    ...r,
    totalIssues: r.critical + r.high + r.medium + r.low,
  })),
  sentimentDistribution: {
    positive: 2234,
    neutral: 1876,
    negative: 3142,
  },
  priorityIssues: [
    {
      id: 1,
      title: 'Banjir Parah di Jakarta Pusat - Jalan Utama Tergenang',
      urgency: 95,
      sentiment: 'negative',
      region: 'Jakarta Pusat',
      mentions: 847,
      trend: 'rising',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      title: 'Kemacetan Ekstrem di Tol Jakarta-Cikampek KM 15',
      urgency: 89,
      sentiment: 'negative',
      region: 'Jakarta Timur',
      mentions: 623,
      trend: 'rising',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      title: 'Sistem MRT Mengalami Gangguan Teknis',
      urgency: 86,
      sentiment: 'negative',
      region: 'Jakarta Selatan',
      mentions: 534,
      trend: 'stable',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      title: 'Kekurangan Vaksin di Puskesmas Jakarta Utara',
      urgency: 82,
      sentiment: 'negative',
      region: 'Jakarta Utara',
      mentions: 412,
      trend: 'rising',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      title: 'Polusi Udara Meningkat - AQI Mencapai Level Tidak Sehat',
      urgency: 78,
      sentiment: 'negative',
      region: 'Jakarta Selatan',
      mentions: 389,
      trend: 'rising',
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

// ========================================
// 6. NETWORK ANALYSIS DATA
// ========================================

export const networkData = {
  nodes: [
    // Influential users
    { id: 'user_1', label: '@jakarta_update', type: 'user', influence: 95, connections: 45, region: 'Jakarta Pusat' },
    { id: 'user_2', label: '@warga_jkt', type: 'user', influence: 87, connections: 38, region: 'Jakarta Selatan' },
    { id: 'user_3', label: '@citizen_voice', type: 'user', influence: 82, connections: 34, region: 'Jakarta Timur' },
    { id: 'user_4', label: '@jkt_monitoring', type: 'user', influence: 78, connections: 31, region: 'Jakarta Utara' },
    { id: 'user_5', label: '@jakarta_news', type: 'user', influence: 75, connections: 29, region: 'Jakarta Barat' },
    { id: 'user_6', label: '@berita_jkt', type: 'user', influence: 71, connections: 26, region: 'Jakarta Pusat' },
    { id: 'user_7', label: '@info_jakarta', type: 'user', influence: 68, connections: 24, region: 'Jakarta Selatan' },
    { id: 'user_8', label: '@jkt_realtime', type: 'user', influence: 64, connections: 22, region: 'Jakarta Timur' },

    // Popular hashtags
    { id: 'hash_1', label: '#BanjirJakarta', type: 'hashtag', usage: 3421, connections: 52 },
    { id: 'hash_2', label: '#MacetJakarta', type: 'hashtag', usage: 2876, connections: 48 },
    { id: 'hash_3', label: '#InfoJakarta', type: 'hashtag', usage: 2134, connections: 43 },
    { id: 'hash_4', label: '#JakartaUpdate', type: 'hashtag', usage: 1987, connections: 39 },
    { id: 'hash_5', label: '#TransportasiJakarta', type: 'hashtag', usage: 1654, connections: 35 },

    // Mentioned entities
    { id: 'mention_1', label: '@DKIJakarta', type: 'mention', mentions: 4521, connections: 67 },
    { id: 'mention_2', label: '@BPBDDKI', type: 'mention', mentions: 2134, connections: 41 },
    { id: 'mention_3', label: '@TransJakarta', type: 'mention', mentions: 1876, connections: 38 },
  ],
  edges: [
    // User to hashtag connections
    { source: 'user_1', target: 'hash_1', weight: 45 },
    { source: 'user_1', target: 'hash_2', weight: 38 },
    { source: 'user_1', target: 'hash_3', weight: 42 },
    { source: 'user_2', target: 'hash_1', weight: 35 },
    { source: 'user_2', target: 'hash_4', weight: 31 },
    { source: 'user_3', target: 'hash_2', weight: 29 },
    { source: 'user_3', target: 'hash_5', weight: 27 },
    { source: 'user_4', target: 'hash_3', weight: 33 },
    { source: 'user_5', target: 'hash_4', weight: 25 },
    { source: 'user_6', target: 'hash_1', weight: 28 },
    { source: 'user_7', target: 'hash_2', weight: 24 },
    { source: 'user_8', target: 'hash_5', weight: 22 },

    // User to mention connections
    { source: 'user_1', target: 'mention_1', weight: 52 },
    { source: 'user_2', target: 'mention_1', weight: 41 },
    { source: 'user_3', target: 'mention_2', weight: 35 },
    { source: 'user_4', target: 'mention_3', weight: 29 },
    { source: 'user_5', target: 'mention_1', weight: 33 },

    // Hashtag to mention connections
    { source: 'hash_1', target: 'mention_1', weight: 67 },
    { source: 'hash_2', target: 'mention_3', weight: 45 },
    { source: 'hash_3', target: 'mention_1', weight: 38 },
  ],
};

// ========================================
// 7. CITIZEN ENGAGEMENT DATA
// ========================================

export const engagementData = {
  stats: {
    criticalIssues: 89,
    activeSessions: 234,
    responseRate: 94.5,
    avgSentiment: 3.8,
  },
  chatLogs: Array.from({ length: 50 }, (_, i) => ({
    id: `chat_${i + 1}`,
    sessionId: `session_${Math.floor(Math.random() * 100) + 1}`,
    userId: `user_${Math.floor(Math.random() * 500) + 1}`,
    message: [
      'Bagaimana cara melaporkan banjir?',
      'Kapan sampah di daerah saya diangkut?',
      'Dimana lokasi puskesmas terdekat?',
      'Bagaimana mengurus KTP yang hilang?',
      'Apakah ada program vaksinasi gratis?',
    ][Math.floor(Math.random() * 5)],
    response: 'Terima kasih atas pertanyaannya. Kami akan segera membantu Anda.',
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    topic: topics[Math.floor(Math.random() * topics.length)],
    resolved: Math.random() > 0.3,
    responseTime: Math.floor(Math.random() * 300) + 30, // seconds
  })),
  topicDistribution: topics.map(topic => ({
    topic,
    count: Math.floor(Math.random() * 500) + 100,
    avgResponseTime: Math.floor(Math.random() * 180) + 60,
    satisfactionScore: 3.5 + Math.random() * 1.5,
  })),
  responseTrends: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      responses: Math.floor(Math.random() * 200) + 50,
      avgResponseTime: Math.floor(Math.random() * 120) + 60,
      satisfactionScore: 3.0 + Math.random() * 2.0,
    };
  }),
};

// ========================================
// 8. ANALYTICS DATA
// ========================================

export const analyticsData = {
  weekComparison: {
    thisWeek: {
      posts: 2847,
      engagement: 456789,
      reach: 1234567,
      sentiment: {
        positive: 68.5,
        neutral: 21.3,
        negative: 10.2,
      },
    },
    lastWeek: {
      posts: 2156,
      engagement: 389234,
      reach: 987654,
      sentiment: {
        positive: 64.2,
        neutral: 24.1,
        negative: 11.7,
      },
    },
    growth: {
      posts: 32.0,
      engagement: 17.4,
      reach: 25.0,
      positiv_sentiment: 6.7,
    },
  },
  sentimentTrends: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      positive: 50 + Math.random() * 30,
      neutral: 15 + Math.random() * 15,
      negative: 5 + Math.random() * 15,
    };
  }),
  criticalTopics: [
    { topic: 'Banjir', mentions: 1247, urgency: 92, sentiment: -0.65, trend: 'rising' },
    { topic: 'Transportasi', mentions: 892, urgency: 78, sentiment: -0.45, trend: 'rising' },
    { topic: 'Kemacetan', mentions: 734, urgency: 75, sentiment: -0.52, trend: 'stable' },
    { topic: 'Kesehatan', mentions: 687, urgency: 68, sentiment: 0.32, trend: 'rising' },
    { topic: 'Infrastruktur', mentions: 542, urgency: 65, sentiment: -0.28, trend: 'falling' },
  ],
  departmentMentions: [
    { department: 'Dinas Perhubungan', mentions: 1534, sentiment: -0.35 },
    { department: 'BPBD DKI', mentions: 1289, sentiment: 0.42 },
    { department: 'Dinas Kesehatan', mentions: 987, sentiment: 0.58 },
    { department: 'Dinas Pendidikan', mentions: 765, sentiment: 0.35 },
    { department: 'Dinas Lingkungan Hidup', mentions: 654, sentiment: -0.15 },
  ],
};

// ========================================
// 9. CRISIS TIMELINE DATA
// ========================================

export const crisisTimeline = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'Hujan Deras Memicu Banjir di Jakarta Pusat',
    severity: 'critical',
    mentions: 847,
    sentiment: -0.78,
    region: 'Jakarta Pusat',
    description: 'Curah hujan tinggi menyebabkan banjir di beberapa titik Jakarta Pusat',
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'BPBD Mengevakuasi Warga Terdampak Banjir',
    severity: 'high',
    mentions: 623,
    sentiment: 0.25,
    region: 'Jakarta Pusat',
    description: 'Tim BPBD DKI Jakarta bergerak cepat mengevakuasi warga',
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'Genangan Mulai Surut, Warga Kembali ke Rumah',
    severity: 'medium',
    mentions: 412,
    sentiment: 0.52,
    region: 'Jakarta Pusat',
    description: 'Genangan berangsur surut setelah pompa air bekerja maksimal',
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'Gubernur Tinjau Lokasi dan Janji Perbaikan Drainase',
    severity: 'low',
    mentions: 289,
    sentiment: 0.68,
    region: 'Jakarta Pusat',
    description: 'Gubernur DKI Jakarta turun langsung ke lokasi banjir',
  },
];

// ========================================
// 10. TOPIC MATRIX DATA
// ========================================

export const topicMatrix = topics.map((topic1, i) =>
  topics.map((topic2, j) => ({
    topic1,
    topic2,
    correlation: i === j ? 1.0 : Math.random() * 0.8,
    coOccurrence: i === j ? Math.floor(Math.random() * 500) + 200 : Math.floor(Math.random() * 200),
  }))
).flat();

// ========================================
// 11. PROBLEM-SOLUTION DATA
// ========================================

export const problemSolutionData = [
  {
    problem: 'Banjir berulang di Jakarta Pusat',
    mentions: 1247,
    urgency: 92,
    affectedRegions: ['Jakarta Pusat', 'Jakarta Utara'],
    solutions: [
      { solution: 'Normalisasi sungai dan kali', feasibility: 85, impact: 90, cost: 'high' },
      { solution: 'Perbaikan sistem drainase', feasibility: 78, impact: 85, cost: 'medium' },
      { solution: 'Pembuatan sumur resapan', feasibility: 92, impact: 65, cost: 'low' },
    ],
  },
  {
    problem: 'Kemacetan parah di jam sibuk',
    mentions: 892,
    urgency: 78,
    affectedRegions: ['Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat'],
    solutions: [
      { solution: 'Perluasan jalur MRT dan LRT', feasibility: 65, impact: 95, cost: 'high' },
      { solution: 'Penambahan armada Transjakarta', feasibility: 88, impact: 70, cost: 'medium' },
      { solution: 'Implementasi traffic engineering', feasibility: 82, impact: 60, cost: 'low' },
    ],
  },
  {
    problem: 'Kekurangan tenaga medis di Puskesmas',
    mentions: 687,
    urgency: 68,
    affectedRegions: ['Jakarta Utara', 'Jakarta Timur'],
    solutions: [
      { solution: 'Rekrutmen tenaga medis baru', feasibility: 75, impact: 85, cost: 'medium' },
      { solution: 'Program magang untuk fresh graduate', feasibility: 90, impact: 70, cost: 'low' },
      { solution: 'Kerjasama dengan rumah sakit swasta', feasibility: 68, impact: 75, cost: 'medium' },
    ],
  },
];

// ========================================
// 12. KEYWORDS CLOUD DATA
// ========================================

export const keywordsCloudData = [
  { text: 'banjir', value: 3421, sentiment: 'negative' },
  { text: 'macet', value: 2876, sentiment: 'negative' },
  { text: 'transportasi', value: 2134, sentiment: 'neutral' },
  { text: 'jakarta', value: 1987, sentiment: 'neutral' },
  { text: 'pemerintah', value: 1654, sentiment: 'neutral' },
  { text: 'kesehatan', value: 1523, sentiment: 'positive' },
  { text: 'infrastruktur', value: 1289, sentiment: 'neutral' },
  { text: 'pendidikan', value: 1087, sentiment: 'positive' },
  { text: 'drainase', value: 987, sentiment: 'negative' },
  { text: 'MRT', value: 876, sentiment: 'positive' },
  { text: 'transjakarta', value: 765, sentiment: 'neutral' },
  { text: 'gubernur', value: 654, sentiment: 'neutral' },
  { text: 'warga', value: 587, sentiment: 'neutral' },
  { text: 'solusi', value: 512, sentiment: 'positive' },
  { text: 'genangan', value: 487, sentiment: 'negative' },
  { text: 'jalan', value: 456, sentiment: 'neutral' },
  { text: 'layanan', value: 423, sentiment: 'positive' },
  { text: 'keluhan', value: 398, sentiment: 'negative' },
  { text: 'perbaikan', value: 367, sentiment: 'positive' },
  { text: 'cepat', value: 334, sentiment: 'positive' },
];

// ========================================
// 13. EXECUTIVE SUMMARY DATA
// ========================================

export const executiveSummary = {
  period: {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
  },
  overview: `
Dalam 7 hari terakhir, terdapat peningkatan signifikan dalam volume percakapan publik terkait isu-isu kritis di Jakarta.
Banjir dan transportasi mendominasi diskusi dengan total 2.139 mention, menunjukkan urgensi tinggi yang memerlukan respons cepat.

Sentimen publik menunjukkan tren positif dengan 68,5% respons positif terhadap tindakan pemerintah, naik 6,7% dari minggu sebelumnya.
Namun, isu banjir di Jakarta Pusat masih menunjukkan sentimen negatif tinggi (-0,78) yang perlu perhatian khusus.
  `.trim(),
  keyFindings: [
    'Peningkatan 45% mention terkait banjir setelah hujan deras 2 hari lalu',
    'Sentimen positif terhadap respons BPBD mencapai 78% (naik dari 62%)',
    'Kemacetan di Jakarta Timur menjadi isu emerging dengan pertumbuhan 67%',
    'Program vaksinasi gratis mendapat apresiasi tinggi (sentiment score: 0.85)',
  ],
  criticalActions: [
    {
      priority: 1,
      action: 'Normalisasi sungai di Jakarta Pusat (urgency: 92)',
      department: 'Dinas SDA',
      timeline: 'Immediate',
    },
    {
      priority: 2,
      action: 'Penambahan armada Transjakarta koridor Jakarta Timur',
      department: 'Dinas Perhubungan',
      timeline: '1-2 minggu',
    },
    {
      priority: 3,
      action: 'Rekrutmen tenaga medis Puskesmas Jakarta Utara',
      department: 'Dinas Kesehatan',
      timeline: '2-4 minggu',
    },
  ],
  recommendations: [
    'Intensifkan komunikasi publik terkait langkah-langkah mitigasi banjir',
    'Lanjutkan program vaksinasi gratis yang mendapat respon positif',
    'Evaluasi sistem drainase di titik-titik rawan genangan',
    'Koordinasi lintas dinas untuk penanganan kemacetan terpadu',
  ],
};

// ========================================
// 14. UNIFIED MONITORING DATA
// ========================================

export const unifiedMonitoringData = {
  metrics: {
    totalPosts: 8234,
    totalEngagement: 1234567,
    totalReach: 5678901,
    avgSentiment: 0.42,
    criticalIssues: 487,
    avgUrgency: 58.3,
  },
  growth: {
    posts: 23.5,
    engagement: 18.7,
    reach: 31.2,
    criticalIssues: -8.4, // negative is good
  },
  sentimentDistribution: {
    positive: 5234,
    neutral: 2187,
    negative: 813,
  },
  regionalData: regions.map(region => ({
    region,
    posts: Math.floor(Math.random() * 2000) + 500,
    urgency: Math.floor(Math.random() * 40) + 40,
    sentiment: -0.3 + Math.random() * 0.8,
    criticalIssues: Math.floor(Math.random() * 100) + 20,
  })),
  topPosts: [
    {
      id: 1,
      content: 'Banjir di Jakarta Pusat semakin parah! Butuh bantuan segera!',
      platform: 'tiktok',
      engagement: 45678,
      urgency: 95,
      sentiment: 'negative',
      region: 'Jakarta Pusat',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      content: 'Terima kasih BPBD yang cepat tanggap mengatasi banjir!',
      platform: 'tiktok',
      engagement: 34567,
      urgency: 42,
      sentiment: 'positive',
      region: 'Jakarta Pusat',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      content: 'MRT Jakarta selalu tepat waktu, mantap!',
      platform: 'tiktok',
      engagement: 28765,
      urgency: 15,
      sentiment: 'positive',
      region: 'Jakarta Selatan',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ],
  activityData: [...newsArticles, ...tiktokPosts]
    .sort((a, b) => new Date(b.post_created_at).getTime() - new Date(a.post_created_at).getTime())
    .slice(0, 100),
};

// ========================================
// HELPER FUNCTIONS
// ========================================

export const getNewsStats = () => ({
  totalArticles: newsArticles.length,
  highUrgency: newsArticles.filter(a => a.urgency_category === 'high' || a.urgency_category === 'critical').length,
  governmentCoverage: newsArticles.filter(a =>
    a.content.toLowerCase().includes('pemerintah') ||
    a.content.toLowerCase().includes('gubernur')
  ).length,
  positiveSentiment: (newsArticles.filter(a => a.sentiment === 'positive').length / newsArticles.length * 100).toFixed(1),
});

export const getTikTokStats = () => ({
  totalEngagements: tiktokPosts.reduce((sum, p) => sum + p.like_count + p.comment_count + p.share_count, 0),
  citizenReach: tiktokPosts.reduce((sum, p) => sum + p.view_count, 0),
  activeDiscussions: tiktokPosts.filter(p => p.comment_count > 50).length,
  positiveResponse: (tiktokPosts.filter(p => p.sentiment === 'positive').length / tiktokPosts.length * 100).toFixed(1),
});

export const getPaginatedData = (data: any[], page: number = 1, itemsPerPage: number = 10) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = data.slice(startIndex, endIndex);

  return {
    data: paginatedItems,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.length / itemsPerPage),
      totalItems: data.length,
      itemsPerPage,
      hasNext: endIndex < data.length,
      hasPrev: page > 1,
    },
  };
};

export const filterByDateRange = (data: any[], dateFrom?: string, dateTo?: string) => {
  if (!dateFrom && !dateTo) return data;

  return data.filter(item => {
    const itemDate = new Date(item.post_created_at || item.published_at);
    if (dateFrom && itemDate < new Date(dateFrom)) return false;
    if (dateTo && itemDate > new Date(dateTo)) return false;
    return true;
  });
};

export const searchData = (
  data: any[],
  query: string,
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    categories?: string[];
    urgencyLevel?: string[];
    sentiment?: string[];
    region?: string[];
  }
) => {
  let results = [...data];

  // Text search
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(item =>
      (item.title && item.title.toLowerCase().includes(lowerQuery)) ||
      (item.content && item.content.toLowerCase().includes(lowerQuery)) ||
      (item.post_caption && item.post_caption.toLowerCase().includes(lowerQuery))
    );
  }

  // Date filter
  if (filters?.dateFrom || filters?.dateTo) {
    results = filterByDateRange(results, filters.dateFrom, filters.dateTo);
  }

  // Category filter
  if (filters?.categories && filters.categories.length > 0) {
    results = results.filter(item =>
      filters.categories?.includes(item.topic_classification)
    );
  }

  // Urgency filter
  if (filters?.urgencyLevel && filters.urgencyLevel.length > 0) {
    results = results.filter(item =>
      filters.urgencyLevel?.includes(item.urgency_category)
    );
  }

  // Sentiment filter
  if (filters?.sentiment && filters.sentiment.length > 0) {
    results = results.filter(item =>
      filters.sentiment?.includes(item.sentiment)
    );
  }

  // Region filter
  if (filters?.region && filters.region.length > 0) {
    results = results.filter(item =>
      filters.region?.includes(item.affected_region)
    );
  }

  return results;
};
