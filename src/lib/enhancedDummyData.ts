// ========================================
// RISARA - ENHANCED DUMMY DATA GENERATOR
// ========================================
// Comprehensive realistic data for convincing demonstrations
// This file generates large volumes of realistic Indonesian content

// Simple faker replacement for Indonesian names and data
const indonesianNames = [
  'Budi Santoso', 'Siti Nurhaliza', 'Ahmad Dahlan', 'Dewi Lestari', 'Eko Prasetyo',
  'Fitri Handayani', 'Gunawan Wijaya', 'Hani Puspita', 'Indra Gunawan', 'Joko Widodo',
  'Kartini Sari', 'Lukman Hakim', 'Maya Sari', 'Nurul Hidayah', 'Oki Rahman',
  'Putri Ayu', 'Qori Sandioriva', 'Rudi Hartono', 'Sinta Dewi', 'Tono Suratman'
];

const indonesianStreets = [
  'Jl. Sudirman', 'Jl. Thamrin', 'Jl. Gatot Subroto', 'Jl. Kuningan', 'Jl. Rasuna Said',
  'Jl. Kebon Jeruk', 'Jl. Menteng Raya', 'Jl. Mangga Besar', 'Jl. Pasar Minggu', 'Jl. Cikini',
  'Jl. Fatmawati', 'Jl. Panglima Polim', 'Jl. Raya Condet', 'Jl. Cilandak', 'Jl. Tebet Raya'
];

const indonesianUsernames = [
  'budi_jkt', 'siti123', 'ahmad_citizen', 'dewi_warga', 'eko_jakarta',
  'fitri_voice', 'gunawan88', 'hani_update', 'indra_jkt', 'jokowi_fan',
  'kartini_id', 'lukman_info', 'maya_news', 'nurul_update', 'oki_jkt',
  'putri_voice', 'qori_citizen', 'rudi_info', 'sinta_jkt', 'tono_update'
];

const simpleFaker = {
  person: {
    fullName: () => indonesianNames[Math.floor(Math.random() * indonesianNames.length)],
  },
  location: {
    street: () => indonesianStreets[Math.floor(Math.random() * indonesianStreets.length)],
  },
  internet: {
    username: () => indonesianUsernames[Math.floor(Math.random() * indonesianUsernames.length)],
  },
};

const faker = simpleFaker;

// ========================================
// CONFIGURATION
// ========================================

const CONFIG = {
  news: {
    count: 3500, // Generate 3500 news articles - INCREASED for better Social Monitoring demo
    dateRangeInDays: 90, // Last 90 days
    highUrgencyPercentage: 0.25, // 25% posts with urgency >= 70
  },
  tiktok: {
    count: 1500, // Generate 1500 TikTok posts - INCREASED for better Social Monitoring demo
    dateRangeInDays: 60, // Last 60 days
    highUrgencyPercentage: 0.30, // 30% posts with urgency >= 70
  },
  chatLogs: {
    count: 250, // Generate 250 chat logs - INCREASED for better citizen engagement demo
    dateRangeInDays: 30, // Last 30 days
  },
};

// ========================================
// BASE DATA DEFINITIONS
// ========================================

const REGIONS = [
  'Jakarta Pusat',
  'Jakarta Utara',
  'Jakarta Selatan',
  'Jakarta Timur',
  'Jakarta Barat',
  'Kepulauan Seribu',
];

const NEWS_TOPICS = [
  'Social and Economy',
  'Infrastructure and Transportation',
  'Government and Public Policy',
  'Technology and Innovation',
  'Environment and Disaster',
  'Safety and Crime',
  'Education and Culture',
  'Ecology and Green Spaces',
];

const TIKTOK_TOPICS = [
  'Social and Economy',
  'Government and Public Policy',
  'Infrastructure and Transportation',
  'Safety and Crime',
];

const SENTIMENTS = ['Positive', 'Negative', 'Neutral'];

const NEWS_SOURCES = [
  'Kompas.com',
  'Detik.com',
  'CNN Indonesia',
  'Tempo.co',
  'Tribunnews.com',
  'Liputan6.com',
  'Antara News',
  'JPNN.com',
  'Bisnis.com',
  'Kontan.co.id',
  'Republika.co.id',
  'Suara.com',
];

// ========================================
// REALISTIC INDONESIAN CONTENT TEMPLATES
// ========================================

const NEWS_TEMPLATES = {
  'Infrastructure and Transportation': [
    {
      titleTemplate: 'Kemacetan Parah di {{region}}, Warga Keluhkan Waktu Tempuh Meningkat {{percent}}%',
      contentTemplate: `{{region}} - Kemacetan parah terjadi di wilayah {{region}} pada hari ini, menyebabkan waktu tempuh perjalanan meningkat hingga {{percent}}%. Warga mengeluhkan situasi yang semakin memburuk, terutama pada jam-jam sibuk pagi dan sore hari.

Menurut Dinas Perhubungan DKI Jakarta, peningkatan volume kendaraan mencapai {{number}} kendaraan per jam. "Kami sedang mengkaji solusi jangka pendek dan panjang untuk mengatasi masalah ini," ujar Kepala Dinas Perhubungan.

Beberapa warga menyarankan penambahan armada Transjakarta dan percepatan pembangunan MRT. Pemerintah Provinsi DKI Jakarta berjanji akan segera mengambil langkah konkret untuk mengatasi permasalahan transportasi di wilayah ini.`,
      urgencyRange: [65, 85],
      sentimentBias: 'Negative',
    },
    {
      titleTemplate: 'MRT Jakarta Fase {{phase}} Resmi Beroperasi, Hubungkan {{region}} dengan Jakarta Pusat',
      contentTemplate: `{{region}} - Kabar gembira bagi warga {{region}}! MRT Jakarta fase {{phase}} resmi beroperasi hari ini, menghubungkan wilayah ini dengan Jakarta Pusat. Proyek yang telah dikerjakan selama {{years}} tahun ini akhirnya selesai dan dapat dimanfaatkan oleh masyarakat.

Gubernur DKI Jakarta meresmikan operasional MRT ini dengan menaiki kereta perdana bersama warga. "Ini adalah tonggak penting dalam pembangunan transportasi publik Jakarta yang modern dan terintegrasi," ujarnya dalam sambutannya.

Diperkirakan MRT fase {{phase}} ini akan melayani sekitar {{number}} ribu penumpang per hari. Tarif yang ditawarkan tetap terjangkau dengan sistem integrasi dengan moda transportasi lainnya.`,
      urgencyRange: [25, 45],
      sentimentBias: 'Positive',
    },
    {
      titleTemplate: 'Perbaikan Jalan di {{region}} Sebabkan Kemacetan Panjang, Pengendara Diminta Cari Jalur Alternatif',
      contentTemplate: `{{region}} - Perbaikan jalan di {{region}} yang dimulai hari ini menyebabkan kemacetan panjang hingga {{number}} kilometer. Dinas Bina Marga DKI Jakarta melakukan perbaikan jalan yang rusak akibat intensitas kendaraan yang tinggi.

Pengendara diminta untuk mencari jalur alternatif selama proses perbaikan berlangsung. "Perbaikan ini diperkirakan akan selesai dalam {{weeks}} minggu ke depan," kata Kepala Seksi Pemeliharaan Jalan Dinas Bina Marga.

Meskipun menyebabkan kemacetan sementara, perbaikan jalan ini dinilai penting untuk keselamatan pengguna jalan. Warga berharap pekerjaan dapat diselesaikan sesuai jadwal agar aktivitas kembali normal.`,
      urgencyRange: [55, 75],
      sentimentBias: 'Neutral',
    },
  ],
  'Environment and Disaster': [
    {
      titleTemplate: 'Banjir Setinggi {{height}} Meter Rendam {{region}}, Ratusan Warga Mengungsi',
      contentTemplate: `{{region}} - Banjir setinggi {{height}} meter merendam wilayah {{region}} sejak dini hari tadi. Hujan deras yang turun sejak kemarin malam menyebabkan sejumlah sungai meluap dan menggenangi pemukiman warga.

BPBD DKI Jakarta telah mengerahkan {{number}} personel untuk membantu evakuasi warga. Hingga sore ini, tercatat sekitar {{evacuees}} warga telah mengungsi ke posko-posko yang disiapkan di gedung sekolah dan balai warga.

"Kami terus memantau perkembangan cuaca dan level air. Tim pompa mobile juga telah disiagakan untuk mempercepat penyusutan genangan," ujar Kepala Pelaksana BPBD DKI Jakarta. Warga diminta tetap waspada dan mengikuti arahan petugas.`,
      urgencyRange: [80, 95],
      sentimentBias: 'Negative',
    },
    {
      titleTemplate: 'Genangan Banjir di {{region}} Mulai Surut, Warga Mulai Bersih-Bersih',
      contentTemplate: `{{region}} - Genangan banjir yang melanda {{region}} sejak 2 hari yang lalu mulai surut. Warga mulai melakukan pembersihan rumah dan lingkungan dari lumpur dan sampah yang ditinggalkan banjir.

Pompa air yang dipasang BPBD DKI Jakarta bekerja maksimal untuk mempercepat penyusutan air. "Alhamdulillah, air sudah mulai surut sejak pagi tadi. Kami berterima kasih atas bantuan cepat dari BPBD," ujar {{name}}, salah seorang warga.

Pemerintah Provinsi DKI Jakarta melalui Dinas Sosial juga telah menyalurkan bantuan berupa sembako dan perlengkapan bersih-bersih untuk warga terdampak. Evaluasi infrastruktur drainase akan dilakukan untuk mencegah banjir serupa di masa depan.`,
      urgencyRange: [35, 55],
      sentimentBias: 'Positive',
    },
    {
      titleTemplate: 'Kualitas Udara di {{region}} Memburuk, AQI Mencapai {{aqi}} - Kategori Tidak Sehat',
      contentTemplate: `{{region}} - Kualitas udara di wilayah {{region}} hari ini terdeteksi memburuk dengan indeks kualitas udara (AQI) mencapai {{aqi}}, masuk dalam kategori tidak sehat. Warga diminta untuk mengurangi aktivitas di luar ruangan.

Dinas Lingkungan Hidup DKI Jakarta menyatakan bahwa polusi udara ini disebabkan oleh kombinasi emisi kendaraan, aktivitas industri, dan kondisi cuaca yang tidak mendukung dispersi polutan. "Kami mengimbau warga, terutama anak-anak dan lansia, untuk menggunakan masker saat beraktivitas di luar," kata juru bicara Dinas LH.

Pemerintah tengah menggencarkan program penghijauan dan uji emisi kendaraan untuk mengatasi masalah polusi udara jangka panjang. Monitoring kualitas udara real-time dapat diakses melalui aplikasi Jakarta Kini.`,
      urgencyRange: [70, 85],
      sentimentBias: 'Negative',
    },
  ],
  'Government and Public Policy': [
    {
      titleTemplate: 'Gubernur Luncurkan Program {{program}} untuk Warga {{region}}',
      contentTemplate: `{{region}} - Gubernur DKI Jakarta hari ini meluncurkan program {{program}} yang ditujukan untuk meningkatkan kesejahteraan warga {{region}}. Program ini merupakan bagian dari komitmen pemerintah provinsi untuk meningkatkan kualitas hidup masyarakat Jakarta.

Dalam sambutannya, Gubernur menekankan pentingnya partisipasi aktif masyarakat dalam mensukseskan program ini. "Kami berharap program {{program}} ini dapat memberikan dampak nyata bagi kehidupan warga," ujarnya.

Anggaran yang dialokasikan untuk program ini mencapai Rp {{budget}} miliar. Pelaksanaan program akan dimulai bulan depan dan melibatkan {{number}} kelurahan di wilayah {{region}}. Warga dapat mendaftar melalui aplikasi atau kantor kelurahan setempat.`,
      urgencyRange: [30, 50],
      sentimentBias: 'Positive',
    },
    {
      titleTemplate: 'DPRD DKI Jakarta Gelar Rapat Paripurna Bahas Perda tentang {{topic}}',
      contentTemplate: `Jakarta - DPRD DKI Jakarta menggelar rapat paripurna untuk membahas Rancangan Peraturan Daerah (Raperda) tentang {{topic}}. Rapat yang berlangsung di Gedung DPRD ini dihadiri oleh {{number}} anggota dewan dari berbagai fraksi.

Ketua DPRD DKI Jakarta menyatakan bahwa Perda ini penting untuk memberikan kepastian hukum dan meningkatkan pelayanan publik. "Kami akan memastikan aspirasi masyarakat terakomodasi dalam peraturan ini," katanya.

Pembahasan Raperda ini melibatkan hearing dengan berbagai stakeholder termasuk akademisi, praktisi, dan organisasi masyarakat sipil. Diharapkan Perda ini dapat disahkan dalam 2 bulan ke depan setelah melalui proses pembahasan yang komprehensif.`,
      urgencyRange: [40, 60],
      sentimentBias: 'Neutral',
    },
  ],
  'Education and Culture': [
    {
      titleTemplate: 'Siswa SMA di {{region}} Raih Medali Emas Olimpiade Sains Nasional',
      contentTemplate: `{{region}} - Membanggakan! Siswa SMA {{schoolName}} di {{region}} berhasil meraih medali emas dalam Olimpiade Sains Nasional (OSN) kategori {{subject}}. Prestasi ini mengharumkan nama Jakarta di tingkat nasional.

{{studentName}}, siswa kelas {{grade}}, berhasil mengalahkan {{number}} peserta dari seluruh Indonesia. "Saya sangat senang dan bangga bisa mewakili Jakarta. Terima kasih atas dukungan guru, orang tua, dan teman-teman," ujarnya dengan penuh kegembiraan.

Kepala Dinas Pendidikan DKI Jakarta memberikan apresiasi atas prestasi yang diraih. "Ini membuktikan kualitas pendidikan di Jakarta terus meningkat. Kami akan terus mendukung pengembangan bakat dan minat siswa," katanya.`,
      urgencyRange: [20, 40],
      sentimentBias: 'Positive',
    },
    {
      titleTemplate: 'Kekurangan Guru di Sekolah {{region}}, Disdik Akan Rekrut Tenaga Pendidik Baru',
      contentTemplate: `{{region}} - Dinas Pendidikan DKI Jakarta mengakui adanya kekurangan guru di sejumlah sekolah di wilayah {{region}}. Kondisi ini berdampak pada rasio guru-siswa yang belum ideal dan berpotensi mempengaruhi kualitas pembelajaran.

Kepala Dinas Pendidikan menyatakan akan segera membuka rekrutmen untuk {{number}} guru baru. "Kami menargetkan rekrutmen selesai dalam {{months}} bulan ke depan. Prioritas akan diberikan pada mata pelajaran yang kekurangan pengajar," jelasnya.

Sementara itu, beberapa kepala sekolah di {{region}} berharap proses rekrutmen dapat dipercepat. "Kami sangat membutuhkan tambahan tenaga pengajar agar proses belajar mengajar berjalan optimal," ujar salah seorang kepala sekolah.`,
      urgencyRange: [60, 75],
      sentimentBias: 'Neutral',
    },
  ],
  'Social and Economy': [
    {
      titleTemplate: 'Harga Sembako di {{region}} Naik, Warga Keluhkan Daya Beli Menurun',
      contentTemplate: `{{region}} - Harga sembako di pasar-pasar tradisional wilayah {{region}} mengalami kenaikan dalam sepekan terakhir. Beberapa komoditas seperti beras, minyak goreng, dan cabai mengalami kenaikan hingga {{percent}}%.

Para pedagang mengatakan kenaikan harga ini dipicu oleh faktor distribusi dan kelangkaan pasokan di tingkat produsen. "Kami juga kesulitan mendapat barang dengan harga yang stabil," ujar {{name}}, salah seorang pedagang di Pasar {{marketName}}.

Dinas Ketahanan Pangan, Kelautan dan Pertanian DKI Jakarta menyatakan akan melakukan operasi pasar untuk menstabilkan harga. "Kami sudah mengkoordinasikan dengan Bulog dan distributor untuk memastikan ketersediaan dan harga yang terjangkau," kata Kepala Dinas.`,
      urgencyRange: [55, 75],
      sentimentBias: 'Negative',
    },
    {
      titleTemplate: 'UMKM di {{region}} Terima Bantuan Modal Usaha dari Pemprov DKI',
      contentTemplate: `{{region}} - Sebanyak {{number}} pelaku UMKM di wilayah {{region}} hari ini menerima bantuan modal usaha dari Pemerintah Provinsi DKI Jakarta. Program ini bertujuan untuk meningkatkan daya saing UMKM dan mendorong pertumbuhan ekonomi lokal.

Setiap pelaku UMKM menerima bantuan modal sebesar Rp {{amount}} juta yang dapat digunakan untuk pengembangan usaha. "Bantuan ini sangat membantu kami untuk mengembangkan usaha, terutama di tengah persaingan yang ketat," ujar {{name}}, salah seorang penerima bantuan.

Kepala Dinas Koperasi, Usaha Kecil dan Menengah DKI Jakarta berharap bantuan ini dapat meningkatkan omzet UMKM hingga {{percent}}%. "Kami juga akan memberikan pendampingan dan pelatihan agar usaha mereka berkembang berkelanjutan," jelasnya.`,
      urgencyRange: [25, 45],
      sentimentBias: 'Positive',
    },
  ],
  'Safety and Crime': [
    {
      titleTemplate: 'Polres Jakarta {{area}} Tangkap {{number}} Pelaku Kejahatan Jalanan',
      contentTemplate: `{{region}} - Polres Jakarta {{area}} berhasil menangkap {{number}} pelaku kejahatan jalanan dalam operasi yang dilakukan selama sepekan terakhir. Para pelaku diamankan di berbagai lokasi rawan kejahatan di wilayah {{region}}.

Kapolres Jakarta {{area}} menyatakan operasi ini merupakan bagian dari upaya menciptakan rasa aman bagi masyarakat. "Kami akan terus melakukan patroli dan operasi untuk memberantas kejahatan jalanan," ujarnya dalam konferensi pers.

Masyarakat diminta untuk selalu waspada dan melaporkan aktivitas mencurigakan ke polisi melalui aplikasi atau nomor darurat. "Keamanan adalah tanggung jawab bersama. Partisipasi masyarakat sangat penting," tambahnya.`,
      urgencyRange: [50, 70],
      sentimentBias: 'Positive',
    },
  ],
  'Technology and Innovation': [
    {
      titleTemplate: 'Pemprov DKI Luncurkan Aplikasi {{appName}} untuk Kemudahan Layanan Publik',
      contentTemplate: `Jakarta - Pemerintah Provinsi DKI Jakarta hari ini meluncurkan aplikasi {{appName}} yang dirancang untuk memberikan kemudahan akses layanan publik bagi warga Jakarta. Aplikasi ini dapat diunduh gratis di Play Store dan App Store.

Melalui aplikasi {{appName}}, warga dapat mengakses berbagai layanan seperti pengaduan, informasi transportasi real-time, dan pendaftaran program pemerintah. "Ini adalah bagian dari transformasi digital Jakarta menuju smart city," kata Kepala Dinas Komunikasi, Informatika dan Statistik.

Dalam fase awal, aplikasi ini telah diintegrasikan dengan {{number}} layanan publik. "Kami akan terus menambah fitur dan layanan sesuai kebutuhan masyarakat," tambahnya. Hingga sore ini, aplikasi telah diunduh lebih dari {{downloads}} kali.`,
      urgencyRange: [30, 50],
      sentimentBias: 'Positive',
    },
  ],
  'Ecology and Green Spaces': [
    {
      titleTemplate: 'Pemprov DKI Tanam {{number}} Pohon di {{region}} untuk Perbaiki Kualitas Udara',
      contentTemplate: `{{region}} - Pemerintah Provinsi DKI Jakarta melalui Dinas Kehutanan melakukan penanaman {{number}} pohon di wilayah {{region}} hari ini. Kegiatan ini merupakan bagian dari program penghijauan Jakarta untuk meningkatkan kualitas udara dan mengurangi polusi.

Jenis pohon yang ditanam meliputi trembesi, angsana, dan ketapang yang dikenal efektif menyerap polutan. "Target kami adalah menanam {{targetTrees}} pohon di seluruh Jakarta tahun ini," kata Kepala Dinas Kehutanan.

Kegiatan penanaman pohon ini melibatkan partisipasi warga dan relawan lingkungan. "Kami mengajak seluruh warga Jakarta untuk bersama-sama menjaga dan merawat pohon-pohon ini agar tumbuh dengan baik," ujarnya.`,
      urgencyRange: [20, 40],
      sentimentBias: 'Positive',
    },
  ],
};

