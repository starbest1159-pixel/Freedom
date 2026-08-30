export type Language = 'th' | 'en';

export interface Translations {
  // Navigation & Menu
  nav: {
    dashboard: string;
    movies: string;
    addMovie: string;
    liveStreams: string;
    categories: string;
    genres: string;
    headerMenu: string;
    footerMenu: string;
    faqs: string;
    seo: string;
    videoAds: string;
    bannerTemplates: string;
    homeBanners: string;
    users: string;
    settings: string;
    mediaLibrary: string;
    logout: string;
    adminRole: string;
    staffRole: string;
    expandSidebar: string;
    collapseSidebar: string;
  };

  sidebar: {
    movies: string;
    categories: string;
    genres: string;
    homeBanners: string;
    bannerTemplates: string;
    users: string;
    settings: string;
    seo: string;
    faqs: string;
    videoAds: string;
    headerMenu: string;
    footerMenu: string;
    mediaLibrary: string;
    liveStreams: string;
    logout: string;
  };

  // Header / Topbar
  header: {
    previewSite: string;
    previewSiteShort: string;
    searchPlaceholder: string;
    notifications: string;
    liveMatchesActive: string;
    systemOnline: string;
    welcomeBack: string;
    switchLanguage: string;
  };

  // Common UI words
  common: {
    save: string;
    saved: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    create: string;
    update: string;
    close: string;
    back: string;
    search: string;
    filter: string;
    sort: string;
    actions: string;
    status: string;
    active: string;
    inactive: string;
    draft: string;
    archived: string;
    loading: string;
    success: string;
    error: string;
    confirm: string;
    total: string;
    items: string;
    all: string;
    yes: string;
    no: string;
    viewDetails: string;
    playNow: string;
    copyLink: string;
    copied: string;
    refresh: string;
    select: string;
    selectAll: string;
    deselectAll: string;
    noData: string;
    minutes: string;
    views: string;
    rating: string;
    year: string;
    quality: string;
    category: string;
    genres: string;
    director: string;
    cast: string;
    resolution: string;
    server: string;
    backup: string;
    demoNote: string;
  };

  // Delete Confirmation Modal
  deleteConfirm: {
    title: string;
    desc: string;
    confirm: string;
    cancel: string;
  };

  // Movies Management
  movies: {
    pageTitle: string;
    pageSubtitle: string;
    searchPlaceholder: string;
    syncApiBtn: string;
    addMovieBtn: string;
    sortBy: string;
    sortLatest: string;
    sortRatingHigh: string;
    sortYearNew: string;
    sortNameAZ: string;
    totalCount: string;
    viewGrid: string;
    viewTable: string;
    filterCategory: string;
    filterQuality: string;
    filterStatus: string;
    allCategories: string;
    allQualities: string;
    allStatuses: string;
    editMovie: string;
    deleteMovie: string;
    playMovie: string;
    deleteConfirmTitle: string;
    deleteConfirmDesc: string;
    deleteSuccess: string;
    saveSuccess: string;
    addSuccess: string;
    uxTitle: string;
    uxNote1: string;
    uxNote2: string;
    uxNote3: string;
    uxNote4: string;
    uxNote5: string;
    uxNote6: string;
    tableThumbnail: string;
    tableCode: string;
    tableTitle: string;
    tableYearRating: string;
    tableCategory: string;
    tableQuality: string;
    tableViews: string;
    tableStatus: string;
    tableActions: string;
  };

  // Movie Form Modal
  movieForm: {
    addTitle: string;
    editTitle: string;
    subtitle: string;
    tmdbTab: string;
    formTab: string;
    tmdbSearchPlaceholder: string;
    tmdbSearchBtn: string;
    tmdbQuickFill: string;
    title: string;
    titleTh: string;
    titleEn: string;
    code: string;
    year: string;
    rating: string;
    quality: string;
    status: string;
    category: string;
    genres: string;
    duration: string;
    views: string;
    director: string;
    cast: string;
    posterUrl: string;
    backdropUrl: string;
    streamUrl: string;
    trailerUrl: string;
    description: string;
    synopsis: string;
    featuredCheck: string;
    saveBtn: string;
    cancelBtn: string;
    fillFromTmdbNotice: string;
  };

  // Live Streams & Sports
  live: {
    pageTitle: string;
    pageSubtitle: string;
    addStreamBtn: string;
    sendNotifyBtn: string;
    liveNowTab: string;
    upcomingTab: string;
    endedTab: string;
    allMatchesTab: string;
    categoryFootball: string;
    categoryBoxing: string;
    categoryMotorsport: string;
    categoryBasketball: string;
    categoryTv: string;
    categorySpecial: string;
    filterLeague: string;
    viewersCount: string;
    matchTime: string;
    matchDate: string;
    stadium: string;
    commentary: string;
    streamServers: string;
    watchLive: string;
    updateScore: string;
    editStream: string;
    deleteStream: string;
    pinned: string;
    currentMinute: string;
    sendBroadcastSuccess: string;
    playerTitle: string;
    liveChat: string;
    sendChatPlaceholder: string;
    streamServer1: string;
    streamServer2: string;
    streamServer3: string;
    switchServer: string;
    statsLive: string;
  };

  liveStream: {
    title: string;
    subtitle: string;
    liveNowMatches: string;
    liveViewersRealtime: string;
    streamingServers: string;
    serversOnline: string;
    notifyUsers: string;
    addLiveStream: string;
    searchPlaceholder: string;
    allLeagues: string;
    viewModeGrid: string;
    viewModeTable: string;
  };

  // API Sync Modal
  apiSync: {
    title: string;
    description: string;
    tabBrowse: string;
    tabSearch: string;
    tabAuth: string;
    nowPlaying: string;
    popular: string;
    topRated: string;
    upcoming: string;
    selectAll: string;
    selectPrompt: string;
    testKey: string;
  };

  // TMDB Sync Modal
  tmdb: {
    modalTitle: string;
    modalSubtitle: string;
    tabLiveFeeds: string;
    tabSearch: string;
    tabSettings: string;
    feedNowPlaying: string;
    feedPopular: string;
    feedTopRated: string;
    feedUpcoming: string;
    searchPlaceholder: string;
    searchBtn: string;
    importSelected: string;
    selectAll: string;
    deselectAll: string;
    apiKeyLabel: string;
    testKeyBtn: string;
    validKey: string;
    invalidKey: string;
    importSuccess: string;
    openApiSpecs: string;
  };

