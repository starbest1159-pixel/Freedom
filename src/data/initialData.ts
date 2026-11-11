import { Movie, User, Category, Genre, Banner, FAQItem, SeoConfig, VideoAd, SiteSettings, LiveStream } from '../types';

// Content is intentionally empty until the site owner adds or imports real records.
export const INITIAL_USERS: User[] = [];
export const INITIAL_MOVIES: Movie[] = [];
export const INITIAL_CATEGORIES: Category[] = [];
export const INITIAL_GENRES: Genre[] = [];
export const INITIAL_BANNERS: Banner[] = [];
export const INITIAL_FAQS: FAQItem[] = [];
export const INITIAL_VIDEO_ADS: VideoAd[] = [];
export const INITIAL_LIVE_STREAMS: LiveStream[] = [];

// Site owner must configure production metadata and integrations.
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
  allowGuestPreview: false,
};
