export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  password?: string;
  loginTime?: string;
}

export type MovieQuality = '4K' | 'FHD' | 'HD' | 'CAM';
export type MovieStatus = 'active' | 'draft' | 'archived';

export interface Movie {
  id: string;
  code: string; // e.g. "#584", "#1287"
  title: string;
  titleEn?: string;
  year: number;
  rating: number; // e.g. 6.9, 7.6
  poster: string;
  backdrop?: string;
  category: string;
  genres: string[];
  quality: MovieQuality;
  status: MovieStatus;
  duration?: string; // e.g. "124 นาที"
  views?: number;
  description: string;
  trailerUrl?: string;
  streamUrl?: string;
  director?: string;
  cast?: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  icon?: string;
  description?: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  movieId?: string;
  imageUrl: string;
  badgeText?: string;
  actionUrl?: string;
  active: boolean;
  order: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  canonicalUrl: string;
  googleAnalyticsId: string;
}

export interface VideoAd {
  id: string;
  title: string;
  sponsorName: string;
  videoUrl: string;
  targetUrl: string;
  skipAfterSeconds: number;
  placement: 'pre-roll' | 'mid-roll' | 'banner';
  active: boolean;
  impressions: number;
  clicks: number;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  logoText: string;
  supportEmail: string;
  maintenanceMode: boolean;
  autoSyncApi: boolean;
  apiProvider: string;
  apiKey: string;
  copyrightText: string;
  allowGuestPreview: boolean;
}

export interface StreamServer {
  id: string;
  name: string;
  quality: string; // e.g. "4K UHD", "1080p 60FPS", "720p HD", "สำรอง 1"
  url: string;
  bitrate?: string;
  isBackup?: boolean;
}

export type LiveMatchStatus = 'live' | 'upcoming' | 'ended';

export interface LiveStream {
  id: string;
  code: string; // e.g. "#LIVE-PL01"
  title: string; // e.g. "พรีเมียร์ลีก: ลิเวอร์พูล พบ แมนเชสเตอร์ ซิตี้"
  league: string; // e.g. "พรีเมียร์ลีก อังกฤษ", "ยูฟ่า แชมเปียนส์ลีก", "ลาลีกา สเปน", "ไทยลีก"
  category: 'football' | 'boxing' | 'motorsport' | 'basketball' | 'tv-channel' | 'special';
  status: LiveMatchStatus;
  homeTeam: {
    name: string;
    logo: string;
    score?: number;
    color?: string;
  };
  awayTeam: {
    name: string;
    logo: string;
    score?: number;
    color?: string;
  };
  matchTime: string; // e.g. "20:00 น."
  matchDate: string; // e.g. "วันนี้ 29 มี.ค. 2026"
  stadium?: string; // e.g. "แอนฟิลด์ (Anfield)"
  competitionRound?: string; // e.g. "แมตช์เดย์ 28"
  currentMinute?: string; // e.g. "76'", "พักครึ่ง", "ยังไม่เริ่ม"
  streamServers: StreamServer[];
  currentViewers: number; // e.g. 182500
  thumbnail: string;
  backdrop?: string;
  resolution: string; // e.g. "4K UHD 60FPS"
  commentary: string; // e.g. "พากย์ไทย (True Premier)", "English", "บรรยายสด"
  channelName?: string; // e.g. "True Premier Football HD 1"
  pinned?: boolean;
  featured?: boolean;
  chatEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LiveNotification {
  id: string;
  streamId: string;
  title: string;
  message: string;
  targetAudience?: 'all' | 'vip' | 'followers';
  audience?: 'all' | 'vip' | 'followers';
  badge?: string;
  sound?: boolean;
  channels:
    | {
        pushNotification: boolean;
        inAppBanner: boolean;
        soundAlert: boolean;
      }
    | string[];
  sentAt: string;
  recipientCount?: number;
  deliveredCount?: number;
  status?: 'sent' | 'scheduled';
}

export type AdminMenuTab =
  | 'movies'
  | 'add-movie'
  | 'live-streams'
  | 'categories'
  | 'genres'
  | 'header-menu'
  | 'footer-menu'
  | 'faqs'
  | 'seo'
  | 'video-ads'
  | 'banner-templates'
  | 'home-banners'
  | 'users'
  | 'settings'
  | 'media-library';
