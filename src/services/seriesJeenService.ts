/**
 * Series Open API Service (https://api.seriesjeen.online)
 * Production client for Series Open API covering 57+ drama & streaming platforms (1,143 endpoints),
 * Thai-dubbed catalog, user quota management, OpenAPI 3.1.0 specification, and platform health telemetry.
 */

import { Movie } from '../types';

export const SERIES_JEEN_BASE_URL = 'https://api.seriesjeen.online';
export const OPENAPI_SPEC_URL = 'https://api.seriesjeen.online/openapi.json';
const STORAGE_KEY = 'seriesjeen_api_key';

export interface SeriesJeenHealth {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  uptime_seconds: number;
  db?: {
    connected: boolean;
    pool?: any;
  };
}

export interface PlatformHealthItem {
  platform_id: number;
  name: string;
  is_active: boolean;
  is_online: boolean;
  last_checked_at?: string;
  last_note?: string;
}

export interface PlatformsHealthResponse {
  platforms: PlatformHealthItem[];
}

export interface SeriesJeenUserProfile {
  user_id?: string | number;
  username?: string;
  email?: string;
  plan?: string;
  daily_quota?: number;
  quota_used?: number;
  quota_remaining?: number;
  expired_at?: string;
  [key: string]: any;
}

export interface SeriesJeenDramaItem {
  id?: string | number;
  drama_id?: string | number;
  series_id?: string | number;
  title?: string;
  name?: string;
  title_en?: string;
  title_th?: string;
  cover?: string;
  poster?: string;
  poster_url?: string;
  backdrop?: string;
  horizontal_cover?: string;
  intro?: string;
  description?: string;
  summary?: string;
  overview?: string;
  episodes_count?: number;
  total_episodes?: number;
  episode_count?: number;
  ready_episodes_count?: number;
  ready_episodes?: number;
  genres?: string[] | { id: number; name: string }[];
  category?: string;
  platform?: string;
  platform_name?: string;
  score?: number;
  rating?: number;
  views?: number;
  play_count?: number;
  release_year?: number | string;
  year?: number;
  status?: string;
  actors?: string[] | string;
  director?: string;
  [key: string]: any;
}

export interface SeriesJeenEpisodeItem {
  episode_id?: string | number;
  ep?: number;
  episode_number?: number;
  name?: string;
  title?: string;
  video_url?: string;
  stream_url?: string;
  m3u8_url?: string;
  duration?: number;
  quality?: string;
  [key: string]: any;
}

/**
 * 57 Supported Streaming & Drama Platforms from OpenAPI 3.1.0 Specification
 */
export interface PlatformMeta {
  id: string;
  name: string;
  category: 'Popular' | 'ThaiDub' | 'International' | 'ShortDrama' | 'Anime & Other';
  isThaiDubSupported?: boolean;
}