const TIKTOK_TEMPLATES = {
  'Infrastructure and Transportation': [
    {
      template: 'Macet lagi di {{region}} 😭 Udah {{hours}} jam di jalan, belum sampai-sampai. Kapan ada solusi nih @DKIJakarta? #MacetJakarta #{{region}}',
      urgencyRange: [70, 85],
      sentimentBias: 'Negative',
      likeRange: [5000, 25000],
    },
    {
      template: 'Naik MRT Jakarta tuh enak banget! Gak macet, tepat waktu, AC dingin 🚇✨ Recommended buat yang mau ke {{region}} #MRTJakarta #TransportasiPublik',
      urgencyRange: [15, 30],
      sentimentBias: 'Positive',
      likeRange: [8000, 35000],
    },
    {
      template: 'Transjakarta koridor {{region}} hari ini padat banget! Tolong tambah armada dong @TransJakarta 🙏 #Transjakarta #{{region}}',
      urgencyRange: [60, 75],
      sentimentBias: 'Neutral',
      likeRange: [3000, 18000],
    },
    {
      template: 'Jalan rusak di {{region}} bikin motor gue oleng-oleng 😤 Tolong diperbaiki @DKIJakarta #JalanRusak #{{region}}',
      urgencyRange: [65, 80],
      sentimentBias: 'Negative',
      likeRange: [6000, 22000],
    },
  ],
  'Environment and Disaster': [
    {
      template: 'BANJIR LAGI DI {{region}}! Air udah masuk rumah setinggi lutut 😭😭 Tolong bantu! @BPBDDKI @DKIJakarta #BanjirJakarta #{{region}} #Emergency',
      urgencyRange: [85, 98],
      sentimentBias: 'Negative',
      likeRange: [15000, 45000],
    },
    {
      template: 'Alhamdulillah banjir di {{region}} udah surut. Terima kasih BPBD yang cepat tanggap! 🙏❤️ #BanjirJakarta #{{region}}',
      urgencyRange: [25, 45],
      sentimentBias: 'Positive',
      likeRange: [10000, 38000],
    },
    {
      template: 'Kualitas udara di {{region}} hari ini parah banget! AQI {{aqi}} 😷 Jangan lupa pakai masker ya guys #PolusiUdara #{{region}}',
      urgencyRange: [70, 85],
      sentimentBias: 'Negative',
      likeRange: [8000, 30000],
    },
    {
      template: 'Sampah di {{region}} numpuk ga diangkut-angkut 🤢 Udah {{days}} hari loh! @DKIJakarta tolong dong! #SampahJakarta #{{region}}',
      urgencyRange: [65, 80],
      sentimentBias: 'Negative',
      likeRange: [7000, 28000],
    },
  ],
  'Government and Public Policy': [
    {
      template: 'Program bantuan sembako dari Pemprov DKI Jakarta sangat membantu! Terima kasih Pak Gubernur 🙏 #JakartaMaju #{{region}}',
      urgencyRange: [20, 35],
      sentimentBias: 'Positive',
      likeRange: [6000, 24000],
    },
    {
      template: 'Pelayanan di Kelurahan {{region}} makin bagus!Urus dokumen jadi cepet banget 👍 #PelayananPublik #{{region}}',
      urgencyRange: [15, 30],
      sentimentBias: 'Positive',
      likeRange: [5000, 20000],
    },
    {
      template: 'Kapan nih realisasi janji pembangunan taman di {{region}}? Udah ditunggu warga! @DKIJakarta #{{region}}',
      urgencyRange: [50, 65],
      sentimentBias: 'Neutral',
      likeRange: [4500, 19000],
    },
  ],
  'Social and Economy': [
    {
      template: 'Harga sembako di pasar {{region}} naik lagi 📈 Minyak goreng {{price}} per liter! Gimana nih @DKIJakarta? #HargaSembako #{{region}}',
      urgencyRange: [60, 75],
      sentimentBias: 'Negative',
      likeRange: [9000, 32000],
    },
    {
      template: 'UMKM di {{region}} dapat bantuan modal dari Pemprov! Semangat para pejuang ekonomi! 💪 #UMKM #{{region}}',
      urgencyRange: [20, 35],
      sentimentBias: 'Positive',
      likeRange: [6500, 26000],
    },
  ],
  'Safety and Crime': [
    {
      template: 'Hati-hati di area {{region}} malam ini! Ada yang kena copet tas nya diambil 😱 Stay safe teman-teman! #Jakarta #{{region}}',
      urgencyRange: [70, 85],
      sentimentBias: 'Negative',
      likeRange: [10000, 35000],
    },
    {
      template: 'Salut sama polisi di {{region}} yang sigap tangkap pelaku kejahatan! Good job! 👮‍♂️👍 #PolisiJakarta #{{region}}',
      urgencyRange: [30, 45],
      sentimentBias: 'Positive',
      likeRange: [7000, 28000],
    },
  ],
};