  // Website Preview & Cinema
  preview: {
    modalTitle: string;
    openNewTab: string;
    closePreview: string;
    navHome: string;
    navMovies: string;
    navSeries: string;
    navLiveSports: string;
    navPopular: string;
    heroWatchNow: string;
    heroMoreInfo: string;
    featuredMovies: string;
    liveSportsTitle: string;
    allMoviesTitle: string;
    searchInCatalog: string;
    playerCinemaTitle: string;
    theaterMode: string;
    audioTrack: string;
    audioTh: string;
    audioEn: string;
    subtitleTrack: string;
    subTh: string;
    subEn: string;
    subNone: string;
    servers: string;
    synopsis: string;
    castAndCrew: string;
    relatedMovies: string;
    userReviews: string;
    footerCopyright: string;
  };

  // Categories & Genres
  categories: {
    pageTitle: string;
    pageSubtitle: string;
    tabCategories: string;
    tabGenres: string;
    addCategoryBtn: string;
    addGenreBtn: string;
    categoryName: string;
    slug: string;
    movieCount: string;
    genreName: string;
    genreColor: string;
  };

  // Users Management
  users: {
    pageTitle: string;
    pageSubtitle: string;
    addUserBtn: string;
    username: string;
    fullName: string;
    email: string;
    role: string;
    roleAdmin: string;
    roleStaff: string;
    lastLogin: string;
    actions: string;
    editUser: string;
    deleteUser: string;
  };

  // Banners Management
  banners: {
    pageTitle: string;
    pageSubtitle: string;
    addBannerBtn: string;
    bannerTitle: string;
    bannerSubtitle: string;
    subtitle: string;
    badgeText: string;
    imageUrl: string;
    order: string;
    preview: string;
    activeStatus: string;
  };

  // Settings
  settings: {
    title: string;
    subtitle: string;
    pageTitle: string;
    pageSubtitle: string;
    tabGeneral: string;
    tabTmdb: string;
    tabSeo: string;
    tabFaqs: string;
    tabFaq: string;
    tabAds: string;
    tabMenus: string;
    siteName: string;
    siteTagline: string;
    tagline: string;
    supportEmail: string;
    tmdbApiKey: string;
    tmdbLiveStatus: string;
    validateKeyBtn: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    addFaqBtn: string;
    maintenanceMode: string;
    savedSuccess: string;
  };

  // Media Library
  media: {
    pageTitle: string;
    pageSubtitle: string;
    uploadBtn: string;
    searchMedia: string;
    filterAll: string;
    filterPosters: string;
    filterBackdrops: string;
    filterBanners: string;
    totalAssets: string;
    copyUrl: string;
  };

  // Login View
  login: {
    brandTitle: string;
    brandSubtitle: string;
    usernameLabel: string;
    passwordLabel: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    rememberMe: string;
    signInBtn: string;
    quickLoginTitle: string;
    quickAdmin: string;
    quickStaff: string;
    errorMessage: string;
    footerText: string;
  };
}