export const ALL_SUPPORTED_PLATFORMS: PlatformMeta[] = [
  { id: 'thaidub', name: 'รวมซีรีส์พากย์ไทย (ThaiDub Ready)', category: 'ThaiDub', isThaiDubSupported: true },
  { id: 'shortmax', name: 'ShortMax', category: 'Popular', isThaiDubSupported: true },
  { id: 'dramabox', name: 'DramaBox', category: 'Popular', isThaiDubSupported: true },
  { id: 'reelshort', name: 'ReelShort', category: 'Popular', isThaiDubSupported: true },
  { id: 'wetv', name: 'WeTV', category: 'Popular', isThaiDubSupported: true },
  { id: 'netshort', name: 'NetShort', category: 'Popular', isThaiDubSupported: true },
  { id: 'melolo', name: 'Melolo', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'flextv', name: 'FlexTV', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'goodshort', name: 'GoodShort', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'moboreels', name: 'MoboReels', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'dramawave', name: 'DramaWave', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'microdrama', name: 'MicroDrama', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'serealplus', name: 'Sereal+', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'anichin', name: 'AniChin (Anime)', category: 'Anime & Other', isThaiDubSupported: true },
  { id: 'bstation', name: 'Bilibili / Bstation', category: 'Anime & Other', isThaiDubSupported: true },
  { id: 'bilitv', name: 'BiliTV', category: 'Anime & Other', isThaiDubSupported: true },
  { id: 'fundrama', name: 'FunDrama', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'vigloo', name: 'Vigloo', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'storyreel', name: 'StoryReel', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'topdrama', name: 'TopDrama', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'vibeshort', name: 'VibeShort', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'freereels', name: 'FreeReels', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'idrama', name: 'iDrama', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'dotdrama', name: 'DotDrama', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'reelife', name: 'Reelife', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'happyshort', name: 'HappyShort', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'dramabite', name: 'DramaBite', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'reelala', name: 'ReelAla', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'velolo', name: 'Velolo', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'flickreels', name: 'FlickReels', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'stardusttv', name: 'StardustTV', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'rapidtv', name: 'RapidTV', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'shortwave', name: 'ShortWave', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'cubetv', name: 'CubeTV', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'dramanova', name: 'DramaNova', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'starshort', name: 'StarShort', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'reelbuzz', name: 'ReelBuzz', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'plerplow', name: 'PlerPlow', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'pinedrama', name: 'PineDrama', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'cashdrama', name: 'CashDrama', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'dramapops', name: 'DramaPops', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'dramarush', name: 'DramaRush', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'flickshort', name: 'FlickShort', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'meloshort', name: 'MeloShort', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'moviebox', name: 'MovieBox', category: 'International', isThaiDubSupported: true },
  { id: 'radreels', name: 'RadReels', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'shortbox', name: 'ShortBox', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'shorten', name: 'ShortEn', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'shortsky', name: 'ShortSky', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'shotshort', name: 'ShotShort', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'snackshort', name: 'SnackShort', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'sodareels', name: 'SodaReels', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'bonustv', name: 'BonusTV', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'golddrama', name: 'GoldDrama', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'joyreels', name: 'JoyReels', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'kalostv', name: 'KalosTV', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'minitv', name: 'MiniTV', category: 'ShortDrama', isThaiDubSupported: true },
  { id: 'raptdrama', name: 'RaptDrama', category: 'ShortDrama', isThaiDubSupported: true },
];

/**
 * Retrieve saved Series Open API Key
 */
export const getStoredSeriesJeenKey = (): string => {
  return localStorage.getItem(STORAGE_KEY) || '';
};

/**
 * Persist Series Open API Key
 */
export const setStoredSeriesJeenKey = (key: string): void => {
  localStorage.setItem(STORAGE_KEY, key.trim());
};

/**
 * Helper to build auth headers with Bearer token
 */