const CHAT_TEMPLATES = [
  // Trending Issue #1 - Banjir Cengkareng (Oct 20, 2025)
  {
    userMessage: 'Banjir di Cengkareng kapan surutnya? Air udah masuk rumah 80cm!',
    botResponse: 'Kami sangat prihatin dengan kondisi banjir di Cengkareng. Tim BPBD telah di lokasi dan pompa air sedang beroperasi. Estimasi air surut dalam 6-12 jam. Untuk evakuasi darurat hubungi 021-6519444. Tetap waspada dan jaga keselamatan!',
    topic: 'Environment and Disaster',
    urgencyRange: [85, 95],
  },
  {
    userMessage: 'Kenapa pompa air di Cengkareng rusak terus? Ini udah 2 minggu!',
    botResponse: 'Terima kasih laporannya. Kami sudah mengidentifikasi 3 pompa yang rusak di Cengkareng. Suku cadang sedang dalam proses pengiriman dan perbaikan ditargetkan selesai 22 Oktober 2025. Mohon maaf atas ketidaknyamanannya.',
    topic: 'Environment and Disaster',
    urgencyRange: [80, 90],
  },
  // Trending Issue #2 - Macet Tol & Fatmawati
  {
    userMessage: 'Macet parah di Tol Dalam Kota arah Cawang! Ada apa ini?',
    botResponse: 'Terjadi kecelakaan truk kontainer di KM 12 yang menutup 2 lajur sejak pukul 05:30 WIB. Tim evakuasi sedang bekerja. Silakan gunakan jalur alternatif via Jl. MT Haryono atau Jl. Matraman Raya. Update akan kami informasikan berkala.',
    topic: 'Infrastructure and Transportation',
    urgencyRange: [75, 85],
  },
  {
    userMessage: 'Kapan perbaikan jalan Fatmawati selesai? Macet parah dari pagi sampai malam!',
    botResponse: 'Perbaikan Jl. Fatmawati bersamaan dengan pembangunan MRT Fase 3 ditargetkan selesai akhir November 2025. Untuk sementara gunakan alternatif: Jl. Panglima Polim atau Jl. Trunojoyo. Kami tambah 10 unit Transjakarta koridor Fatmawati-Blok M.',
    topic: 'Infrastructure and Transportation',
    urgencyRange: [80, 90],
  },
  // Trending Issue #3 - Penjambretan
  {
    userMessage: 'Saya jadi korban penjambretan di Kelapa Gading! Gimana cara lapornya?',
    botResponse: 'Sangat kami sesalkan kejadian ini. Segera buat laporan polisi ke Polsek Kelapa Gading (Jl. Boulevard Raya) atau hubungi 110. Bawa identitas diri dan keterangan saksi jika ada. Tim khusus anti street crime sudah dibentuk untuk menangani kasus ini.',
    topic: 'Safety and Crime',
    urgencyRange: [85, 95],
  },
  {
    userMessage: 'Patroli polisi di daerah saya kok jarang ya? Rawan banget penjambretan!',
    botResponse: 'Terima kasih masukannya. Mohon sebutkan lokasi spesifik Anda. Kami akan koordinasikan dengan Polda Metro untuk meningkatkan patroli. Sementara ini, hindari bepergian malam sendirian dan selalu waspada di area sepi.',
    topic: 'Safety and Crime',
    urgencyRange: [70, 80],
  },
  // Trending Issue #4 - Polusi Udara
  {
    userMessage: 'Kualitas udara Jakarta hari ini AQI 165! Bahaya ga sih?',
    botResponse: 'AQI 165 masuk kategori "Tidak Sehat". Kami sarankan: 1) Kurangi aktivitas outdoor, 2) Gunakan masker N95, 3) Nyalakan air purifier di dalam ruangan, 4) Jaga kesehatan terutama anak-anak dan lansia. Pantau update di jakarta.go.id/udara',
    topic: 'Environment and Disaster',
    urgencyRange: [85, 92],
  },
  {
    userMessage: 'Kenapa polusi Jakarta makin parah? Apa yang pemerintah lakukan?',
    botResponse: 'Pemprov DKI sudah menerapkan: 1) WFH wajib 3 hari/minggu untuk ASN, 2) Inspeksi konstruksi untuk dust control, 3) Percepat program bike-sharing, 4) Penambahan RTH. Kami juga dorong penggunaan transportasi publik untuk kurangi emisi kendaraan.',
    topic: 'Environment and Disaster',
    urgencyRange: [75, 85],
  },
  // Trending Issue #5 - Harga Cabai
  {
    userMessage: 'Harga cabai kok naik gila-gilaan jadi Rp 65,000/kg? Kapan turun?',
    botResponse: 'Kenaikan harga cabai disebabkan gagal panen akibat curah hujan tinggi di Jawa Barat. Operasi pasar dengan harga Rp 40,000/kg akan diadakan 22 Oktober di 50 titik pasar tradisional. Cek lokasi terdekat di jakarta.go.id/operasipasar',
    topic: 'Social and Economy',
    urgencyRange: [70, 80],
  },
  // Trending Issue #6 - Antrian Dukcapil
  {
    userMessage: 'Antrian e-KTP di Dukcapil 6 jam! Deadline 31 Oktober, gimana ini?',
    botResponse: 'Untuk mengurangi antrian, kami buka layanan weekend khusus 26-27 Oktober di 10 kecamatan. Juga ada mobile unit Dukcapil yang keliling. Deadline diperpanjang hingga 30 November 2025. Daftar online dulu di alpukat.jakarta.go.id agar lebih cepat.',
    topic: 'Government and Public Policy',
    urgencyRange: [75, 85],
  },
  // Trending Issue #7 - UMKM Pasar Santa
  {
    userMessage: 'Tarif parkir Pasar Santa naik jadi 20rb, pengunjung pada kabur! Tolong dong!',
    botResponse: 'Kami terima keluhan terkait kenaikan tarif parkir Pasar Santa. Tim sedang evaluasi kebijakan ini dengan asosiasi UMKM. Sementara ada rencana subsidi sewa 50% selama 3 bulan untuk UMKM terdampak. Akan ada shuttle bus gratis dari MRT Blok M.',
    topic: 'Social and Economy',
    urgencyRange: [65, 75],
  },
  // Trending Issue #8 - IMB Online
  {
    userMessage: 'IMB online saya udah 4 bulan belum selesai, padahal janjinya 14 hari!',
    botResponse: 'Mohon maaf atas keterlambatan ini. Sistem SIMBG sedang upgrade dan kami tambah 50 verifikator. Silakan email nomor permohonan Anda ke imb@jakarta.go.id dengan subjek "URGENT IMB" untuk dipercepat. Kami bantu konsultasi online gratis.',
    topic: 'Government and Public Policy',
    urgencyRange: [70, 80],
  },
  // General templates
  {
    userMessage: 'Bagaimana cara melapor banjir di wilayah saya?',
    botResponse: 'Anda dapat melaporkan banjir melalui aplikasi Jakarta Kini atau menghubungi Call Center BPBD DKI Jakarta di 021-6519444. Mohon sertakan lokasi detail dan foto kondisi banjir untuk penanganan yang lebih cepat.',
    topic: 'Environment and Disaster',
    urgencyRange: [70, 85],
  },
  {
    userMessage: 'Dimana lokasi puskesmas terdekat di {{region}}?',
    botResponse: 'Puskesmas terdekat di {{region}} adalah Puskesmas Kecamatan {{region}} yang berlokasi di Jl. {{street}}. Jam operasional: Senin-Jumat 08:00-14:00. Untuk layanan gawat darurat 24 jam, silakan kunjungi RS terdekat.',
    topic: 'Social and Economy',
    urgencyRange: [40, 55],
  },
  {
    userMessage: 'Kapan jadwal pengangkutan sampah di {{region}}?',
    botResponse: 'Jadwal pengangkutan sampah di {{region}} adalah Senin, Rabu, dan Jumat pukul 06:00-08:00 pagi. Mohon pastikan sampah sudah dikeluarkan sebelum jam tersebut. Untuk sampah besar, silakan hubungi kantor kelurahan untuk penjadwalan khusus.',
    topic: 'Environment and Disaster',
    urgencyRange: [35, 50],
  },
  {
    userMessage: 'Bagaimana cara mengurus KTP yang hilang?',
    botResponse: 'Untuk mengurus KTP hilang, silakan datang ke Dukcapil kecamatan setempat membawa: 1) Surat kehilangan dari polisi, 2) KK asli, 3) Akta kelahiran. Proses pengurusan memakan waktu 14 hari kerja. Anda juga bisa daftar online via alpukat.jakarta.go.id',
    topic: 'Government and Public Policy',
    urgencyRange: [45, 60],
  },
  {
    userMessage: 'Ada program vaksinasi gratis ga di {{region}}?',
    botResponse: 'Ya, ada program vaksinasi gratis yang diselenggarakan setiap hari Selasa dan Kamis di Puskesmas {{region}}, pukul 09:00-12:00. Silakan bawa KTP Jakarta dan buku vaksin (jika ada). Tidak perlu daftar, langsung datang saja.',
    topic: 'Social and Economy',
    urgencyRange: [30, 45],
  },
  {
    userMessage: 'Jalur Transjakarta mana yang lewat {{region}}?',
    botResponse: 'Beberapa koridor Transjakarta yang melayani {{region}}: Koridor 1 (Blok M-Kota), Koridor 9 (Pinang Ranti-Pluit), dan Koridor 5 (Kampung Melayu-Ancol). Untuk info real-time, download aplikasi Transjakarta atau cek di halte terdekat.',
    topic: 'Infrastructure and Transportation',
    urgencyRange: [20, 35],
  },
  {
    userMessage: 'Kenapa air PAM di {{region}} sering mati?',
    botResponse: 'Kami mencatat keluhan Anda terkait gangguan air PAM di {{region}}. Silakan laporkan langsung ke PAM Jaya Call Center 122 atau aplikasi PAM mobile. Biasanya disebabkan oleh pemeliharaan jaringan atau masalah teknis yang sedang diperbaiki.',
    topic: 'Government and Public Policy',
    urgencyRange: [60, 75],
  },
  {
    userMessage: 'Bagaimana cara daftar sekolah negeri di Jakarta?',
    botResponse: 'Pendaftaran sekolah negeri di Jakarta dilakukan melalui sistem PPDB online di ppdb.jakarta.go.id. Jadwal biasanya dibuka Juni-Juli setiap tahun. Persyaratan: KK Jakarta (minimal 1 tahun), akta kelahiran, ijazah/SKHUN jenjang sebelumnya.',
    topic: 'Education and Culture',
    urgencyRange: [35, 50],
  },
  {
    userMessage: 'Ada lowongan kerja dari Pemprov DKI ga?',
    botResponse: 'Informasi lowongan kerja resmi Pemprov DKI Jakarta dapat diakses di bkd.jakarta.go.id atau melalui akun resmi @BKD_DKI di media sosial. Hati-hati dengan penipuan yang mengatasnamakan penerimaan CPNS/PPPK.',
    topic: 'Government and Public Policy',
    urgencyRange: [25, 40],
  },
  {
    userMessage: 'Lampu jalan di {{region}} mati semua, tolong diperbaiki!',
    botResponse: 'Terima kasih atas laporannya. Mohon sebutkan lokasi spesifik (nama jalan/gang) lampu yang mati di {{region}}. Kami akan teruskan ke Dinas Bina Marga untuk perbaikan. Estimasi perbaikan 3-7 hari kerja setelah laporan diterima.',
    topic: 'Infrastructure and Transportation',
    urgencyRange: [55, 70],
  },
];

// ========================================
// UTILITY FUNCTIONS
// ========================================

const replacePlaceholders = (template: string, values: Record<string, any>): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key] !== undefined ? values[key].toString() : match;
  });
};

const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomFloat = (min: number, max: number, decimals: number = 2): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

const randomDate = (daysAgo: number): Date => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const date = new Date(now);
  date.setDate(date.getDate() - randomDays);
  // Add random hours (0-23)
  date.setHours(randomInRange(0, 23));
  // Add random minutes (0-59)
  date.setMinutes(randomInRange(0, 59));
  return date;
};

const randomChoice = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const randomChoices = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getSentimentScore = (sentiment: string): number => {
  if (sentiment === 'Positive') return randomFloat(0.5, 0.95);
  if (sentiment === 'Negative') return randomFloat(-0.95, -0.5);
  return randomFloat(-0.3, 0.3);
};

const determineSentiment = (bias: string | undefined): string => {
  if (!bias) {
    const rand = Math.random();
    if (rand < 0.35) return 'Positive';
    if (rand < 0.70) return 'Neutral';
    return 'Negative';
  }

  // 70% chance of using bias, 30% chance of other sentiments
  if (Math.random() < 0.7) return bias;

  const otherSentiments = SENTIMENTS.filter(s => s !== bias);
  return randomChoice(otherSentiments);
};

// ========================================
// NEWS GENERATOR
// ========================================