export const translations: Record<Language, Translations> = {
  th: {
    nav: {
      dashboard: 'แดชบอร์ด',
      movies: 'จัดการภาพยนตร์',
      addMovie: 'เพิ่มภาพยนตร์',
      liveStreams: 'ถ่ายทอดสด & บอลสด',
      categories: 'หมวดหมู่ภาพยนตร์',
      genres: 'ประเภทภาพยนตร์',
      headerMenu: 'เมนูส่วนหัว',
      footerMenu: 'เมนูส่วนท้าย',
      faqs: 'คำถามที่พบบ่อย',
      seo: 'เนื้อหา SEO',
      videoAds: 'วิดีโอโฆษณา',
      bannerTemplates: 'เทมเพลตแบนเนอร์',
      homeBanners: 'แบนเนอร์หน้าหลัก',
      users: 'ผู้ใช้งาน',
      settings: 'ตั้งค่าเว็บไซต์',
      mediaLibrary: 'จัดการรูปภาพ',
      logout: 'ออกจากระบบ',
      adminRole: 'ผู้ดูแลระบบสูงสุด',
      staffRole: 'เจ้าหน้าที่',
      expandSidebar: 'ขยายเมนู',
      collapseSidebar: 'ย่อเมนู',
    },
    sidebar: {
      movies: 'จัดการภาพยนตร์',
      categories: 'หมวดหมู่ภาพยนตร์',
      genres: 'ประเภทภาพยนตร์',
      homeBanners: 'แบนเนอร์หน้าหลัก',
      bannerTemplates: 'เทมเพลตแบนเนอร์',
      users: 'ผู้ใช้งานระบบ',
      settings: 'ตั้งค่าเว็บไซต์',
      seo: 'เนื้อหา SEO',
      faqs: 'คำถามที่พบบ่อย',
      videoAds: 'วิดีโอโฆษณา',
      headerMenu: 'เมนูส่วนหัว',
      footerMenu: 'เมนูส่วนท้าย',
      mediaLibrary: 'จัดการรูปภาพ',
      liveStreams: 'ถ่ายทอดสด & สตรีมมิ่ง',
      logout: 'ออกจากระบบ',
    },
    header: {
      previewSite: 'ดูตัวอย่างหน้าเว็บ',
      previewSiteShort: 'ดูหน้าเว็บ',
      searchPlaceholder: 'ค้นหาเมนูหรือภาพยนตร์...',
      notifications: 'การแจ้งเตือน',
      liveMatchesActive: 'คู่กำลังถ่ายทอดสด',
      systemOnline: 'ระบบออนไลน์ปกติ',
      welcomeBack: 'ยินดีต้อนรับ',
      switchLanguage: 'เปลี่ยนภาษา / Language',
    },
    common: {
      save: 'บันทึกข้อมูล',
      saved: 'บันทึกเรียบร้อยแล้ว',
      cancel: 'ยกเลิก',
      delete: 'ลบ',
      edit: 'แก้ไข',
      add: 'เพิ่ม',
      create: 'สร้างใหม่',
      update: 'อัปเดต',
      close: 'ปิด',
      back: 'ย้อนกลับ',
      search: 'ค้นหา',
      filter: 'ตัวกรอง',
      sort: 'เรียงลำดับ',
      actions: 'จัดการ',
      status: 'สถานะ',
      active: 'เปิดใช้งาน',
      inactive: 'ปิดใช้งาน',
      draft: 'แบบร่าง',
      archived: 'จัดเก็บ',
      loading: 'กำลังโหลด...',
      success: 'สำเร็จ',
      error: 'เกิดข้อผิดพลาด',
      confirm: 'ยืนยัน',
      total: 'ทั้งหมด',
      items: 'รายการ',
      all: 'ทั้งหมด',
      yes: 'ใช่',
      no: 'ไม่ใช่',
      viewDetails: 'ดูรายละเอียด',
      playNow: 'เล่นภาพยนตร์',
      copyLink: 'คัดลอกลิงก์',
      copied: 'คัดลอกแล้ว!',
      refresh: 'รีเฟรช',
      select: 'เลือก',
      selectAll: 'เลือกทั้งหมด',
      deselectAll: 'ยกเลิกเลือก',
      noData: 'ไม่พบข้อมูลที่ตรงกับเงื่อนไข',
      minutes: 'นาที',
      views: 'ครั้ง',
      rating: 'คะแนน',
      year: 'ปีที่ฉาย',
      quality: 'ความละเอียด',
      category: 'หมวดหมู่',
      genres: 'ประเภท',
      director: 'ผู้กำกับ',
      cast: 'นักแสดง',
      resolution: 'ความละเอียดภาพ',
      server: 'เซิร์ฟเวอร์',
      backup: 'สำรอง',
      demoNote: 'ระบบจำลองการทำงานจริง',
    },
    deleteConfirm: {
      title: 'ยืนยันการลบภาพยนตร์',
      desc: 'คุณต้องการลบภาพยนตร์เรื่องนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้',
      confirm: 'ลบภาพยนตร์',
      cancel: 'ยกเลิก',
    },
    movies: {
      pageTitle: 'จัดการภาพยนตร์',
      pageSubtitle: 'จัดการรายการภาพยนตร์, สตรีมมิ่ง, ลิงก์รับชม และอัปเดตผ่าน TMDB API',
      searchPlaceholder: 'ค้นหาภาพยนตร์...',
      syncApiBtn: 'อัปเดตภาพยนตร์ผ่าน API',
      addMovieBtn: 'เพิ่มภาพยนตร์',
      sortBy: 'เรียงตาม:',
      sortLatest: 'ล่าสุด',
      sortRatingHigh: 'เรตติ้ง สูงสุด-ต่ำสุด',
      sortYearNew: 'ปี ล่าสุด-เก่าสุด',
      sortNameAZ: 'ชื่อ A-Z',
      totalCount: 'ทั้งหมด {count} เรื่อง',
      viewGrid: 'มุมมองการ์ด',
      viewTable: 'มุมมองตาราง',
      filterCategory: 'หมวดหมู่ทั้งหมด',
      filterQuality: 'ความคมชัดทั้งหมด',
      filterStatus: 'สถานะทั้งหมด',
      allCategories: 'ทุกหมวดหมู่',
      allQualities: 'ทุกความละเอียด',
      allStatuses: 'ทุกสถานะ',
      editMovie: 'แก้ไข',
      deleteMovie: 'ลบ',
      playMovie: 'เล่นหนัง',
      deleteConfirmTitle: 'ยืนยันการลบภาพยนตร์',
      deleteConfirmDesc: 'คุณต้องการลบภาพยนตร์ "{title}" ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้',
      deleteSuccess: 'ลบภาพยนตร์เรียบร้อยแล้ว',
      saveSuccess: 'บันทึกข้อมูลภาพยนตร์เรียบร้อยแล้ว',
      addSuccess: 'เพิ่มภาพยนตร์ใหม่เรียบร้อยแล้ว',
      uxTitle: 'ปรับปรุงตามข้อเสนอแนะ UX Writing แล้ว',
      uxNote1: '• "อัพเดท" → แก้เป็น "อัปเดต" (สะกดถูกต้องตามราชบัณฑิตฯ)',
      uxNote2: '• "เพิ่มหนังใหม่" → แก้เป็น "เพิ่มภาพยนตร์" (ลดความซ้ำซ้อน)',
      uxNote3: '• "ค้นหาหนัง.." → แก้เป็น "ค้นหาภาพยนตร์..." (ชัดเจน ไม่ซ้ำจุด)',
      uxNote4: '• "ดูหน้าเว็บ" → แก้เป็น "ดูตัวอย่างหน้าเว็บ" (สื่อความหมายชัดเจนขึ้น)',
      uxNote5: '• ใช้คำว่า "ภาพยนตร์" ในส่วนแอดมิน เพื่อความเป็นทางการและสม่ำเสมอ',
      uxNote6: '• จำนวนมีตัวคั่นหลักพัน: 1,605 — อ่านง่ายขึ้น',
      tableThumbnail: 'โปสเตอร์',
      tableCode: 'รหัส',
      tableTitle: 'ชื่อภาพยนตร์',
      tableYearRating: 'ปี / เรตติ้ง',
      tableCategory: 'หมวดหมู่',
      tableQuality: 'ความละเอียด',
      tableViews: 'ยอดรับชม',
      tableStatus: 'สถานะ',
      tableActions: 'การจัดการ',
    },
    movieForm: {
      addTitle: 'เพิ่มภาพยนตร์ใหม่',
      editTitle: 'แก้ไขข้อมูลภาพยนตร์',
      subtitle: 'กรอกข้อมูลรายละเอียด ลิงก์สตรีม และโปสเตอร์ภาพยนตร์',
      tmdbTab: 'ดึงข้อมูลจาก TMDB',
      formTab: 'กรอกข้อมูลทั่วไป',
      tmdbSearchPlaceholder: 'พิมพ์ชื่อภาพยนตร์หรือรหัส TMDB ID (เช่น Joy, 1072790)...',
      tmdbSearchBtn: 'ค้นหา TMDB',
      tmdbQuickFill: 'ดึงข้อมูลลงฟอร์ม',
      title: 'ชื่อภาพยนตร์',
      titleTh: 'ชื่อภาพยนตร์ (ภาษาไทย)',
      titleEn: 'ชื่อภาพยนตร์ (ภาษาอังกฤษ / Original Title)',
      code: 'รหัสภาพยนตร์ (เช่น #1288)',
      year: 'ปีที่ฉาย (Year)',
      rating: 'คะแนนเรตติ้ง (0 - 10)',
      quality: 'คุณภาพวิดีโอ',
      status: 'สถานะการเผยแพร่',
      category: 'หมวดหมู่หลัก',
      genres: 'ประเภทภาพยนตร์ (เลือกได้หลายประเภท)',
      duration: 'ความยาว (เช่น 124 นาที)',
      views: 'ยอดการรับชมเริ่มต้น',
      director: 'ผู้กำกับ',
      cast: 'นักแสดงนำ (คั่นด้วยจุลภาค)',
      posterUrl: 'ลิงก์รูปโปสเตอร์ (URL)',
      backdropUrl: 'ลิงก์รูปภาพพื้นหลังแนวนอน (URL)',
      streamUrl: 'ลิงก์สตรีมวิดีโอ (Stream / HLS / MP4 / Embed)',
      trailerUrl: 'ลิงก์ตัวอย่างภาพยนตร์ (YouTube / Embed)',
      description: 'เรื่องย่อ / คำอธิบายภาพยนตร์',
      synopsis: 'เรื่องย่อ / คำอธิบายภาพยนตร์',
      featuredCheck: 'ปักหมุดเป็นภาพยนตร์แนะนำ (Featured Spotlight)',
      saveBtn: 'บันทึกข้อมูลภาพยนตร์',
      cancelBtn: 'ยกเลิก',
      fillFromTmdbNotice: 'ดึงข้อมูลจาก TMDB สำเร็จแล้ว! คุณสามารถปรับแต่งรายละเอียดเพิ่มเติมก่อนบันทึกได้',
    },
    live: {
      pageTitle: 'จัดการถ่ายทอดสด & ฟุตบอลสด (Live Streaming)',
      pageSubtitle: 'ควบคุมสัญญาณสตรีมมิ่ง สกอร์สดบิ๊กแมตช์ เซิร์ฟเวอร์สำรอง และระบบแจ้งเตือนแบบเรียลไทม์',
      addStreamBtn: 'เพิ่มถ่ายทอดสดใหม่',
      sendNotifyBtn: 'ส่งแจ้งเตือนถ่ายทอดสด',
      liveNowTab: 'ถ่ายทอดสดตอนนี้',
      upcomingTab: 'โปรแกรมล่วงหน้า',
      endedTab: 'จบการแข่งขัน',
      allMatchesTab: 'ทั้งหมด',
      categoryFootball: 'ฟุตบอล',
      categoryBoxing: 'มวยสากล/ไทย',
      categoryMotorsport: 'มอเตอร์สปอร์ต',
      categoryBasketball: 'บาสเกตบอล',
      categoryTv: 'ช่องทีวีสด',
      categorySpecial: 'กิจกรรมพิเศษ',
      filterLeague: 'ทุกลีก / รายการแข่งขัน',
      viewersCount: 'ผู้ชมสด',
      matchTime: 'เวลาแข่งขัน',
      matchDate: 'วันที่',
      stadium: 'สนามแข่งขัน',
      commentary: 'ทีมพากย์',
      streamServers: 'เซิร์ฟเวอร์สตรีม',
      watchLive: 'รับชมสด (Live Player)',
      updateScore: 'อัปเดตสกอร์',
      editStream: 'แก้ไข',
      deleteStream: 'ลบ',
      pinned: 'ปักหมุดแมตช์เด่น',
      currentMinute: 'นาทีปัจจุบัน',
      sendBroadcastSuccess: 'ส่งการแจ้งเตือนสดไปยังผู้ใช้งานเรียบร้อยแล้ว',
      playerTitle: 'เครื่องเล่นถ่ายทอดสด (Live Cinema Player)',
      liveChat: 'แชทสดระหว่างรับชม',
      sendChatPlaceholder: 'พิมพ์ข้อความแชทสด...',
      streamServer1: 'เซิร์ฟเวอร์หลัก (4K UHD 60FPS)',
      streamServer2: 'เซิร์ฟเวอร์สำรอง 1 (FHD 1080p)',
      streamServer3: 'เซิร์ฟเวอร์สำรอง 2 (HD 720p)',
      switchServer: 'สลับเซิร์ฟเวอร์สัญญาณ',
      statsLive: 'สถิติการรับชมสด',
    },
    liveStream: {
      title: 'จัดการถ่ายทอดสด & ฟุตบอลสด',
      subtitle: 'ควบคุมสัญญาณสตรีมมิ่ง สกอร์สด และระบบแจ้งเตือน',
      liveNowMatches: 'คู่กำลังถ่ายทอดสด',
      liveViewersRealtime: 'ผู้ชมสดเรียลไทม์',
      streamingServers: 'เซิร์ฟเวอร์สตรีมมิ่ง',
      serversOnline: 'ออนไลน์ 100%',
      notifyUsers: 'ส่งแจ้งเตือนถ่ายทอดสด',
      addLiveStream: 'เพิ่มถ่ายทอดสดใหม่',
      searchPlaceholder: 'ค้นหาคู่แข่งขัน, ลีก, หรือทีม...',
      allLeagues: 'ทุกลีก / รายการแข่งขัน',
      viewModeGrid: 'มุมมองการ์ด',
      viewModeTable: 'มุมมองตาราง',
    },
    apiSync: {
      title: 'อัปเดตภาพยนตร์ผ่าน TMDB OpenAPI',
      description: 'ซิงค์ข้อมูลภาพยนตร์จาก OpenAPI 3.1.0 ดึงโปสเตอร์ เรตติ้ง และเรื่องย่ออย่างแม่นยำ',
      tabBrowse: 'เลือกดูฟีดภาพยนตร์',
      tabSearch: 'ค้นหาภาพยนตร์',
      tabAuth: 'ตรวจสอบสิทธิ์ API Key',
      nowPlaying: 'กำลังฉายในโรงภาพยนตร์',
      popular: 'ยอดนิยมประจำสัปดาห์',
      topRated: 'เรตติ้งสูงสุดตลอดกาล',
      upcoming: 'กำลังจะเข้าฉายเร็วๆ นี้',
      selectAll: 'เลือกทั้งหมด',
      selectPrompt: 'เลือกภาพยนตร์ที่ต้องการนำเข้าสู่ระบบ',
      testKey: 'ตรวจสอบ API Key',
    },
    tmdb: {
      modalTitle: 'อัปเดตภาพยนตร์ผ่าน TMDB API (The Movie Database)',
      modalSubtitle: 'ซิงค์ข้อมูลภาพยนตร์จาก OpenAPI 3.1.0 ดึงโปสเตอร์ เรตติ้ง และเรื่องย่ออย่างแม่นยำ',
      tabLiveFeeds: 'ฟีดภาพยนตร์ (Live Feeds)',
      tabSearch: 'ค้นหาจาก TMDB (Search)',
      tabSettings: 'ตั้งค่าและทดสอบ API Key',
      feedNowPlaying: 'กำลังฉายในโรงภาพยนตร์ (Now Playing)',
      feedPopular: 'ยอดนิยมประจำสัปดาห์ (Popular)',
      feedTopRated: 'เรตติ้งสูงสุดตลอดกาล (Top Rated)',
      feedUpcoming: 'กำลังจะเข้าฉายเร็วๆ นี้ (Upcoming)',
      searchPlaceholder: 'พิมพ์ชื่อภาพยนตร์ภาษาไทยหรืออังกฤษ...',
      searchBtn: 'ค้นหา TMDB',
      importSelected: 'นำเข้าภาพยนตร์ที่เลือก ({count} เรื่อง)',
      selectAll: 'เลือกทั้งหมดในหน้านี้',
      deselectAll: 'ยกเลิกการเลือก',
      apiKeyLabel: 'TMDB API Key (v3) หรือ Read Access Token (v4 Bearer)',
      testKeyBtn: 'ทดสอบสิทธิ์ (/3/authentication)',
      validKey: 'API Key ถูกต้องและพร้อมใช้งาน',
      invalidKey: 'API Key ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
      importSuccess: 'นำเข้าภาพยนตร์สำเร็จ {count} เรื่อง!',
      openApiSpecs: 'OpenAPI 3.1.0 Endpoints Map',
    },
    preview: {
      modalTitle: 'ตัวอย่างหน้าเว็บไซต์ผู้ใช้งาน (Live Website Preview)',
      openNewTab: 'เปิดในแท็บใหม่',
      closePreview: 'ปิดตัวอย่าง',
      navHome: 'หน้าแรก',
      navMovies: 'ภาพยนตร์ทั้งหมด',
      navSeries: 'ซีรีส์ & หนังชุด',
      navLiveSports: 'ถ่ายทอดสดกีฬา',
      navPopular: 'มาใหม่ & ยอดฮิต',
      heroWatchNow: 'รับชมภาพยนตร์',
      heroMoreInfo: 'รายละเอียดเพิ่มเติม',
      featuredMovies: 'ภาพยนตร์แนะนำประจำสัปดาห์',
      liveSportsTitle: 'ถ่ายทอดสดกีฬา & บอลสดวันนี้',
      allMoviesTitle: 'แคตตาล็อกภาพยนตร์ทั้งหมด',
      searchInCatalog: 'ค้นหาชื่อภาพยนตร์, นักแสดง, ผู้กำกับ...',
      playerCinemaTitle: 'โรงภาพยนตร์ส่วนตัว (Theater Cinema Mode)',
      theaterMode: 'โหมดโรงภาพยนตร์',
      audioTrack: 'ระบบเสียง:',
      audioTh: 'พากย์ไทย (TH Audio)',
      audioEn: 'ต้นฉบับอังกฤษ (EN 5.1 Surround)',
      subtitleTrack: 'คำบรรยาย:',
      subTh: 'ซับไทย (Thai Subtitles)',
      subEn: 'ซับอังกฤษ (English Subtitles)',
      subNone: 'ปิดคำบรรยาย',
      servers: 'เลือกสัญญาณรับชม:',
      synopsis: 'เรื่องย่อ / Synopsis',
      castAndCrew: 'นักแสดงและทีมผู้สร้าง',
      relatedMovies: 'ภาพยนตร์ที่คุณอาจจะชอบ',
      userReviews: 'รีวิวและความคิดเห็น',
      footerCopyright: 'สงวนลิขสิทธิ์ © 2026 FREEDOM. ระบบจัดการภาพยนตร์และสตรีมมิ่งระดับมืออาชีพ',
    },
    categories: {
      pageTitle: 'หมวดหมู่และประเภทภาพยนตร์',
      pageSubtitle: 'จัดการหมวดหมู่หลักและแท็กประเภทภาพยนตร์ในระบบ',
      tabCategories: 'หมวดหมู่หลัก (Categories)',
      tabGenres: 'ประเภทภาพยนตร์ (Genres)',
      addCategoryBtn: 'เพิ่มหมวดหมู่',
      addGenreBtn: 'เพิ่มประเภท',
      categoryName: 'ชื่อหมวดหมู่',
      slug: 'Slug (URL)',
      movieCount: 'จำนวนภาพยนตร์',
      genreName: 'ชื่อประเภท',
      genreColor: 'สีประจำแท็ก',
    },
    users: {
      pageTitle: 'จัดการผู้ใช้งานและสิทธิ์ (Users & RBAC)',
      pageSubtitle: 'จัดการบัญชีผู้ดูแลระบบ เจ้าหน้าที่ และสิทธิ์การเข้าถึง',
      addUserBtn: 'เพิ่มผู้ใช้งาน',
      username: 'ชื่อผู้ใช้',
      fullName: 'ชื่อ-นามสกุล',
      email: 'อีเมล',
      role: 'สิทธิ์การใช้งาน',
      roleAdmin: 'ผู้ดูแลระบบ (Admin)',
      roleStaff: 'เจ้าหน้าที่ (Staff)',
      lastLogin: 'เข้าสู่ระบบล่าสุด',
      actions: 'จัดการ',
      editUser: 'แก้ไข',
      deleteUser: 'ลบ',
    },
    banners: {
      pageTitle: 'จัดการแบนเนอร์หน้าหลัก',
      pageSubtitle: 'ควบคุมสไลเดอร์และแบนเนอร์โปรโมทในหน้าแรกของเว็บไซต์',
      addBannerBtn: 'เพิ่มแบนเนอร์',
      bannerTitle: 'หัวข้อแบนเนอร์',
      bannerSubtitle: 'คำโปรยรอง',
      subtitle: 'คำโปรยรอง',
      badgeText: 'ป้ายกำกับ',
      imageUrl: 'ลิงก์รูปภาพ',
      order: 'ลำดับ',
      preview: 'ตัวอย่างภาพ',
      activeStatus: 'สถานะแสดงผล',
    },
    settings: {
      title: 'ตั้งค่าเว็บไซต์',
      subtitle: 'จัดการข้อมูลเว็บไซต์, TMDB API v3, SEO, และการแสดงผล',
      pageTitle: 'ตั้งค่าเว็บไซต์และระบบเสริม (Site Configuration)',
      pageSubtitle: 'จัดการข้อมูลเว็บไซต์, TMDB API v3, SEO, คำถามที่พบบ่อย และการแสดงผล',
      tabGeneral: 'ตั้งค่าเว็บไซต์',
      tabTmdb: 'TMDB API v3 & OpenAPI',
      tabSeo: 'เนื้อหา SEO',
      tabFaqs: 'คำถามที่พบบ่อย (FAQs)',
      tabFaq: 'คำถามที่พบบ่อย (FAQs)',
      tabAds: 'วิดีโอโฆษณา',
      tabMenus: 'เมนูส่วนหัว / ส่วนท้าย',
      siteName: 'ชื่อเว็บไซต์',
      siteTagline: 'สโลแกนเว็บไซต์',
      tagline: 'สโลแกนเว็บไซต์',
      supportEmail: 'อีเมลติดต่อสนับสนุน',
      tmdbApiKey: 'TMDB API Key',
      tmdbLiveStatus: 'สถานะการเชื่อมต่อกับ TMDB v3 API แบบสด',
      validateKeyBtn: 'ตรวจสอบ API Key',
      metaTitle: 'SEO Meta Title',
      metaDescription: 'SEO Meta Description',
      metaKeywords: 'SEO Meta Keywords',
      addFaqBtn: 'เพิ่มคำถามที่พบบ่อย',
      maintenanceMode: 'เปิดโหมดปิดปรับปรุงเว็บไซต์ (Maintenance Mode)',
      savedSuccess: 'บันทึกการตั้งค่าเรียบร้อยแล้ว',
    },
    media: {
      pageTitle: 'คลังรูปภาพและโปสเตอร์ (Media Library)',
      pageSubtitle: 'อัปโหลดและจัดการไฟล์โปสเตอร์ ภาพพื้นหลัง และแบนเนอร์',
      uploadBtn: 'อัปโหลดรูปภาพใหม่',
      searchMedia: 'ค้นหารูปภาพ...',
      filterAll: 'ทั้งหมด',
      filterPosters: 'โปสเตอร์ (Posters)',
      filterBackdrops: 'ภาพพื้นหลัง (Backdrops)',
      filterBanners: 'แบนเนอร์ (Banners)',
      totalAssets: 'ไฟล์สื่อทั้งหมด {count} ไฟล์',
      copyUrl: 'คัดลอก URL',
    },
    login: {
      brandTitle: 'FREEDOM ADMIN',
      brandSubtitle: 'ระบบจัดการภาพยนตร์และสตรีมมิ่งระดับมืออาชีพ',
      usernameLabel: 'ชื่อผู้ใช้งาน (Username)',
      passwordLabel: 'รหัสผ่าน (Password)',
      usernamePlaceholder: 'กรอกชื่อผู้ใช้ เช่น admin',
      passwordPlaceholder: 'กรอกรหัสผ่าน...',
      rememberMe: 'จดจำการเข้าสู่ระบบ',
      signInBtn: 'เข้าสู่ระบบ (Sign In)',
      quickLoginTitle: 'หรือคลิกเข้าสู่ระบบด่วนเพื่อทดสอบ:',
      quickAdmin: 'เข้าสู่ระบบในฐานะ Admin (สิทธิ์สูงสุด)',
      quickStaff: 'เข้าสู่ระบบในฐานะ Staff (สิทธิ์เจ้าหน้าที่)',
      errorMessage: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
      footerText: 'ระบบรักษาความปลอดภัยระดับสูง • เข้ารหัส SHA-256',
    },
  },

  en: {
    nav: {
      dashboard: 'Dashboard',
      movies: 'Manage Movies',
      addMovie: 'Add Movie',
      liveStreams: 'Live Streams & Sports',
      categories: 'Movie Categories',
      genres: 'Movie Genres',
      headerMenu: 'Header Menu',
      footerMenu: 'Footer Menu',
      faqs: 'FAQs',
      seo: 'SEO Content',
      videoAds: 'Video Ads',
      bannerTemplates: 'Banner Templates',
      homeBanners: 'Home Banners',
      users: 'Users & Roles',
      settings: 'Site Settings',
      mediaLibrary: 'Media Library',
      logout: 'Sign Out',
      adminRole: 'Super Admin',
      staffRole: 'Staff Member',
      expandSidebar: 'Expand Sidebar',
      collapseSidebar: 'Collapse Sidebar',
    },
    sidebar: {
      movies: 'Manage Movies',
      categories: 'Movie Categories',
      genres: 'Movie Genres',
      homeBanners: 'Home Banners',
      bannerTemplates: 'Banner Templates',
      users: 'System Users',
      settings: 'Site Settings',
      seo: 'SEO Content',
      faqs: 'FAQs',
      videoAds: 'Video Ads',
      headerMenu: 'Header Menu',
      footerMenu: 'Footer Menu',
      mediaLibrary: 'Media Library',
      liveStreams: 'Live Streaming',
      logout: 'Sign Out',
    },
    header: {
      previewSite: 'Live Website Preview',
      previewSiteShort: 'Preview',
      searchPlaceholder: 'Search menus or movies...',
      notifications: 'Notifications',
      liveMatchesActive: 'matches broadcasting live',
      systemOnline: 'System Online',
      welcomeBack: 'Welcome',
      switchLanguage: 'Language / ภาษา',
    },
    common: {
      save: 'Save Changes',
      saved: 'Changes Saved',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      create: 'Create',
      update: 'Update',
      close: 'Close',
      back: 'Back',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort by',
      actions: 'Actions',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      draft: 'Draft',
      archived: 'Archived',
      loading: 'Loading...',
      success: 'Success',
      error: 'An error occurred',
      confirm: 'Confirm',
      total: 'Total',
      items: 'items',
      all: 'All',
      yes: 'Yes',
      no: 'No',
      viewDetails: 'View Details',
      playNow: 'Play Movie',
      copyLink: 'Copy Link',
      copied: 'Copied!',
      refresh: 'Refresh',
      select: 'Select',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      noData: 'No matching items found',
      minutes: 'min',
      views: 'views',
      rating: 'Rating',
      year: 'Year',
      quality: 'Quality',
      category: 'Category',
      genres: 'Genres',
      director: 'Director',
      cast: 'Cast',
      resolution: 'Resolution',
      server: 'Server',
      backup: 'Backup',
      demoNote: 'Interactive Simulation Mode',
    },
    deleteConfirm: {
      title: 'Confirm Movie Deletion',
      desc: 'Are you sure you want to delete this movie? This action cannot be undone.',
      confirm: 'Delete Movie',
      cancel: 'Cancel',
    },
    movies: {
      pageTitle: 'Manage Movies',
      pageSubtitle: 'Manage film catalogs, streams, watch links, and live sync via TMDB API',
      searchPlaceholder: 'Search movies by title, code, director...',
      syncApiBtn: 'Sync via TMDB API',
      addMovieBtn: 'Add Movie',
      sortBy: 'Sort by:',
      sortLatest: 'Latest Added',
      sortRatingHigh: 'Rating (High - Low)',
      sortYearNew: 'Year (Newest - Oldest)',
      sortNameAZ: 'Title (A - Z)',
      totalCount: 'Total {count} titles',
      viewGrid: 'Grid View',
      viewTable: 'Table View',
      filterCategory: 'All Categories',
      filterQuality: 'All Qualities',
      filterStatus: 'All Statuses',
      allCategories: 'All Categories',
      allQualities: 'All Qualities',
      allStatuses: 'All Statuses',
      editMovie: 'Edit',
      deleteMovie: 'Delete',
      playMovie: 'Watch',
      deleteConfirmTitle: 'Confirm Movie Deletion',
      deleteConfirmDesc: 'Are you sure you want to delete "{title}"? This action cannot be undone.',
      deleteSuccess: 'Movie deleted successfully',
      saveSuccess: 'Movie details saved successfully',
      addSuccess: 'New movie added successfully',
      uxTitle: 'Improved according to UX Writing Guidelines',
      uxNote1: '• Standardized formal Thai and English terminology',
      uxNote2: '• Redundant labels minimized for sleek user experience',
      uxNote3: '• Clear placeholders with three dots for search clarity',
      uxNote4: '• "Preview" explicitly labeled as "Live Website Preview"',
      uxNote5: '• Consistent formal admin vocabulary across all views',
      uxNote6: '• Number formatting with thousand comma separators: 1,605',
      tableThumbnail: 'Poster',
      tableCode: 'Code',
      tableTitle: 'Title',
      tableYearRating: 'Year / Rating',
      tableCategory: 'Category',
      tableQuality: 'Quality',
      tableViews: 'Views',
      tableStatus: 'Status',
      tableActions: 'Actions',
    },
    movieForm: {
      addTitle: 'Add New Movie',
      editTitle: 'Edit Movie Information',
      subtitle: 'Fill in movie metadata, stream sources, and poster media URLs',
      tmdbTab: 'Fetch from TMDB',
      formTab: 'General Information',
      tmdbSearchPlaceholder: 'Search by title or TMDB ID (e.g. Joy, 1072790)...',
      tmdbSearchBtn: 'Search TMDB',
      tmdbQuickFill: 'Fill into Form',
      title: 'Movie Title',
      titleTh: 'Movie Title (Thai)',
      titleEn: 'Movie Title (English / Original)',
      code: 'Movie Code (e.g. #1288)',
      year: 'Release Year',
      rating: 'Rating Score (0 - 10)',
      quality: 'Video Quality',
      status: 'Publishing Status',
      category: 'Primary Category',
      genres: 'Movie Genres (Multi-select)',
      duration: 'Duration (e.g. 124 min)',
      views: 'Initial Views Count',
      director: 'Director',
      cast: 'Lead Cast (Comma separated)',
      posterUrl: 'Poster Image URL',
      backdropUrl: 'Backdrop Landscape Image URL',
      streamUrl: 'Video Stream Source (Stream / HLS / MP4 / Embed)',
      trailerUrl: 'Trailer Video URL (YouTube / Embed)',
      description: 'Synopsis / Description',
      synopsis: 'Synopsis / Description',
      featuredCheck: 'Feature in Spotlight Carousel',
      saveBtn: 'Save Movie Details',
      cancelBtn: 'Cancel',
      fillFromTmdbNotice: 'Data fetched from TMDB successfully! You may customize any fields before saving.',
    },
    live: {
      pageTitle: 'Live Streaming & Sports Management',
      pageSubtitle: 'Control live match feeds, real-time scores, multi-server routing, and push alerts',
      addStreamBtn: 'Add Live Stream',
      sendNotifyBtn: 'Send Live Alert',
      liveNowTab: 'Live Now',
      upcomingTab: 'Upcoming Fixtures',
      endedTab: 'Full Time',
      allMatchesTab: 'All Fixtures',
      categoryFootball: 'Football',
      categoryBoxing: 'Boxing / MMA',
      categoryMotorsport: 'Motorsport',
      categoryBasketball: 'Basketball',
      categoryTv: 'Live TV',
      categorySpecial: 'Special Events',
      filterLeague: 'All Leagues & Tournaments',
      viewersCount: 'Live Viewers',
      matchTime: 'Match Time',
      matchDate: 'Date',
      stadium: 'Venue / Stadium',
      commentary: 'Audio Commentary',
      streamServers: 'Stream Servers',
      watchLive: 'Watch Live (Cinema Player)',
      updateScore: 'Update Score',
      editStream: 'Edit',
      deleteStream: 'Delete',
      pinned: 'Featured Match',
      currentMinute: 'Current Time',
      sendBroadcastSuccess: 'Live push notification delivered to active viewers',
      playerTitle: 'Live Stadium Broadcast Player',
      liveChat: 'Live Stadium Chat',
      sendChatPlaceholder: 'Send a live cheer message...',
      streamServer1: 'Primary CDN (4K UHD 60FPS)',
      streamServer2: 'Backup Node 1 (FHD 1080p)',
      streamServer3: 'Backup Node 2 (HD 720p)',
      switchServer: 'Switch Stream CDN',
      statsLive: 'Live Audience Analytics',
    },
    liveStream: {
      title: 'Live Streaming & Match Management',
      subtitle: 'Manage live streams, score tickers, and viewers alerts',
      liveNowMatches: 'Live Now Matches',
      liveViewersRealtime: 'Live Viewers Real-time',
      streamingServers: 'Streaming CDNs',
      serversOnline: '100% Operational',
      notifyUsers: 'Notify Viewers',
      addLiveStream: 'Add Live Stream',
      searchPlaceholder: 'Search match, league, or team...',
      allLeagues: 'All Leagues & Tournaments',
      viewModeGrid: 'Grid View',
      viewModeTable: 'Table View',
    },
    apiSync: {
      title: 'Update Movies via TMDB OpenAPI',
      description: 'Synchronize international film catalogs and posters with OpenAPI 3.1.0',
      tabBrowse: 'Browse Movie Feeds',
      tabSearch: 'Search TMDB',
      tabAuth: 'API Key Authorization',
      nowPlaying: 'Now Playing in Theaters',
      popular: 'Weekly Popular Titles',
      topRated: 'Top Rated All-Time',
      upcoming: 'Upcoming Releases',
      selectAll: 'Select All',
      selectPrompt: 'Select movies you wish to import into the catalog',
      testKey: 'Test API Key',
    },
    tmdb: {
      modalTitle: 'Update Movies via The Movie Database (TMDB API v3)',
      modalSubtitle: 'Synchronize international film catalogs, high-resolution posters, and synopses with OpenAPI 3.1.0',
      tabLiveFeeds: 'Live Feeds',
      tabSearch: 'Search TMDB',
      tabSettings: 'API Key & Auth',
      feedNowPlaying: 'Now Playing in Theaters',
      feedPopular: 'Weekly Popular Titles',
      feedTopRated: 'Top Rated All-Time',
      feedUpcoming: 'Upcoming Releases',
      searchPlaceholder: 'Enter movie title in Thai or English...',
      searchBtn: 'Search TMDB',
      importSelected: 'Import Selected ({count} Movies)',
      selectAll: 'Select All on Page',
      deselectAll: 'Deselect All',
      apiKeyLabel: 'TMDB API Key (v3) or Read Access Token (v4 Bearer)',
      testKeyBtn: 'Test Auth (/3/authentication)',
      validKey: 'API Key is valid and authorized',
      invalidKey: 'Invalid API Key. Please verify in TMDB Developer portal.',
      importSuccess: 'Successfully imported {count} movies!',
      openApiSpecs: 'OpenAPI 3.1.0 Endpoints Map',
    },
    preview: {
      modalTitle: 'End-User Live Website Preview',
      openNewTab: 'Open in New Window',
      closePreview: 'Close Preview',
      navHome: 'Home',
      navMovies: 'Movies',
      navSeries: 'TV Series',
      navLiveSports: 'Live Sports',
      navPopular: 'Trending & New',
      heroWatchNow: 'Watch Movie',
      heroMoreInfo: 'More Details',
      featuredMovies: 'Featured Films of the Week',
      liveSportsTitle: 'Live Sports & Football Today',
      allMoviesTitle: 'Complete Movie Catalog',
      searchInCatalog: 'Search title, actor, director...',
      playerCinemaTitle: 'Private Theater Mode',
      theaterMode: 'Cinema Theater',
      audioTrack: 'Audio Track:',
      audioTh: 'Thai Dubbed (TH Audio)',
      audioEn: 'Original English (EN 5.1 Surround)',
      subtitleTrack: 'Subtitles:',
      subTh: 'Thai Subtitles',
      subEn: 'English Subtitles',
      subNone: 'Subtitles Off',
      servers: 'Select CDN Server:',
      synopsis: 'Synopsis & Storyline',
      castAndCrew: 'Cast & Creators',
      relatedMovies: 'Recommended for You',
      userReviews: 'Audience Reviews & Ratings',
      footerCopyright: 'Copyright © 2026 FREEDOM. All rights reserved.',
    },
    categories: {
      pageTitle: 'Movie Categories & Genres',
      pageSubtitle: 'Manage primary taxonomy and genre tags across the catalog',
      tabCategories: 'Primary Categories',
      tabGenres: 'Movie Genres',
      addCategoryBtn: 'Add Category',
      addGenreBtn: 'Add Genre',
      categoryName: 'Category Name',
      slug: 'Slug (URL)',
      movieCount: 'Movies Count',
      genreName: 'Genre Name',
      genreColor: 'Tag Color',
    },
    users: {
      pageTitle: 'Users & Access Control (RBAC)',
      pageSubtitle: 'Manage administrator accounts, staff privileges, and security',
      addUserBtn: 'Add New User',
      username: 'Username',
      fullName: 'Full Name',
      email: 'Email Address',
      role: 'System Role',
      roleAdmin: 'Super Admin',
      roleStaff: 'Staff Member',
      lastLogin: 'Last Login',
      actions: 'Actions',
      editUser: 'Edit',
      deleteUser: 'Delete',
    },
    banners: {
      pageTitle: 'Home Banners & Showcase',
      pageSubtitle: 'Configure homepage spotlights, hero carousel slides, and promotional campaigns',
      addBannerBtn: 'Add Banner',
      bannerTitle: 'Banner Title',
      bannerSubtitle: 'Sub-heading / Tagline',
      subtitle: 'Sub-heading / Tagline',
      badgeText: 'Badge Label',
      imageUrl: 'Image URL',
      order: 'Display Order',
      preview: 'Image Preview',
      activeStatus: 'Active Status',
    },
    settings: {
      title: 'Site Settings',
      subtitle: 'Manage website information, TMDB API v3, SEO, and display',
      pageTitle: 'Site Configuration & Integrations',
      pageSubtitle: 'Configure global metadata, TMDB API v3, SEO meta tags, FAQs, and advertisements',
      tabGeneral: 'General Settings',
      tabTmdb: 'TMDB API v3 & OpenAPI',
      tabSeo: 'SEO Meta Tags',
      tabFaqs: 'Frequently Asked Questions (FAQs)',
      tabFaq: 'Frequently Asked Questions (FAQs)',
      tabAds: 'Video Advertisements',
      tabMenus: 'Header & Footer Menus',
      siteName: 'Website Name',
      siteTagline: 'Website Tagline',
      tagline: 'Website Tagline',
      supportEmail: 'Support Email Address',
      tmdbApiKey: 'TMDB API Key',
      tmdbLiveStatus: 'Real-time TMDB v3 API Connection Status',
      validateKeyBtn: 'Validate API Key',
      metaTitle: 'SEO Meta Title',
      metaDescription: 'SEO Meta Description',
      metaKeywords: 'SEO Meta Keywords',
      addFaqBtn: 'Add FAQ Item',
      maintenanceMode: 'Enable Maintenance Mode',
      savedSuccess: 'Settings saved successfully',
    },
    media: {
      pageTitle: 'Media Library & Posters',
      pageSubtitle: 'Upload, organize, and manage posters, backdrops, and promotional banners',
      uploadBtn: 'Upload Media Asset',
      searchMedia: 'Search media files...',
      filterAll: 'All Assets',
      filterPosters: 'Posters',
      filterBackdrops: 'Backdrops',
      filterBanners: 'Banners',
      totalAssets: 'Total {count} media files',
      copyUrl: 'Copy URL',
    },
    login: {
      brandTitle: 'FREEDOM ADMIN',
      brandSubtitle: 'Professional Cinema & Live Streaming Management Platform',
      usernameLabel: 'Username',
      passwordLabel: 'Password',
      usernamePlaceholder: 'Enter username (e.g. admin)',
      passwordPlaceholder: 'Enter password...',
      rememberMe: 'Remember me on this device',
      signInBtn: 'Sign In to Dashboard',
      quickLoginTitle: 'Or one-click test credentials:',
      quickAdmin: 'Sign In as Super Admin',
      quickStaff: 'Sign In as Staff Member',
      errorMessage: 'Invalid username or password. Please try again.',
      footerText: 'High Security Standard • Encrypted SHA-256 Authentication',
    },
  },
};