export const getAuthHeaders = (apiKey?: string): HeadersInit => {
  const token = apiKey?.trim() || getStoredSeriesJeenKey();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json;charset=utf-8',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Fetch the complete OpenAPI 3.1.0 JSON specification
 */
export const fetchOpenApiSpec = async (): Promise<any> => {
  const res = await fetch(OPENAPI_SPEC_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch OpenAPI spec (HTTP ${res.status})`);
  }
  return await res.json();
};

/**
 * GET /health - Server Health Check (No Auth Required)
 */
export const checkApiHealth = async (): Promise<SeriesJeenHealth> => {
  const res = await fetch(`${SERIES_JEEN_BASE_URL}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed with HTTP ${res.status}`);
  }
  return await res.json();
};

/**
 * GET /api/platforms/health - Realtime status of all 57+ platforms (No Auth Required)
 */
export const getPlatformsHealth = async (): Promise<PlatformHealthItem[]> => {
  const res = await fetch(`${SERIES_JEEN_BASE_URL}/api/platforms/health`);
  if (!res.ok) {
    throw new Error(`Failed to fetch platforms health (HTTP ${res.status})`);
  }
  const data: PlatformsHealthResponse = await res.json();
  return data.platforms || [];
};

/**
 * POST /api/auth/login or GET /api/me - Validate API Key
 */
export const validateSeriesJeenKey = async (
  apiKey: string
): Promise<{ success: boolean; message: string; statusCode: number; profile?: SeriesJeenUserProfile }> => {
  const key = apiKey.trim();
  if (!key) {
    return {
      success: false,
      message: 'กรุณากรอก API Key เพื่อเชื่อมต่อ Series Open API',
      statusCode: 400,
    };
  }

  try {
    const res = await fetch(`${SERIES_JEEN_BASE_URL}/api/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const profile = await res.json();
      setStoredSeriesJeenKey(key);
      return {
        success: true,
        message: 'เชื่อมต่อ API Key สำเร็จ — ข้อมูลบัญชีและโควต้าพร้อมใช้งาน',
        statusCode: res.status,
        profile,
      };
    } else if (res.status === 401) {
      return {
        success: false,
        message: 'API Key ไม่ถูกต้อง หรือไม่มีสิทธิ์เข้าถึง (401 Unauthorized)',
        statusCode: 401,
      };
    } else {
      const errText = await res.text();
      return {
        success: false,
        message: `เกิดข้อผิดพลาดในการตรวจสอบ (HTTP ${res.status}): ${errText}`,
        statusCode: res.status,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `ไม่สามารถเชื่อมต่อไปยัง https://api.seriesjeen.online ได้: ${err.message}`,
      statusCode: 500,
    };
  }
};

/**
 * GET /api/me - Get Current Profile & Quota
 */
export const getMeProfile = async (apiKey?: string): Promise<SeriesJeenUserProfile> => {
  const headers = getAuthHeaders(apiKey);
  const res = await fetch(`${SERIES_JEEN_BASE_URL}/api/me`, { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return await res.json();
};

/**
 * GET /api/me/access - Get user purchased access
 */
export const getMeAccess = async (apiKey?: string): Promise<any> => {
  const headers = getAuthHeaders(apiKey);
  const res = await fetch(`${SERIES_JEEN_BASE_URL}/api/me/access`, { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return await res.json();
};

/**
 * GET /api/platform/thaidub/list - Fetch Ready Thai-dubbed Dramas
 */
export const fetchThaiDubList = async (
  params: { page?: number; page_size?: number; keyword?: string } = {},
  apiKey?: string
): Promise<{ list: SeriesJeenDramaItem[]; total?: number; page?: number }> => {
  const headers = getAuthHeaders(apiKey);
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.page_size) queryParams.set('page_size', params.page_size.toString());
  if (params.keyword?.trim()) queryParams.set('keyword', params.keyword.trim());

  const url = `${SERIES_JEEN_BASE_URL}/api/platform/thaidub/list?${queryParams.toString()}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.list || data.dramas || data.items || data.results || [];
  return {
    list,
    total: data.total || data.total_count || list.length,
    page: params.page || 1,
  };
};

/**
 * GET /api/platform/thaidub/detail/{drama_id}
 */
export const fetchThaiDubDetail = async (
  dramaId: string | number,
  apiKey?: string
): Promise<SeriesJeenDramaItem> => {
  const headers = getAuthHeaders(apiKey);
  const res = await fetch(`${SERIES_JEEN_BASE_URL}/api/platform/thaidub/detail/${dramaId}`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch drama detail ${dramaId} (HTTP ${res.status})`);
  }
  return await res.json();
};

/**
 * GET /api/platform/thaidub/episodes/{drama_id}
 */
export const fetchThaiDubEpisodes = async (
  dramaId: string | number,
  params: { start_ep?: number; limit?: number } = {},
  apiKey?: string
): Promise<SeriesJeenEpisodeItem[]> => {
  const headers = getAuthHeaders(apiKey);
  const queryParams = new URLSearchParams();
  if (params.start_ep) queryParams.set('start_ep', params.start_ep.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());

  const url = `${SERIES_JEEN_BASE_URL}/api/platform/thaidub/episodes/${dramaId}?${queryParams.toString()}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch episodes for drama ${dramaId} (HTTP ${res.status})`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.episodes || data.list || [];
};

/**
 * GET /api/platform/thaidub/genres
 */
export const fetchThaiDubGenres = async (apiKey?: string): Promise<{ id: number; name: string; count?: number }[]> => {
  const headers = getAuthHeaders(apiKey);
  const res = await fetch(`${SERIES_JEEN_BASE_URL}/api/platform/thaidub/genres`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch ThaiDub genres (HTTP ${res.status})`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.genres || [];
};

/**
 * GET /api/platform/thaidub/genre/{genre_id}
 */
export const fetchThaiDubByGenre = async (
  genreId: string | number,
  params: { page?: number; page_size?: number } = {},
  apiKey?: string
): Promise<{ list: SeriesJeenDramaItem[]; total?: number }> => {
  const headers = getAuthHeaders(apiKey);
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.page_size) queryParams.set('page_size', params.page_size.toString());

  const url = `${SERIES_JEEN_BASE_URL}/api/platform/thaidub/genre/${genreId}?${queryParams.toString()}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.list || data.items || [];
  return { list, total: data.total || list.length };
};

/**
 * GET /api/platform/thaidub/platforms - Platforms in ThaiDub warehouse
 */
export const fetchThaiDubPlatforms = async (apiKey?: string): Promise<string[]> => {
  const headers = getAuthHeaders(apiKey);
  const res = await fetch(`${SERIES_JEEN_BASE_URL}/api/platform/thaidub/platforms`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch ThaiDub platforms (HTTP ${res.status})`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.platforms || [];
};

/**
 * GET /api/platform/thaidub/platform/{platform}/list
 */
export const fetchThaiDubPlatformList = async (
  platform: string,
  params: { page?: number; page_size?: number } = {},
  apiKey?: string
): Promise<{ list: SeriesJeenDramaItem[]; total?: number }> => {
  const headers = getAuthHeaders(apiKey);
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.page_size) queryParams.set('page_size', params.page_size.toString());

  const cleanPlatform = platform.toLowerCase().replace(/[^a-z0-9]/g, '');
  const url = `${SERIES_JEEN_BASE_URL}/api/platform/thaidub/platform/${cleanPlatform}/list?${queryParams.toString()}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.list || data.items || [];
  return { list, total: data.total || list.length };
};

/**
 * GET /api/platform/{platform}/list - Fetch dramas by platform
 */
export const fetchPlatformDramas = async (
  platform: string,
  params: { page?: number; page_size?: number; locale?: string } = {},
  apiKey?: string
): Promise<{ list: SeriesJeenDramaItem[]; total?: number; page?: number }> => {
  const headers = getAuthHeaders(apiKey);
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.page_size) queryParams.set('page_size', params.page_size.toString());
  if (params.locale) queryParams.set('locale', params.locale);

  const cleanPlatform = platform.toLowerCase().replace(/[^a-z0-9]/g, '');
  const url = `${SERIES_JEEN_BASE_URL}/api/platform/${cleanPlatform}/list?${queryParams.toString()}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.list || data.items || data.dramas || data.results || [];
  return {
    list,
    total: data.total || data.total_count || list.length,
    page: params.page || 1,
  };
};

/**
 * GET /api/platform/{platform}/search - Search within a specific platform
 */
export const searchPlatformDramas = async (
  platform: string,
  keyword: string,
  page: number = 1,
  apiKey?: string
): Promise<SeriesJeenDramaItem[]> => {
  const headers = getAuthHeaders(apiKey);
  const cleanPlatform = platform.toLowerCase().replace(/[^a-z0-9]/g, '');
  const url = `${SERIES_JEEN_BASE_URL}/api/platform/${cleanPlatform}/search?keyword=${encodeURIComponent(keyword)}&page=${page}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Search failed on ${platform} (HTTP ${res.status})`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.list || data.results || data.dramas || [];
};

/**
 * GET /api/platform/{platform}/thai - Fetch Thai dubs on a specific platform
 */
export const fetchPlatformThaiOnly = async (
  platform: string,
  apiKey?: string
): Promise<SeriesJeenDramaItem[]> => {
  const headers = getAuthHeaders(apiKey);
  const cleanPlatform = platform.toLowerCase().replace(/[^a-z0-9]/g, '');
  const url = `${SERIES_JEEN_BASE_URL}/api/platform/${cleanPlatform}/thai`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch Thai content on ${platform} (HTTP ${res.status})`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.list || [];
};

/**
 * GET /api/platform/{platform}/locales - Fetch supported languages
 */
export const fetchPlatformLocales = async (
  platform: string,
  apiKey?: string
): Promise<any[]> => {
  const headers = getAuthHeaders(apiKey);
  const cleanPlatform = platform.toLowerCase().replace(/[^a-z0-9]/g, '');
  const url = `${SERIES_JEEN_BASE_URL}/api/platform/${cleanPlatform}/locales`;
  const res = await fetch(url, { headers });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.locales || [];
};

/**
 * DELETE /api/cache/{platform_name}/{series_id} - Report broken video/content
 */
export const reportBrokenContent = async (
  platform: string,
  seriesId: string | number,
  apiKey?: string
): Promise<{ success: boolean; message: string }> => {
  const headers = getAuthHeaders(apiKey);
  const cleanPlatform = platform.toLowerCase().replace(/[^a-z0-9]/g, '');
  const res = await fetch(`${SERIES_JEEN_BASE_URL}/api/cache/${cleanPlatform}/${seriesId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    throw new Error(`Failed to report broken content (HTTP ${res.status})`);
  }
  return {
    success: true,
    message: 'แจ้งรายงานเรื่องที่ไม่สามารถเล่นได้สำเร็จ ระบบจะรีเฟรชข้อมูลให้โดยเร็วที่สุด',
  };
};

/**
 * Transform Series Open API drama entity to the internal Movie structure
 */
export const transformSeriesJeenToMovie = (drama: SeriesJeenDramaItem, platformName: string = 'SeriesJeen'): Movie => {
  const rawId = drama.drama_id || drama.series_id || drama.id || Math.floor(Math.random() * 900000 + 100000);
  const title = drama.title || drama.name || drama.title_th || 'ซีรีส์ใหม่ล่าสุด';
  const titleEn = drama.title_en || drama.name || title;
  const year = drama.year || (drama.release_year ? parseInt(String(drama.release_year), 10) : 2026);
  const episodes = drama.episodes_count || drama.total_episodes || drama.ready_episodes_count || drama.episode_count || 30;

  // Poster fallback
  const poster =
    drama.poster_url ||
    drama.poster ||
    drama.cover ||
    drama.horizontal_cover ||
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80';

  const backdrop =
    drama.backdrop ||
    drama.horizontal_cover ||
    drama.cover ||
    poster;

  // Genres extraction
  let genres: string[] = ['ซีรีส์พากย์ไทย', 'ดราม่า'];
  if (Array.isArray(drama.genres)) {
    genres = drama.genres.map((g) => (typeof g === 'string' ? g : g.name)).filter(Boolean);
  } else if (typeof drama.category === 'string') {
    genres = [drama.category, 'พากย์ไทย'];
  }

  const category = drama.category || (genres.length > 0 ? genres[0] : 'ซีรีส์พากย์ไทย');

  return {
    id: `sj-${platformName.toLowerCase()}-${rawId}`,
    code: `#SJ-${rawId}`,
    title,
    titleEn,
    year: isNaN(year) ? 2026 : year,
    rating: typeof drama.score === 'number' ? drama.score : typeof drama.rating === 'number' ? drama.rating : 9.5,
    poster,
    backdrop,
    category,
    genres: genres.length > 0 ? genres : ['ซีรีส์จีน', 'พากย์ไทย'],
    quality: '4K',
    status: 'active',
    duration: `${episodes} ตอน`,
    views: drama.views || drama.play_count || Math.floor(Math.random() * 30000 + 12000),
    description:
      drama.intro ||
      drama.description ||
      drama.summary ||
      drama.overview ||
      `ซีรีส์ยอดนิยมจากแพลตฟอร์ม ${platformName} ความละเอียดระดับ 4K UHD พร้อมเสียงพากย์ไทยคมชัดทุกตอน`,
    streamUrl: drama.stream_url || drama.video_url || drama.m3u8_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    director: drama.director || 'ทีมผลิตคุณภาพ',
    cast: Array.isArray(drama.actors) ? drama.actors : typeof drama.actors === 'string' ? drama.actors.split(',') : ['นักแสดงนำยอดนิยม'],
    featured: (drama.score || drama.rating || 9) >= 9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Backward compatibility alias for tmdbService imports
 */
export const getStoredApiKey = getStoredSeriesJeenKey;
export const setStoredApiKey = setStoredSeriesJeenKey;
export const validateTMDBKey = validateSeriesJeenKey;