export const generateEnhancedNewsArticles = (count: number = CONFIG.news.count) => {
  const articles: any[] = [];

  for (let i = 0; i < count; i++) {
    const topic = randomChoice(NEWS_TOPICS);
    const region = randomChoice(REGIONS);
    const source = randomChoice(NEWS_SOURCES);
    const templateOptions = NEWS_TEMPLATES[topic as keyof typeof NEWS_TEMPLATES];

    if (!templateOptions || templateOptions.length === 0) continue;

    const template = randomChoice(templateOptions);

    // Ensure high urgency percentage for Social Monitoring
    let urgency: number;
    if (Math.random() < CONFIG.news.highUrgencyPercentage) {
      // Force high urgency (70-95)
      urgency = randomInRange(70, 95);
    } else {
      // Use template urgency range
      urgency = randomInRange(template.urgencyRange[0], template.urgencyRange[1]);
    }

    const sentiment = determineSentiment(template.sentimentBias);
    const publishedAt = randomDate(CONFIG.news.dateRangeInDays);

    // Generate placeholder values
    const placeholders: Record<string, any> = {
      region,
      percent: randomInRange(15, 85),
      number: randomInRange(150, 8500),
      height: randomFloat(0.3, 2.5, 1),
      evacuees: randomInRange(50, 500),
      weeks: randomInRange(2, 8),
      name: faker.person.fullName(),
      phase: randomChoice(['2A', '2B', '3', '3A', '4']),
      years: randomInRange(2, 5),
      program: randomChoice(['Bantuan Sembako', 'Jakarta Sehat', 'Pendidikan Gratis', 'Rumah DP 0 Rupiah', 'Pelatihan Kerja']),
      budget: randomInRange(5, 150),
      schoolName: randomInRange(1, 99),
      subject: randomChoice(['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Astronomi']),
      studentName: faker.person.fullName(),
      grade: randomChoice(['10', '11', '12']),
      months: randomInRange(2, 6),
      marketName: randomChoice(['Tanah Abang', 'Kebayoran Lama', 'Cikini', 'Kramat Jati', 'Palmerah']),
      amount: randomInRange(5, 50),
      area: randomChoice(['Pusat', 'Utara', 'Selatan', 'Timur', 'Barat']),
      appName: randomChoice(['Jakarta Kini+', 'Smart Jakarta', 'JakOne Mobile', 'JAKI Plus', 'Jakarta Pintar']),
      downloads: randomInRange(10000, 500000),
      targetTrees: randomInRange(50000, 200000),
      aqi: randomInRange(120, 250),
      topic: randomChoice(['Transportasi Publik', 'Pengelolaan Sampah', 'Retribusi Daerah']),
      street: faker.location.street(),
    };

    const title = replacePlaceholders(template.titleTemplate, placeholders);
    const content = replacePlaceholders(template.contentTemplate, placeholders);

    const engagementRate = urgency > 70 ? randomFloat(80, 150) : randomFloat(20, 80);
    const baseEngagement = urgency > 70 ? randomInRange(1000, 8000) : randomInRange(100, 1000);

    // Extract first paragraph as description
    const description = content.split('\n\n')[0];

    articles.push({
      _id: `enhanced_news_${i + 1}`,
      title,
      link_post: `https://${source.toLowerCase().replace('.com', '').replace('.', '-')}.com/jakarta/${topic.toLowerCase().replace(/ /g, '-')}/${Date.now()}-${i}`,
      url: `https://${source.toLowerCase().replace('.com', '').replace('.', '-')}.com/jakarta/${topic.toLowerCase().replace(/ /g, '-')}/${Date.now()}-${i}`,
      content,
      description, // Add description field (first paragraph)
      post_caption: description, // Also add as post_caption
      publish_at: publishedAt.toISOString(),
      post_created_at: publishedAt.toISOString(),
      sentiment,
      sentiment_score: getSentimentScore(sentiment),
      topic_classification: topic,
      urgency_level: urgency,
      target_audience: randomChoices(['Warga Jakarta', 'Pemerintah', 'Pengusaha', 'Pelajar', 'Komunitas'], randomInRange(1, 3)),
      affected_region: region,
      post_media_link: [`https://picsum.photos/seed/news${i}/800/600`], // Make it an array
      image_url: `https://picsum.photos/seed/news${i}/800/600`,
      engagement_rate: engagementRate,
      influence_score: randomFloat(40, 95),
      reach_score: randomFloat(50, 100),
      source,
      creator: source, // Add creator field
      author: `${faker.person.fullName()} - ${source}`,
      like_count: Math.floor(baseEngagement * 0.6),
      share_count: Math.floor(baseEngagement * 0.2),
      comment_count: Math.floor(baseEngagement * 0.15),
      view_count: baseEngagement * randomInRange(10, 50),
      contextual_keywords: [topic, region, 'Jakarta', 'Pemerintah DKI'].concat(
        topic.includes('Transportation') ? ['transportasi', 'jalan', 'macet'] :
        topic.includes('Environment') ? ['banjir', 'lingkungan', 'udara'] :
        topic.includes('Education') ? ['sekolah', 'siswa', 'pendidikan'] :
        []
      ),
    });
  }

  return articles.sort((a, b) => new Date(b.post_created_at).getTime() - new Date(a.post_created_at).getTime());
};

// ========================================
// TIKTOK GENERATOR
// ========================================

