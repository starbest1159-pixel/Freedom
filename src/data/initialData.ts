import { Movie, User, Category, Genre, Banner, FAQItem, SeoConfig, VideoAd, SiteSettings, LiveStream } from '../types';

// Keep the local bootstrap accounts so the standalone admin UI remains accessible.
// Replace these with real authentication before deploying this application.
export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    username: 'admin',
    name: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
    role: 'admin',
    email: 'admin@freedom.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    password: 'Admin123',
  },
  {
    id: 'user-staff',
    username: 'staff',
    name: 'พนักงานดูแลเนื้อหา (Staff Editor)',
    role: 'staff',
    email: 'staff@freedom.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    password: 'Staff456',
  },
];

// Start content-management sections empty instead of loading sample records.
export const INITIAL_MOVIES: Movie[] = [];
export const INITIAL_CATEGORIES: Category[] = [];
export const INITIAL_GENRES: Genre[] = [];
export const INITIAL_BANNERS: Banner[] = [];
export const INITIAL_FAQS: FAQItem[] = [];
export const INITIAL_VIDEO_ADS: VideoAd[] = [];
export const INITIAL_LIVE_STREAMS: LiveStream[] = [];

// Blank SEO and API values are intentionally left for the site owner to configure.
export const INITIAL_SEO: SeoConfig = {
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  ogImage: '',
  canonicalUrl: '',
  googleAnalyticsId: '',
};

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'FREEDOM',
  siteTagline: '',
  logoText: 'FREEDOM',
  supportEmail: '',
  maintenanceMode: false,
  autoSyncApi: false,
  apiProvider: '',
  apiKey: '',
  copyrightText: '',
  allowGuestPreview: true,
};