export const generateEnhancedTikTokPosts = (count: number = CONFIG.tiktok.count) => {
  const posts: any[] = [];

  const usernames = [
    'jakarta_update', 'warga_jkt', 'citizen_voice', 'jkt_monitoring',
    'jakarta_news', 'berita_jkt', 'info_jakarta', 'jkt_realtime',
    'citizen_jkt', 'jakarta_alerts', 'jkt_watch', 'jakarta_today',
    'suara_jakarta', 'jkt_info', 'jakarta_live', 'kabar_jakarta',
    'update_jkt', 'jktinfo', 'jakarta247', 'jkt_citizen'
  ];

  for (let i = 0; i < count; i++) {
    const topic = randomChoice(TIKTOK_TOPICS);
    const region = randomChoice(REGIONS);
    const username = randomChoice(usernames);
    const templateOptions = TIKTOK_TEMPLATES[topic as keyof typeof TIKTOK_TEMPLATES];

    if (!templateOptions || templateOptions.length === 0) continue;

    const template = randomChoice(templateOptions);

    // Ensure high urgency percentage for Social Monitoring
    let urgency: number;
    if (Math.random() < CONFIG.tiktok.highUrgencyPercentage) {
      // Force high urgency (70-95)
      urgency = randomInRange(70, 95);
    } else {
      // Use template urgency range
      urgency = randomInRange(template.urgencyRange[0], template.urgencyRange[1]);
    }

    const sentiment = determineSentiment(template.sentimentBias);
    const createdAt = randomDate(CONFIG.tiktok.dateRangeInDays);

    const placeholders: Record<string, any> = {
      region,
      hours: randomInRange(1, 4),
      aqi: randomInRange(120, 250),
      days: randomInRange(3, 10),
      price: `Rp ${randomInRange(18000, 28000).toLocaleString('id-ID')}`,
    };

    const caption = replacePlaceholders(template.template, placeholders);

    const likeCount = randomInRange(template.likeRange[0], template.likeRange[1]);
    const commentCount = Math.floor(likeCount * randomFloat(0.05, 0.15));
    const shareCount = Math.floor(likeCount * randomFloat(0.02, 0.08));
    const viewCount = likeCount * randomInRange(15, 45);

    const hashtags = caption.match(/#\w+/g) || [];
    const mentions = caption.match(/@\w+/g) || [];

    posts.push({
      _id: `enhanced_tiktok_${i + 1}`,
      post_caption: caption,
      link_post: `https://tiktok.com/@${username}/video/${Date.now()}${i}`,
      thumbnail_url: `https://picsum.photos/seed/tiktok${i}/480/854`,
      username,
      post_created_at: createdAt.toISOString(),
      topic_classification: topic,
      sentiment,
      sentiment_score: getSentimentScore(sentiment),
      urgency_level: urgency,
      affected_region: region,
      like_count: likeCount,
      comment_count: commentCount,
      share_count: shareCount,
      view_count: viewCount,
      play_count: viewCount,
      post_hashtags: hashtags,
      post_mentions: mentions,
      contextual_keywords: [topic, region, 'Jakarta'].concat(hashtags),
      target_audience: randomChoices(['Warga Jakarta', 'Milenial', 'Gen Z', 'Komunitas Lokal'], randomInRange(1, 2)),
      engagement_rate: ((likeCount + commentCount + shareCount) / viewCount * 100).toFixed(2),
      influence_score: randomFloat(30, 90),
      reach_score: randomFloat(40, 95),
    });
  }

  return posts.sort((a, b) => new Date(b.post_created_at).getTime() - new Date(a.post_created_at).getTime());
};

// ========================================
// CHAT LOGS GENERATOR
// ========================================

export const generateEnhancedChatLogs = (count: number = CONFIG.chatLogs.count) => {
  const logs: any[] = [];

  for (let i = 0; i < count; i++) {
    const template = randomChoice(CHAT_TEMPLATES);
    const region = randomChoice(REGIONS);
    const timestamp = randomDate(CONFIG.chatLogs.dateRangeInDays);
    const urgency = randomInRange(template.urgencyRange[0], template.urgencyRange[1]);

    const placeholders = {
      region,
      street: faker.location.street(),
    };

    const userMessage = replacePlaceholders(template.userMessage, placeholders);
    const botResponse = replacePlaceholders(template.botResponse, placeholders);

    const sentiments = ['Positive', 'Neutral', 'Negative'];
    const sentiment = urgency > 65 ? randomChoice(['Negative', 'Neutral']) : randomChoice(sentiments);

    logs.push({
      _id: `chat_log_${i + 1}`,
      user_id: `user_${randomInRange(1000, 9999)}`,
      username: faker.internet.username(),
      message_id: `msg_${Date.now()}_${i}`,
      message_text: userMessage,
      bot_response: botResponse,
      timestamp: timestamp.toISOString(),
      classification_topic: template.topic,
      urgency_level: urgency,
      sentiment,
      sentiment_score: getSentimentScore(sentiment),
      affected_region: region,
      response_time_seconds: randomInRange(5, 120),
      resolved: Math.random() > 0.25,
      satisfaction_score: randomFloat(3.0, 5.0, 1),
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// ========================================
// GENERATE ALL DATA
// ========================================

console.log('🚀 Generating enhanced dummy data for Risara...');
console.log(`📰 News Articles: ${CONFIG.news.count}`);
console.log(`📱 TikTok Posts: ${CONFIG.tiktok.count}`);
console.log(`💬 Chat Logs: ${CONFIG.chatLogs.count}`);

export const enhancedNewsArticles = generateEnhancedNewsArticles();
// Generate specific TikTok posts related to October 21, 2025 insights
const generateSpecificTikTokPosts = () => {
  const specificPosts = [
    // Related to Banjir Cengkareng insight
    {
      _id: 'tiktok_specific_1',
      post_caption: 'BANJIR LAGI DI CENGKARENG! Air udah masuk rumah setinggi 80cm 😭😭 Kejadian semalam jam 22:00 WIB. Tolong bantu! @BPBDDKI @DKIJakarta #BanjirJakartaLagi #Cengkareng #Emergency',
      link_post: 'https://tiktok.com/@warga_cengkareng/video/1729384756201',
      thumbnail_url: 'https://picsum.photos/seed/banjircengkareng/480/854',
      username: 'warga_cengkareng',
      post_created_at: new Date('2025-10-20T22:30:00Z').toISOString(),
      topic_classification: 'Environment and Disaster',
      sentiment: 'Negative',
      sentiment_score: -0.89,
      urgency_level: 89,
      affected_region: 'Jakarta Barat',
      like_count: 43521,
      comment_count: 6543,
      share_count: 3421,
      view_count: 8743000,
      play_count: 8743000,
      post_hashtags: ['#BanjirJakartaLagi', '#Cengkareng', '#Emergency'],
      post_mentions: ['@BPBDDKI', '@DKIJakarta'],
      contextual_keywords: ['banjir', 'Cengkareng', 'Jakarta Barat', 'pompa rusak'],
      target_audience: ['Warga Jakarta', 'Pemerintah'],
      engagement_rate: '6.13',
      influence_score: 87.5,
      reach_score: 92.3,
    },
    // Related to Macet Tol Dalam Kota insight
    {
      _id: 'tiktok_specific_2',
      post_caption: 'MACET PARAH TOL DALAM KOTA! 🚗😱 Udah 3 jam gak jalan-jalan dari pagi jam 5:30. Ada kecelakaan truk kontainer di KM 12. Terlambat masuk kerja nih! #MacetTolDalamKota #Jakarta #Cawang',
      link_post: 'https://tiktok.com/@commuter_jkt/video/1729385621847',
      thumbnail_url: 'https://picsum.photos/seed/macettol/480/854',
      username: 'commuter_jkt',
      post_created_at: new Date('2025-10-21T06:15:00Z').toISOString(),
      topic_classification: 'Infrastructure and Transportation',
      sentiment: 'Negative',
      sentiment_score: -0.83,
      urgency_level: 83,
      affected_region: 'Jakarta Timur',
      like_count: 38127,
      comment_count: 5621,
      share_count: 2890,
      view_count: 7621000,
      play_count: 7621000,
      post_hashtags: ['#MacetTolDalamKota', '#Jakarta', '#Cawang'],
      post_mentions: ['@DKIJakarta', '@JasaMarga'],
      contextual_keywords: ['macet', 'tol', 'kecelakaan', 'truk kontainer'],
      target_audience: ['Warga Jakarta', 'Komuter'],
      engagement_rate: '6.12',
      influence_score: 85.2,
      reach_score: 89.7,
    },
    // Related to Penjambretan Kelapa Gading insight
    {
      _id: 'tiktok_specific_3',
      post_caption: '⚠️ VIDEO CCTV PENJAMBRETAN DI KELAPA GADING! Korban meninggal 😭 Kejadian tadi malam 19 Oktober jam 21:30. TOLONG VIRALKAN BIAR PELAKU CEPAT DITANGKAP! @PolresJakartaTimur #PenjambretanKelapaGading #Jakarta #JusticeForVictim',
      link_post: 'https://tiktok.com/@jakarta_update/video/1729312847563',
      thumbnail_url: 'https://picsum.photos/seed/penjambretan/480/854',
      username: 'jakarta_update',
      post_created_at: new Date('2025-10-20T08:00:00Z').toISOString(),
      topic_classification: 'Safety and Crime',
      sentiment: 'Negative',
      sentiment_score: -0.94,
      urgency_level: 94,
      affected_region: 'Jakarta Timur',
      like_count: 94532,
      comment_count: 18943,
      share_count: 12654,
      view_count: 18900000,
      play_count: 18900000,
      post_hashtags: ['#PenjambretanKelapaGading', '#Jakarta', '#JusticeForVictim'],
      post_mentions: ['@PolresJakartaTimur', '@DKIJakarta'],
      contextual_keywords: ['penjambretan', 'Kelapa Gading', 'CCTV', 'viral'],
      target_audience: ['Warga Jakarta', 'Komunitas Lokal'],
      engagement_rate: '6.67',
      influence_score: 94.8,
      reach_score: 96.2,
    },
    // Related to Polusi Udara insight
    {
      _id: 'tiktok_specific_4',
      post_caption: 'Kualitas udara Jakarta hari ini PARAH BANGET! AQI 165 kategori tidak sehat 😷 Jakarta Pusat & Selatan paling parah. Jangan lupa pakai masker ya guys! #PolusiJakarta #AQI #KesehatanJakarta',
      link_post: 'https://tiktok.com/@eco_jakarta/video/1729387215436',
      thumbnail_url: 'https://picsum.photos/seed/polusi/480/854',
      username: 'eco_jakarta',
      post_created_at: new Date('2025-10-21T07:30:00Z').toISOString(),
      topic_classification: 'Environment and Disaster',
      sentiment: 'Negative',
      sentiment_score: -0.78,
      urgency_level: 92,
      affected_region: 'Jakarta Pusat',
      like_count: 29654,
      comment_count: 4532,
      share_count: 2187,
      view_count: 5932000,
      play_count: 5932000,
      post_hashtags: ['#PolusiJakarta', '#AQI', '#KesehatanJakarta'],
      post_mentions: ['@DinasLHDKI', '@DKIJakarta'],
      contextual_keywords: ['polusi', 'udara', 'AQI', 'tidak sehat'],
      target_audience: ['Warga Jakarta', 'Kesehatan'],
      engagement_rate: '6.17',
      influence_score: 88.4,
      reach_score: 90.1,
    },
    // Related to Pasar Santa UMKM insight
    {
      _id: 'tiktok_specific_5',
      post_caption: 'UMKM di Pasar Santa nangis 😭 Omzet turun 60% gara-gara parkir naik dari 5rb jadi 20rb! Pengunjung pada kabur ke mall lain. Tolong dong @DKIJakarta dikaji ulang kebijakannya! #PasarSanta #UMKM #JakartaSelatan',
      link_post: 'https://tiktok.com/@kuliner_jkt/video/1729365478921',
      thumbnail_url: 'https://picsum.photos/seed/pasarsanta/480/854',
      username: 'kuliner_jkt',
      post_created_at: new Date('2025-10-19T14:20:00Z').toISOString(),
      topic_classification: 'Social and Economy',
      sentiment: 'Negative',
      sentiment_score: -0.74,
      urgency_level: 74,
      affected_region: 'Jakarta Selatan',
      like_count: 21943,
      comment_count: 4387,
      share_count: 1876,
      view_count: 4387000,
      play_count: 4387000,
      post_hashtags: ['#PasarSanta', '#UMKM', '#JakartaSelatan'],
      post_mentions: ['@DKIJakarta'],
      contextual_keywords: ['Pasar Santa', 'UMKM', 'parkir', 'omzet turun'],
      target_audience: ['UMKM', 'Warga Jakarta'],
      engagement_rate: '6.39',
      influence_score: 76.3,
      reach_score: 78.9,
    },
    // Related to Harga Cabai insight
    {
      _id: 'tiktok_specific_6',
      post_caption: 'HARGA CABAI GILA-GILAAN! 🌶️😱 Dari 35rb sekarang jadi 65rb per kilo! Pedagang pada ngeluh, ibu-ibu pada shock. Menjelang Maulid Nabi juga nih. @DKIJakarta tolong operasi pasar dong! #HargaCabai #MahalBanget #Jakarta',
      link_post: 'https://tiktok.com/@pasar_update/video/1729354782136',
      thumbnail_url: 'https://picsum.photos/seed/cabai/480/854',
      username: 'pasar_update',
      post_created_at: new Date('2025-10-20T09:45:00Z').toISOString(),
      topic_classification: 'Social and Economy',
      sentiment: 'Negative',
      sentiment_score: -0.71,
      urgency_level: 78,
      affected_region: 'Jakarta Pusat',
      like_count: 19876,
      comment_count: 3976,
      share_count: 1654,
      view_count: 3976000,
      play_count: 3976000,
      post_hashtags: ['#HargaCabai', '#MahalBanget', '#Jakarta'],
      post_mentions: ['@DKIJakarta', '@KemenDAGRI'],
      contextual_keywords: ['cabai', 'harga naik', 'pasar', 'sembako'],
      target_audience: ['Ibu Rumah Tangga', 'Pedagang'],
      engagement_rate: '6.45',
      influence_score: 74.2,
      reach_score: 76.8,
    },
    // Related to IMB Online insight
    {
      _id: 'tiktok_specific_7',
      post_caption: 'PERIZINAN IMB ONLINE JAKARTA LAMA BANGET! 😤 Janjinya 14 hari, kenyataannya udah 4 bulan belum kelar juga. Sistem sering error, persyaratan ribet. @DKIJakarta tolong diperbaiki! #IMBOnline #PerizikanJakarta #Komplain',
      link_post: 'https://tiktok.com/@properti_insider/video/1729342156789',
      thumbnail_url: 'https://picsum.photos/seed/imb/480/854',
      username: 'properti_insider',
      post_created_at: new Date('2025-10-18T11:30:00Z').toISOString(),
      topic_classification: 'Government and Public Policy',
      sentiment: 'Negative',
      sentiment_score: -0.68,
      urgency_level: 77,
      affected_region: 'Jakarta Pusat',
      like_count: 18265,
      comment_count: 3654,
      share_count: 1543,
      view_count: 3654000,
      play_count: 3654000,
      post_hashtags: ['#IMBOnline', '#PerizikanJakarta', '#Komplain'],
      post_mentions: ['@DKIJakarta', '@PTSPJAKARTA'],
      contextual_keywords: ['IMB', 'perizinan', 'online', 'lambat'],
      target_audience: ['Developer', 'Pemilik Properti'],
      engagement_rate: '6.43',
      influence_score: 73.1,
      reach_score: 75.4,
    },
    // Related to Antrian Dukcapil insight
    {
      _id: 'tiktok_specific_8',
      post_caption: 'ANTRIAN DUKCAPIL JAKARTA MENGULAR! 😫 Menjelang deadline e-KTP 31 Oktober, antriannya 4-6 jam! Banyak yang udah dari subuh. @DukcapilDKI tolong tambah pelayanan dong! #AntrianDukcapil #eKTP #Jakarta',
      link_post: 'https://tiktok.com/@info_warga/video/1729376543218',
      thumbnail_url: 'https://picsum.photos/seed/dukcapil/480/854',
      username: 'info_warga',
      post_created_at: new Date('2025-10-21T08:15:00Z').toISOString(),
      topic_classification: 'Government and Public Policy',
      sentiment: 'Negative',
      sentiment_score: -0.75,
      urgency_level: 81,
      affected_region: 'Jakarta Selatan',
      like_count: 16432,
      comment_count: 3287,
      share_count: 1398,
      view_count: 3287000,
      play_count: 3287000,
      post_hashtags: ['#AntrianDukcapil', '#eKTP', '#Jakarta'],
      post_mentions: ['@DukcapilDKI', '@DKIJakarta'],
      contextual_keywords: ['Dukcapil', 'e-KTP', 'antrian', 'deadline'],
      target_audience: ['Warga Jakarta'],
      engagement_rate: '6.44',
      influence_score: 78.6,
      reach_score: 80.2,
    },
    // Related to Kemacetan Fatmawati insight
    {
      _id: 'tiktok_specific_9',
      post_caption: 'MACET PARAH DI FATMAWATI! 🚗😭 Perbaikan jalan + pembangunan MRT Fase 3 bikin waktu tempuh 150% lebih lama! Dari 30 menit jadi 1.5 jam! @DKIJakarta @TransJakarta tolong koordinasi dong! #MacetFatmawati #JakartaSelatan',
      link_post: 'https://tiktok.com/@traffic_jkt/video/1729382947651',
      thumbnail_url: 'https://picsum.photos/seed/fatmawati/480/854',
      username: 'traffic_jkt',
      post_created_at: new Date('2025-10-21T07:00:00Z').toISOString(),
      topic_classification: 'Infrastructure and Transportation',
      sentiment: 'Negative',
      sentiment_score: -0.81,
      urgency_level: 87,
      affected_region: 'Jakarta Selatan',
      like_count: 14723,
      comment_count: 2943,
      share_count: 1254,
      view_count: 2943000,
      play_count: 2943000,
      post_hashtags: ['#MacetFatmawati', '#JakartaSelatan', '#MRTJakarta'],
      post_mentions: ['@DKIJakarta', '@TransJakarta', '@MRTJakarta'],
      contextual_keywords: ['macet', 'Fatmawati', 'MRT', 'perbaikan jalan'],
      target_audience: ['Komuter', 'Warga Jakarta'],
      engagement_rate: '6.48',
      influence_score: 84.7,
      reach_score: 86.3,
    },
    // Positive post - BPBD response
    {
      _id: 'tiktok_specific_10',
      post_caption: 'Alhamdulillah BPBD cepat tanggap! 🙏 Banjir di Cengkareng mulai surut, pompa air udah diperbaiki. Terima kasih tim BPBD yang kerja keras! @BPBDDKI #BanjirJakarta #TerimaKasihBPBD #Cengkareng',
      link_post: 'https://tiktok.com/@grateful_citizen/video/1729389654321',
      thumbnail_url: 'https://picsum.photos/seed/bpbd/480/854',
      username: 'grateful_citizen',
      post_created_at: new Date('2025-10-21T10:00:00Z').toISOString(),
      topic_classification: 'Environment and Disaster',
      sentiment: 'Positive',
      sentiment_score: 0.82,
      urgency_level: 45,
      affected_region: 'Jakarta Barat',
      like_count: 12543,
      comment_count: 1876,
      share_count: 987,
      view_count: 2534000,
      play_count: 2534000,
      post_hashtags: ['#BanjirJakarta', '#TerimaKasihBPBD', '#Cengkareng'],
      post_mentions: ['@BPBDDKI', '@DKIJakarta'],
      contextual_keywords: ['BPBD', 'banjir surut', 'pompa diperbaiki', 'Cengkareng'],
      target_audience: ['Warga Jakarta'],
      engagement_rate: '6.25',
      influence_score: 68.4,
      reach_score: 71.2,
    },
  ];

  return specificPosts;
};

// Generate additional posts to create denser network
const generateNetworkDensePosts = () => {
  const networkPosts: any[] = [];
  const now = new Date('2025-10-21T10:00:00Z');

  // Create multiple posts for each trending hashtag to ensure they appear as nodes
  const trendingHashtags = [
    '#BanjirJakartaLagi',
    '#MacetTolDalamKota',
    '#PenjambretanKelapaGading',
    '#PolusiJakarta',
    '#PasarSanta',
    '#HargaCabai',
    '#IMBOnline',
    '#AntrianDukcapil',
    '#MacetFatmawati',
    '#InfoJakarta'
  ];

  const trendingMentions = [
    '@DKIJakarta',
    '@BPBDDKI',
    '@TransJakarta',
    '@PolresJakartaTimur',
    '@DinasLHDKI',
    '@DukcapilDKI',
    '@MRTJakarta'
  ];

  const usernames = [
    'warga_jakarta_1', 'warga_jakarta_2', 'warga_jakarta_3', 'citizen_jkt',
    'jakarta_viral', 'info_jakarta', 'berita_jakarta', 'warga_peduli',
    'jakarta_today', 'jakarta_news', 'warga_aktif', 'jakarta_insider',
    'citizen_reporter', 'warga_resah', 'jakarta_watch'
  ];

  let postId = 100;

  // Generate 15 posts per hashtag (150 total posts)
  trendingHashtags.forEach((hashtag, hIdx) => {
    for (let i = 0; i < 15; i++) {
      const username = usernames[Math.floor(Math.random() * usernames.length)];
      const postDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);

      // Select 2-3 random mentions
      const selectedMentions: string[] = [];
      const numMentions = Math.floor(Math.random() * 3) + 1;
      for (let m = 0; m < numMentions; m++) {
        const randomMention = trendingMentions[Math.floor(Math.random() * trendingMentions.length)];
        if (!selectedMentions.includes(randomMention)) {
          selectedMentions.push(randomMention);
        }
      }

      // Select 1-2 additional random hashtags
      const selectedHashtags = [hashtag];
      const additionalHashtag = trendingHashtags[Math.floor(Math.random() * trendingHashtags.length)];
      if (additionalHashtag !== hashtag) {
        selectedHashtags.push(additionalHashtag);
      }

      const captions = [
        `Update terbaru ${hashtag}! Situasi masih berlangsung. ${selectedMentions.join(' ')} tolong segera ditangani!`,
        `Viral nih! ${hashtag} bikin resah warga. ${selectedMentions[0]} harus bertindak cepat!`,
        `Info penting ${hashtag}! Semua warga harus tahu ini. Share ya! ${selectedHashtags.join(' ')}`,
        `Breaking news ${hashtag}! Kondisi semakin parah. ${selectedMentions.join(' ')} di mana?`,
        `Update ${hashtag} hari ini. Warga mengeluh keras! ${selectedMentions[0]} segera ambil tindakan!`
      ];

      const topics = [
        'Infrastructure and Transportation',
        'Environment and Disaster',
        'Safety and Crime',
        'Government and Public Policy',
        'Social and Economy'
      ];

      networkPosts.push({
        _id: `network_post_${postId++}`,
        post_caption: captions[i % captions.length],
        link_post: `https://tiktok.com/@${username}/video/${Date.now() + i}`,
        thumbnail_url: `https://picsum.photos/seed/network${postId}/480/854`,
        username: username,
        post_created_at: postDate.toISOString(),
        topic_classification: topics[hIdx % topics.length],
        sentiment: Math.random() > 0.7 ? 'Positive' : 'Negative',
        sentiment_score: Math.random() > 0.7 ? Math.random() * 0.5 + 0.5 : -(Math.random() * 0.5 + 0.5),
        urgency_level: Math.floor(Math.random() * 40) + 60,
        affected_region: ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat', 'Jakarta Utara'][Math.floor(Math.random() * 5)],
        like_count: Math.floor(Math.random() * 50000) + 10000,
        comment_count: Math.floor(Math.random() * 5000) + 1000,
        share_count: Math.floor(Math.random() * 3000) + 500,
        view_count: Math.floor(Math.random() * 1000000) + 100000,
        play_count: Math.floor(Math.random() * 1000000) + 100000,
        post_hashtags: selectedHashtags,
        post_mentions: selectedMentions,
        contextual_keywords: [hashtag.replace('#', ''), ...selectedHashtags.map(h => h.replace('#', ''))],
        target_audience: ['Warga Jakarta'],
        engagement_rate: (Math.random() * 3 + 4).toFixed(2),
        influence_score: Math.random() * 30 + 60,
        reach_score: Math.random() * 30 + 65,
      });
    }
  });

  // Generate 10 posts per mention (70 total posts)
  trendingMentions.forEach((mention) => {
    for (let i = 0; i < 10; i++) {
      const username = usernames[Math.floor(Math.random() * usernames.length)];
      const postDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);

      // Select 2-3 hashtags
      const selectedHashtags: string[] = [];
      const numHashtags = Math.floor(Math.random() * 2) + 2;
      for (let h = 0; h < numHashtags; h++) {
        const randomHashtag = trendingHashtags[Math.floor(Math.random() * trendingHashtags.length)];
        if (!selectedHashtags.includes(randomHashtag)) {
          selectedHashtags.push(randomHashtag);
        }
      }

      const captions = [
        `${mention} tolong respon masalah ini! Warga udah mengeluh berhari-hari ${selectedHashtags.join(' ')}`,
        `Terima kasih ${mention} sudah cepat tanggap! ${selectedHashtags[0]} akhirnya ada solusi`,
        `${mention} kapan akan ada tindakan konkret? ${selectedHashtags.join(' ')} makin parah!`,
        `Apresiasi untuk ${mention} yang kerja keras atasi masalah ${selectedHashtags[0]}`,
        `${mention} harus lebih proaktif! ${selectedHashtags.join(' ')} butuh penanganan segera!`
      ];

      networkPosts.push({
        _id: `network_mention_${postId++}`,
        post_caption: captions[i % captions.length],
        link_post: `https://tiktok.com/@${username}/video/${Date.now() + i}`,
        thumbnail_url: `https://picsum.photos/seed/mention${postId}/480/854`,
        username: username,
        post_created_at: postDate.toISOString(),
        topic_classification: 'Government and Public Policy',
        sentiment: Math.random() > 0.5 ? 'Negative' : 'Positive',
        sentiment_score: Math.random() > 0.5 ? -(Math.random() * 0.5 + 0.5) : Math.random() * 0.5 + 0.5,
        urgency_level: Math.floor(Math.random() * 30) + 60,
        affected_region: ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat', 'Jakarta Utara'][Math.floor(Math.random() * 5)],
        like_count: Math.floor(Math.random() * 30000) + 5000,
        comment_count: Math.floor(Math.random() * 3000) + 500,
        share_count: Math.floor(Math.random() * 2000) + 300,
        view_count: Math.floor(Math.random() * 500000) + 50000,
        play_count: Math.floor(Math.random() * 500000) + 50000,
        post_hashtags: selectedHashtags,
        post_mentions: [mention],
        contextual_keywords: [mention.replace('@', ''), ...selectedHashtags.map(h => h.replace('#', ''))],
        target_audience: ['Warga Jakarta', 'Pemerintah'],
        engagement_rate: (Math.random() * 3 + 4).toFixed(2),
        influence_score: Math.random() * 25 + 65,
        reach_score: Math.random() * 25 + 70,
      });
    }
  });

  return networkPosts;
};

// Combine specific posts with generated posts and network dense posts
const specificTikTokPosts = generateSpecificTikTokPosts();
const networkDensePosts = generateNetworkDensePosts();
const generatedTikTokPosts = generateEnhancedTikTokPosts();

// Place specific posts at the top, then network posts, then generated posts
export const enhancedTikTokPosts = [...specificTikTokPosts, ...networkDensePosts, ...generatedTikTokPosts];
export const enhancedChatLogs = generateEnhancedChatLogs();

console.log('✅ Enhanced dummy data generated successfully!');

// ========================================
// AGGREGATED STATISTICS
// ========================================

export const enhancedStatistics = {
  news: {
    totalArticles: enhancedNewsArticles.length,
    highUrgency: enhancedNewsArticles.filter(a => a.urgency_level >= 70).length,
    critical: enhancedNewsArticles.filter(a => a.urgency_level >= 80).length,
    positiveSentiment: enhancedNewsArticles.filter(a => a.sentiment === 'Positive').length,
    neutralSentiment: enhancedNewsArticles.filter(a => a.sentiment === 'Neutral').length,
    negativeSentiment: enhancedNewsArticles.filter(a => a.sentiment === 'Negative').length,
    positiveSentimentPercent: ((enhancedNewsArticles.filter(a => a.sentiment === 'Positive').length / enhancedNewsArticles.length) * 100).toFixed(1),
    totalEngagement: enhancedNewsArticles.reduce((sum, a) => sum + (a.like_count || 0) + (a.share_count || 0) + (a.comment_count || 0), 0),
    totalViews: enhancedNewsArticles.reduce((sum, a) => sum + (a.view_count || 0), 0),
    topicDistribution: NEWS_TOPICS.map(topic => ({
      topic,
      count: enhancedNewsArticles.filter(a => a.topic_classification === topic).length,
      avgUrgency: (enhancedNewsArticles.filter(a => a.topic_classification === topic).reduce((sum, a) => sum + a.urgency_level, 0) / enhancedNewsArticles.filter(a => a.topic_classification === topic).length).toFixed(1),
    })),
    regionalDistribution: REGIONS.map(region => ({
      region,
      count: enhancedNewsArticles.filter(a => a.affected_region === region).length,
      criticalCount: enhancedNewsArticles.filter(a => a.affected_region === region && a.urgency_level >= 80).length,
    })),
  },
  tiktok: {
    totalPosts: enhancedTikTokPosts.length,
    totalLikes: enhancedTikTokPosts.reduce((sum, p) => sum + p.like_count, 0),
    totalComments: enhancedTikTokPosts.reduce((sum, p) => sum + p.comment_count, 0),
    totalShares: enhancedTikTokPosts.reduce((sum, p) => sum + p.share_count, 0),
    totalViews: enhancedTikTokPosts.reduce((sum, p) => sum + p.view_count, 0),
    totalEngagement: enhancedTikTokPosts.reduce((sum, p) => sum + p.like_count + p.comment_count + p.share_count, 0),
    highUrgency: enhancedTikTokPosts.filter(p => p.urgency_level >= 70).length,
    critical: enhancedTikTokPosts.filter(p => p.urgency_level >= 80).length,
    positiveSentiment: enhancedTikTokPosts.filter(p => p.sentiment === 'Positive').length,
    neutralSentiment: enhancedTikTokPosts.filter(p => p.sentiment === 'Neutral').length,
    negativeSentiment: enhancedTikTokPosts.filter(p => p.sentiment === 'Negative').length,
    positiveSentimentPercent: ((enhancedTikTokPosts.filter(p => p.sentiment === 'Positive').length / enhancedTikTokPosts.length) * 100).toFixed(1),
    avgEngagementRate: (enhancedTikTokPosts.reduce((sum, p) => sum + parseFloat(p.engagement_rate), 0) / enhancedTikTokPosts.length).toFixed(2),
    topicDistribution: TIKTOK_TOPICS.map(topic => ({
      topic,
      count: enhancedTikTokPosts.filter(p => p.topic_classification === topic).length,
      avgEngagement: Math.floor(enhancedTikTokPosts.filter(p => p.topic_classification === topic).reduce((sum, p) => sum + p.like_count + p.comment_count + p.share_count, 0) / enhancedTikTokPosts.filter(p => p.topic_classification === topic).length),
    })),
  },
  chatLogs: {
    totalLogs: enhancedChatLogs.length,
    resolved: enhancedChatLogs.filter(l => l.resolved).length,
    unresolvedCritical: enhancedChatLogs.filter(l => !l.resolved && l.urgency_level >= 70).length,
    avgResponseTime: (enhancedChatLogs.reduce((sum, l) => sum + l.response_time_seconds, 0) / enhancedChatLogs.length).toFixed(1),
    avgSatisfaction: (enhancedChatLogs.reduce((sum, l) => sum + l.satisfaction_score, 0) / enhancedChatLogs.length).toFixed(1),
    topicDistribution: [...new Set(CHAT_TEMPLATES.map(t => t.topic))].map(topic => ({
      topic,
      count: enhancedChatLogs.filter(l => l.classification_topic === topic).length,
    })),
  },
  overall: {
    totalContent: enhancedNewsArticles.length + enhancedTikTokPosts.length,
    totalCriticalIssues: enhancedNewsArticles.filter(a => a.urgency_level >= 80).length + enhancedTikTokPosts.filter(p => p.urgency_level >= 80).length,
    totalReach: enhancedNewsArticles.reduce((sum, a) => sum + (a.view_count || 0), 0) + enhancedTikTokPosts.reduce((sum, p) => sum + p.view_count, 0),
    overallSentiment: {
      positive: enhancedNewsArticles.filter(a => a.sentiment === 'Positive').length + enhancedTikTokPosts.filter(p => p.sentiment === 'Positive').length,
      neutral: enhancedNewsArticles.filter(a => a.sentiment === 'Neutral').length + enhancedTikTokPosts.filter(p => p.sentiment === 'Neutral').length,
      negative: enhancedNewsArticles.filter(a => a.sentiment === 'Negative').length + enhancedTikTokPosts.filter(p => p.sentiment === 'Negative').length,
    },
  },
};

// ========================================
// EXPORT COMBINED DATA
// ========================================

// ========================================
// ADDITIONAL DUMMY DATA FOR OTHER FEATURES
// ========================================

// ========================================
// TRENDING TOPICS - October 21, 2025
// ========================================
// Relates to Root Cause Analysis insights

export const enhancedTrendingTopics = {
  news: [
    { key: 'Kualitas Udara Jakarta', doc_count: 2847, avg_urgency: 92, max_urgency: 95, trend: 'up', change: 156 },
    { key: 'Kemacetan Fatmawati', doc_count: 2134, avg_urgency: 87, max_urgency: 92, trend: 'up', change: 178 },
    { key: 'Penjambretan Jakarta', doc_count: 1876, avg_urgency: 85, max_urgency: 94, trend: 'up', change: 145 },
    { key: 'Antrian e-KTP', doc_count: 1654, avg_urgency: 81, max_urgency: 86, trend: 'up', change: 234 },
    { key: 'Harga Cabai Naik', doc_count: 1432, avg_urgency: 78, max_urgency: 83, trend: 'up', change: 198 },
    { key: 'MRT Fase 3', doc_count: 1287, avg_urgency: 65, max_urgency: 75, trend: 'up', change: 87 },
    { key: 'Transportasi Jakarta', doc_count: 1154, avg_urgency: 72, max_urgency: 87, trend: 'up', change: 92 },
    { key: 'Polusi Udara', doc_count: 987, avg_urgency: 90, max_urgency: 95, trend: 'up', change: 167 },
    { key: 'Drainase Jakarta', doc_count: 876, avg_urgency: 68, max_urgency: 78, trend: 'stable', change: 23 },
    { key: 'Keamanan Jakarta', doc_count: 754, avg_urgency: 83, max_urgency: 90, trend: 'up', change: 134 },
  ],
  tiktok: [
    { keyword: '#BanjirJakartaLagi', count: 8743, trend: 'up', change: 456 },
    { keyword: '#MacetTolDalamKota', count: 7621, trend: 'up', change: 389 },
    { keyword: '#PenjambretanKelapaGading', count: 6854, trend: 'up', change: 512 },
    { keyword: '#PolusiJakarta', count: 5932, trend: 'up', change: 298 },
    { keyword: '#PasarSanta', count: 4387, trend: 'up', change: 267 },
    { keyword: '#HargaCabai', count: 3976, trend: 'up', change: 234 },
    { keyword: '#IMBOnline', count: 3654, trend: 'up', change: 189 },
    { keyword: '#AntrianDukcapil', count: 3287, trend: 'up', change: 201 },
    { keyword: '#MacetFatmawati', count: 2943, trend: 'up', change: 178 },
    { keyword: '#InfoJakarta', count: 2534, trend: 'stable', change: 45 },
  ],
};

// Trending data for TikTok (matching API format)
export const enhancedTikTokTrending = {
  id: 'tiktok_trending_20251021',
  date: '2025-10-21',
  total_location: [
    { name: 'Jakarta Barat (Cengkareng)', total: 8743 },
    { name: 'Jakarta Timur (Kelapa Gading)', total: 6854 },
    { name: 'Jakarta Selatan (Fatmawati)', total: 5621 },
    { name: 'Jakarta Selatan (Pasar Santa)', total: 4387 },
    { name: 'Jakarta Pusat', total: 3976 },
    { name: 'Jakarta Utara', total: 2943 },
    { name: 'Tol Dalam Kota', total: 7621 },
  ],
  total_hashtags: [
    { name: '#BanjirJakartaLagi', total: 8743 },
    { name: '#MacetTolDalamKota', total: 7621 },
    { name: '#PenjambretanKelapaGading', total: 6854 },
    { name: '#PolusiJakarta', total: 5932 },
    { name: '#PasarSanta', total: 4387 },
    { name: '#HargaCabai', total: 3976 },
    { name: '#IMBOnline', total: 3654 },
    { name: '#AntrianDukcapil', total: 3287 },
    { name: '#MacetFatmawati', total: 2943 },
    { name: '#InfoJakarta', total: 2534 },
  ],
  total_mentions: [
    { name: '@DKIJakarta', total: 15432 },
    { name: '@BPBDDKI', total: 8743 },
    { name: '@TransJakarta', total: 5621 },
    { name: '@PolresJakartaTimur', total: 6854 },
    { name: '@DukcapilDKI', total: 3287 },
    { name: '@MRTJakarta', total: 2943 },
    { name: '@DinasLHDKI', total: 5932 },
  ]
};

// Crisis Timeline
export const enhancedCrisisTimeline = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'Hujan Deras Memicu Banjir di Jakarta Pusat dan Jakarta Utara',
    severity: 'critical',
    mentions: 1247,
    sentiment: -0.78,
    region: 'Jakarta Pusat',
    description: 'Curah hujan tinggi menyebabkan banjir di beberapa titik Jakarta Pusat dan Jakarta Utara',
    relatedPosts: 145,
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'BPBD Mengevakuasi Warga Terdampak Banjir',
    severity: 'high',
    mentions: 823,
    sentiment: 0.32,
    region: 'Jakarta Pusat',
    description: 'Tim BPBD DKI Jakarta bergerak cepat mengevakuasi warga',
    relatedPosts: 98,
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'Genangan Mulai Surut, Warga Kembali ke Rumah',
    severity: 'medium',
    mentions: 612,
    sentiment: 0.58,
    region: 'Jakarta Pusat',
    description: 'Genangan berangsur surut setelah pompa air bekerja maksimal',
    relatedPosts: 67,
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'Gubernur Tinjau Lokasi dan Janji Perbaikan Drainase',
    severity: 'low',
    mentions: 489,
    sentiment: 0.72,
    region: 'Jakarta Pusat',
    description: 'Gubernur DKI Jakarta turun langsung ke lokasi banjir',
    relatedPosts: 45,
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'Kemacetan Parah di Jakarta Selatan Akibat Perbaikan Jalan',
    severity: 'high',
    mentions: 934,
    sentiment: -0.65,
    region: 'Jakarta Selatan',
    description: 'Proyek perbaikan jalan menyebabkan kemacetan panjang',
    relatedPosts: 87,
  },
];

// Executive Summary - compatible with API response format
export const enhancedExecutiveSummary = {
  summary: `## 📊 Ringkasan Eksekutif - ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}

### 🚨 Isu Kritis (Urgency ≥ 80)

- **Infrastructure and Transportation** - Kemacetan parah di Jakarta Selatan akibat perbaikan jalan Fatmawati
  - Masalah: Koordinasi yang buruk antara Dinas Bina Marga dan MRT Jakarta menyebabkan kemacetan hingga 4 km. Tidak ada signage alternatif dan informasi publik minim.
  - Rekomendasi: Segera bentuk task force koordinasi, pasang signage rute alternatif, dan aktifkan traffic management system di 5 titik kritis.

- **Environment and Disaster** - Banjir Cengkareng mencapai ketinggian 80cm, 450+ warga mengungsi
  - Masalah: Drainase tersumbat dan pompa air tidak berfungsi optimal. BPBD kehabisan logistik untuk pengungsi.
  - Rekomendasi: Deploy pompa mobile tambahan, bersihkan drainase prioritas, dan kirim bantuan logistik darurat dalam 24 jam.

- **Safety and Crime** - Viral penjambretan di Kelapa Gading dengan 18.9M views di TikTok
  - Masalah: Minimnya patroli polisi di jam-jam rawan (18:00-21:00) dan penerangan jalan yang buruk.
  - Rekomendasi: Tambah frekuensi patroli mobile, perbaiki 25 titik lampu jalan dalam 1 minggu, dan tingkatkan CCTV coverage.

### ⚠️ Perlu Perhatian (Urgency 60-79)

- **Environment and Disaster**: Kualitas udara Jakarta AQI 165 (tidak sehat) - Aktifkan blue sky program dan kampanye work from home
- **Infrastructure and Transportation**: Kemacetan Tol Dalam Kota dengan 15.2M views - Optimalkan ganjil-genap dan tambah pintu tol elektronik
- **Social and Economy**: Harga cabai rawit Rp85.000/kg (naik 120%) - Operasi pasar dan subsidi distribusi ke pasar tradisional
- **Government and Public Policy**: Antrian Dukcapil hingga 4 jam - Buka layanan weekend dan tambah mobile unit keliling
- **Social and Economy**: Tarif parkir Pasar Santa naik, UMKM terancam tutup - Subsidi sewa 50% selama 3 bulan dan shuttle bus gratis dari MRT

### 📈 Trend & Insight Utama

- **Topik Dominan**: Infrastructure & Transportation (42%), Environment & Disaster (35%), Safety & Crime (15%)
- **Sentimen Publik**: 62% negative pada isu kritis, menunjukkan kekecewaan publik yang tinggi terhadap respons pemerintah
- **Platform Engagement**: TikTok jauh lebih viral (avg 12.5M views) vs News (avg 85K engagement), menunjukkan dominasi media sosial
- **Regional Focus**: Jakarta Barat (Cengkareng) dan Jakarta Selatan (Fatmawati) menjadi hotspot dengan 67% mention

### 💡 Rekomendasi Aksi Prioritas

1. **Task Force Banjir & Drainase**: Deploy pompa mobile dan bersihkan 15 titik drainase kritis di Cengkareng & Jakarta Pusat _(Urgency: 92/100)_
2. **Traffic Management Fatmawati**: Koordinasi Bina Marga-MRT, pasang 50 signage alternatif, aktifkan petugas traffic di 5 simpang _(Urgency: 87/100)_
3. **Patroli Keamanan Extra**: Tambah 20 patroli mobile di jam 18:00-21:00 fokus Jakarta Utara & Timur _(Urgency: 94/100)_
4. **Stabilisasi Harga**: Operasi pasar cabai di 25 pasar tradisional dengan target harga Rp45.000/kg _(Urgency: 78/100)_
5. **Blue Sky Emergency**: Aktifkan work from home untuk ASN dan kampanye transportasi publik _(Urgency: 92/100)_

### 📌 Catatan Penting

**PERINGATAN KRITIS**: Kombinasi banjir, kemacetan, dan polusi menciptakan "perfect storm" yang dapat menurunkan kepercayaan publik secara signifikan. Viral content di TikTok dengan total 56M+ views menunjukkan amplifikasi masalah yang eksponensial.

**Rekomendasi Komunikasi**: Gubernur perlu turun langsung ke minimal 2 lokasi kritis (Cengkareng & Fatmawati) dalam 48 jam untuk menunjukkan leadership dan command center activation.

**Monitoring Intensif**: Setup war room untuk 72 jam ke depan dengan update setiap 4 jam ke Gubernur terkait progress 5 aksi prioritas di atas.

---

*Generated by RISARA AI - Strategic Intelligence Platform*
*Data Sources: ${CONFIG.tiktok.count.toLocaleString()} TikTok posts, ${CONFIG.news.count.toLocaleString()} news articles*
*Analysis Period: Last 30 days | Critical Issues: ~${Math.floor(CONFIG.tiktok.count * 0.30 + CONFIG.news.count * 0.25)} posts (urgency ≥ 70)*`,

  metadata: {
    date: new Date().toISOString(),
    totalInsights: 10,
    criticalIssues: 3,
    highPriorityIssues: 5,
    avgUrgency: 85.6,
    byPlatform: {
      tiktok: 5,
      news: 5
    }
  }
};

// Problem-Solution Data - Transform to match API format
const problemSolutionsRaw = [
  {
    problem: 'Banjir berulang di Jakarta Pusat dan Jakarta Utara',
    mentions: 1847,
    urgency: 92,
    affectedRegions: ['Jakarta Pusat', 'Jakarta Utara'],
    relatedTopics: ['Environment and Disaster', 'Infrastructure and Transportation'],
    solutions: [
      {
        solution: 'Normalisasi sungai dan kali utama',
        feasibility: 78,
        impact: 95,
        cost: 'high',
        timeframe: '6-12 bulan',
        department: 'Dinas SDA',
      },
      {
        solution: 'Perbaikan dan upgrade sistem drainase',
        feasibility: 85,
        impact: 88,
        cost: 'medium-high',
        timeframe: '3-6 bulan',
        department: 'Dinas Bina Marga',
      },
      {
        solution: 'Pembuatan sumur resapan di area pemukiman',
        feasibility: 92,
        impact: 65,
        cost: 'low-medium',
        timeframe: '1-3 bulan',
        department: 'Dinas SDA',
      },
    ],
  },
  {
    problem: 'Kemacetan parah di jam sibuk Jakarta Selatan dan Jakarta Timur',
    mentions: 1432,
    urgency: 85,
    affectedRegions: ['Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat'],
    relatedTopics: ['Infrastructure and Transportation'],
    solutions: [
      {
        solution: 'Perluasan jalur MRT dan LRT fase berikutnya',
        feasibility: 65,
        impact: 95,
        cost: 'high',
        timeframe: '24-36 bulan',
        department: 'Dinas Perhubungan',
      },
      {
        solution: 'Penambahan armada dan koridor Transjakarta',
        feasibility: 88,
        impact: 75,
        cost: 'medium',
        timeframe: '2-4 bulan',
        department: 'Transjakarta',
      },
      {
        solution: 'Implementasi traffic engineering dan rekayasa lalu lintas',
        feasibility: 90,
        impact: 68,
        cost: 'low',
        timeframe: '1-2 bulan',
        department: 'Dinas Perhubungan',
      },
    ],
  },
  {
    problem: 'Polusi udara mencapai level tidak sehat',
    mentions: 987,
    urgency: 78,
    affectedRegions: ['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Timur'],
    relatedTopics: ['Environment and Disaster', 'Ecology and Green Spaces'],
    solutions: [
      {
        solution: 'Program penghijauan masif dan penanaman pohon',
        feasibility: 85,
        impact: 72,
        cost: 'medium',
        timeframe: '6-12 bulan',
        department: 'Dinas Kehutanan',
      },
      {
        solution: 'Uji emisi kendaraan wajib dan berkala',
        feasibility: 80,
        impact: 68,
        cost: 'low-medium',
        timeframe: '2-4 bulan',
        department: 'Dinas Lingkungan Hidup',
      },
      {
        solution: 'Kampanye work from home dan penggunaan transportasi publik',
        feasibility: 75,
        impact: 55,
        cost: 'low',
        timeframe: 'Ongoing',
        department: 'Dinas Komunikasi',
      },
    ],
  },
];

// Transform to API format with insights array - ONE insight per problem
const transformedInsights = problemSolutionsRaw.map(item => {
  // Combine all solutions into one suggestion text
  const combinedSuggestions = item.solutions.map((solution, idx) =>
    `${idx + 1}. **${solution.solution}**\n   - Feasibility: ${solution.feasibility}% | Impact: ${solution.impact}% | Cost: ${solution.cost}\n   - Timeline: ${solution.timeframe} | Dept: ${solution.department}`
  ).join('\n\n');

  return {
    topic: item.relatedTopics[0],
    mainIssue: item.problem,
    problem: `**Total Mentions:** ${item.mentions.toLocaleString()}\n**Affected Regions:** ${item.affectedRegions.join(', ')}\n**Related Topics:** ${item.relatedTopics.join(', ')}`,
    suggestion: combinedSuggestions,
    urgency: item.urgency,
    platform: 'Combined'
  };
});

// Export in API-compatible format
export const enhancedProblemSolutions = {
  insights: transformedInsights,
  stats: {
    total: transformedInsights.length,
    critical: transformedInsights.filter(i => i.urgency >= 80).length,
    high: transformedInsights.filter(i => i.urgency >= 60 && i.urgency < 80).length,
    avgUrgency: transformedInsights.reduce((sum, i) => sum + i.urgency, 0) / transformedInsights.length
  },
  filters: {
    topics: [...new Set(transformedInsights.map(i => i.topic))]
  }
};

// Keywords Cloud Data
export const enhancedKeywordsCloud = [
  { text: 'banjir', value: 5421, sentiment: 'negative', urgency: 85 },
  { text: 'macet', value: 4276, sentiment: 'negative', urgency: 75 },
  { text: 'transportasi', value: 3534, sentiment: 'neutral', urgency: 60 },
  { text: 'jakarta', value: 2987, sentiment: 'neutral', urgency: 50 },
  { text: 'pemerintah', value: 2354, sentiment: 'neutral', urgency: 55 },
  { text: 'kesehatan', value: 2023, sentiment: 'positive', urgency: 45 },
  { text: 'infrastruktur', value: 1789, sentiment: 'neutral', urgency: 65 },
  { text: 'pendidikan', value: 1487, sentiment: 'positive', urgency: 40 },
  { text: 'drainase', value: 1287, sentiment: 'negative', urgency: 80 },
  { text: 'MRT', value: 1134, sentiment: 'positive', urgency: 35 },
  { text: 'transjakarta', value: 987, sentiment: 'neutral', urgency: 50 },
  { text: 'gubernur', value: 842, sentiment: 'neutral', urgency: 55 },
  { text: 'warga', value: 765, sentiment: 'neutral', urgency: 50 },
  { text: 'solusi', value: 689, sentiment: 'positive', urgency: 60 },
  { text: 'genangan', value: 623, sentiment: 'negative', urgency: 75 },
  { text: 'jalan', value: 587, sentiment: 'neutral', urgency: 55 },
  { text: 'layanan', value: 534, sentiment: 'positive', urgency: 45 },
  { text: 'keluhan', value: 489, sentiment: 'negative', urgency: 65 },
  { text: 'perbaikan', value: 456, sentiment: 'positive', urgency: 60 },
  { text: 'cepat', value: 423, sentiment: 'positive', urgency: 50 },
  { text: 'polusi', value: 587, sentiment: 'negative', urgency: 78 },
  { text: 'udara', value: 512, sentiment: 'negative', urgency: 78 },
];

// ========================================
// ROOT CAUSE ANALYSIS INSIGHTS - October 21, 2025
// ========================================

export const enhancedNewsInsights = {
  date: '2025-10-21',
  insight: [
    {
      topic: 'Infrastructure and Transportation',
      main_issue: 'Kemacetan parah di **Jakarta Selatan** akibat perbaikan jalan Fatmawati yang bersamaan dengan pembangunan MRT Fase 3, menyebabkan waktu tempuh meningkat **150%** pada jam sibuk.',
      problem: `**Koordinasi yang buruk** antara Dinas Bina Marga dan MRT Jakarta dalam penjadwalan proyek infrastruktur
**Volume kendaraan meningkat 45%** karena pengalihan rute dari Jl. Fatmawati ke jalan alternatif yang tidak memadai
**Kurangnya sosialisasi** kepada masyarakat tentang jalur alternatif yang tersedia`,
      suggestion: '**Segera bentuk task force koordinasi** lintas dinas untuk sinkronisasi jadwal proyek infrastruktur. Tambahkan **10 unit bus Transjakarta** khusus untuk koridor Fatmawati-Blok M. Lakukan **sosialisasi masif** melalui media sosial dan papan informasi digital tentang rute alternatif terbaik.',
      urgency_score: 87
    },
    {
      topic: 'Environment and Disaster',
      main_issue: 'Kualitas udara Jakarta mencapai **AQI 165** (tidak sehat) pada tanggal **19-21 Oktober 2025**, terutama di Jakarta Pusat dan Jakarta Selatan, melampaui batas aman WHO.',
      problem: `**Emisi kendaraan bermotor** meningkat 35% pasca libur panjang Idul Adha
**Aktivitas konstruksi** dari 15+ proyek pembangunan gedung tinggi di Jakarta Pusat tanpa dust control memadai
**Kondisi cuaca** dengan inversi termal yang memerangkap polutan di permukaan`,
      suggestion: 'Terapkan **kebijakan WFH wajib 3 hari/minggu** untuk pegawai pemerintah dan BUMN mulai 22 Oktober. Lakukan **inspeksi mendadak** di lokasi konstruksi dan berikan sanksi tegas untuk yang tidak menerapkan dust suppression. **Percepat program bike-sharing** dan tambah jalur sepeda di 5 koridor prioritas.',
      urgency_score: 92
    },
    {
      topic: 'Social and Economy',
      main_issue: 'Harga cabai rawit melonjak **185%** dari Rp 35,000 menjadi **Rp 65,000/kg** di pasar-pasar Jakarta dalam 10 hari terakhir, memicu keluhan pedagang dan ibu rumah tangga.',
      problem: `**Gagal panen** di sentra produksi cabai Jawa Barat dan Jawa Tengah akibat curah hujan tinggi pada awal Oktober
**Jalur distribusi terganggu** akibat perbaikan jalan di jalur pantura yang memperlambat pasokan 40%
**Spekulasi pedagang** yang menimbun stok menjelang Lebaran Maulid Nabi (26 Oktober 2025)`,
      suggestion: 'Lakukan **operasi pasar cabai** dengan harga subsidi Rp 40,000/kg di 50 titik pasar tradisional mulai 22 Oktober. **Koordinasi dengan Bulog** untuk import cabai dari Thailand/India jika diperlukan. Lakukan **razia penimbunan** di pasar induk dan berikan sanksi tegas sesuai UU Perlindungan Konsumen.',
      urgency_score: 78
    },
    {
      topic: 'Government and Public Policy',
      main_issue: 'Antrian panjang di kantor Dukcapil Jakarta menjelang **deadline perpanjangan e-KTP** tanggal 31 Oktober 2025, dengan waktu tunggu mencapai **4-6 jam** per pemohon.',
      problem: `**Sistem pendaftaran online** yang sering error dan tidak user-friendly menyebabkan 60% warga tetap datang langsung
**Kapasitas pelayanan terbatas** hanya 200 pemohon per hari per kantor Dukcapil kecamatan
**Kurangnya sosialisasi** tentang layanan jemput bola Dukcapil untuk lansia dan difabel`,
      suggestion: 'Buka **layanan weekend khusus** pada 26-27 Oktober 2025 di 10 kecamatan dengan antrian terpanjang. Deploy **mobile unit Dukcapil** ke 20 kelurahan prioritas. Perpanjang **deadline hingga 30 November 2025** sambil upgrade sistem online dengan interface yang lebih sederhana.',
      urgency_score: 81
    },
    {
      topic: 'Safety and Crime',
      main_issue: 'Peningkatan **45% kasus penjambretan** di Jakarta Timur dan Jakarta Utara dalam minggu terakhir (14-21 Oktober 2025), terutama di sekitar halte Transjakarta dan stasiun KRL.',
      problem: `**Kurangnya penerangan** di 15+ halte Transjakarta yang menjadi titik rawan
**Patroli polisi** yang tidak konsisten pada jam-jam malam (21:00-01:00 WIB)
**Modus baru** pelaku menggunakan sepeda motor tanpa plat nomor dan beroperasi secara berkelompok`,
      suggestion: 'Tingkatkan **patroli mobile polisi** di 20 titik rawan dengan fokus pada jam 19:00-02:00 WIB. Pasang **CCTV tambahan** di 15 halte prioritas dengan monitoring real-time. Luncurkan **aplikasi panic button** terintegrasi dengan command center Polda Metro Jaya untuk response cepat.',
      urgency_score: 85
    }
  ]
};

export const enhancedTikTokInsights = {
  date: '2025-10-21',
  insight: [
    {
      topic: 'Infrastructure and Transportation',
      main_issue: 'Viral video kemacetan ekstrem di **Tol Dalam Kota** arah Cawang dengan **15.2 juta views**, warga mengeluh terlambat masuk kerja hingga 3 jam pada pagi hari 21 Oktober 2025.',
      problem: `**Kecelakaan truk kontainer** di KM 12 yang menutup 2 lajur sejak pukul 05:30 WIB
**Evakuasi lambat** memakan waktu 4 jam karena keterbatasan akses crane di lokasi
**Arus balik** dari libur panjang yang bertepatan dengan waktu peak hour menambah volume 70%`,
      suggestion: 'Deploy **sistem info lalu lintas real-time** via billboard digital dan social media setiap 15 menit. Siapkan **tim evakuasi cepat** dengan peralatan khusus di 5 titik strategis tol. Terapkan **dynamic pricing tol** yang lebih tinggi pada jam sibuk untuk mengurangi volume.',
      urgency_score: 83
    },
    {
      topic: 'Environment and Disaster',
      main_issue: 'Trending hashtag **#BanjirJakartaLagi** dengan **8.7 juta mentions** menyusul genangan **80cm** di Jakarta Barat (Cengkareng) pada 20 Oktober 2025 malam akibat hujan deras 4 jam.',
      problem: `**Drainase tersumbat** sampah dan sedimentasi di 12 titik kritis di Cengkareng
**Pompa air rusak** di 3 lokasi strategis sejak 2 minggu lalu belum diperbaiki
**Normalisasi kali Pesanggrahan** yang tertunda karena proses pembebasan lahan`,
      suggestion: 'Lakukan **pembersihan drainase massal** dalam 48 jam dengan mobilisasi 200 pekerja. **Perbaiki segera** 3 pompa air yang rusak dengan target operasional 22 Oktober. Percepat **pembebasan lahan** untuk normalisasi kali dengan skema kompensasi yang adil.',
      urgency_score: 89
    },
    {
      topic: 'Social and Economy',
      main_issue: 'Video viral UMKM kuliner di **Pasar Santa** mengeluh omzet turun **60%** pasca kenaikan tarif parkir dari Rp 5,000 menjadi **Rp 20,000**, mendapat **4.3 juta views** dan dukungan netizen.',
      problem: `**Kenaikan tarif parkir drastis** tanpa sosialisasi memadai membuat pengunjung beralih ke mal lain
**Tidak ada kompensasi** atau stimulus untuk UMKM yang terdampak
**Akses transportasi publik terbatas** ke Pasar Santa mendorong ketergantungan pada kendaraan pribadi`,
      suggestion: 'Kaji ulang **kebijakan tarif parkir** dengan melibatkan asosiasi UMKM dan pengunjung. Berikan **subsidi sewa** 50% selama 3 bulan untuk UMKM terdampak. Operasikan **shuttle bus gratis** dari stasiun MRT Blok M ke Pasar Santa setiap 30 menit.',
      urgency_score: 74
    },
    {
      topic: 'Government and Public Policy',
      main_issue: 'TikTok creator dengan **6.2 juta followers** membuat konten kritis tentang lambatnya proses perizinan **IMB online** yang memakan waktu **4 bulan** vs janji 14 hari, viral dengan **12.5 juta views**.',
      problem: `**Sistem SIMBG** yang sering down dan tidak stabil menghambat proses verifikasi
**Kurangnya SDM verifikator** hanya 25 orang untuk melayani ribuan permohonan per bulan
**Persyaratan yang kompleks** dan tidak jelas menyebabkan banyak dokumen ditolak berulang kali`,
      suggestion: 'Lakukan **upgrade server SIMBG** dalam 1 minggu dengan redundancy system. Rekrut **50 verifikator tambahan** dan buka layanan **konsultasi online gratis** untuk membantu pemohon menyiapkan dokumen. Sederhanakan **checklist persyaratan** menjadi 1 halaman infografis yang mudah dipahami.',
      urgency_score: 77
    },
    {
      topic: 'Safety and Crime',
      main_issue: 'Video CCTV penjambretan brutal di **Kelapa Gading** yang menewaskan 1 korban viral dengan **18.9 juta views**, memicu kemarahan publik dan tuntutan penangkapan pelaku.',
      problem: `**Pelaku masih buron** sejak kejadian 19 Oktober 2025 malam meskipun wajah terekam jelas CCTV
**Koordinasi antar polsek** yang lambat menyebabkan pelaku sempat lolos ke Bekasi
**Minimnya patroli** di area permukiman meskipun sudah 3 kali terjadi penjambretan dalam sebulan`,
      suggestion: 'Bentuk **tim khusus pemburu pelaku** dengan reward Rp 50 juta untuk informasi yang membawa penangkapan. Tingkatkan **patroli 24/7** di Kelapa Gading dengan minimum 5 unit mobil patroli. Pasang **100 CCTV tambahan** di titik-titik buta dan sambungkan ke command center.',
      urgency_score: 94
    }
  ]
};

export const allEnhancedData = {
  news: enhancedNewsArticles,
  tiktok: enhancedTikTokPosts,
  chatLogs: enhancedChatLogs,
  statistics: enhancedStatistics,
  trending: enhancedTrendingTopics,
  tiktokTrending: enhancedTikTokTrending,
  crisisTimeline: enhancedCrisisTimeline,
  executiveSummary: enhancedExecutiveSummary,
  problemSolutions: enhancedProblemSolutions,
  keywordsCloud: enhancedKeywordsCloud,
  newsInsights: enhancedNewsInsights,
  tiktokInsights: enhancedTikTokInsights,
};