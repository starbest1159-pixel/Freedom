/**
 * Premier League API Service
 * Fetches real-time match data, standings, and team information from football-data.org API
 * Supports current season (2024-25) and upcoming fixtures
 */

import { LiveStream } from '../types';

const FOOTBALL_DATA_BASE_URL = 'https://api.football-data.org/v4';
const PREMIER_LEAGUE_COMP_ID = 'PL'; // Premier League competition code

// Environment variable for API key
const FOOTBALL_DATA_API_KEY = import.meta.env.VITE_FOOTBALL_DATA_API_KEY || 'demo-key';

// Cache duration in milliseconds
const CACHE_DURATION = 300000; // 5 minutes

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};

/**
 * Get authorization headers for API requests
 */
const getAuthHeaders = (apiKey?: string): HeadersInit => {
  const key = apiKey?.trim() || FOOTBALL_DATA_API_KEY;
  return {
    'X-Auth-Token': key,
    'Content-Type': 'application/json',
  };
};

/**
 * Check if cached data is still valid
 */
const isCacheValid = (cacheKey: string): boolean => {
  const entry = cache[cacheKey];
  if (!entry) return false;
  const now = Date.now();
  return now - entry.timestamp < CACHE_DURATION;
};

/**
 * Get cached data or fetch new
 */
const fetchWithCache = async (
  url: string,
  cacheKey: string,
  apiKey?: string
): Promise<any> => {
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(apiKey),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    cache[cacheKey] = { data, timestamp: Date.now() };
    return data;
  } catch (error: any) {
    console.error(`API Error (${cacheKey}):`, error);
    // Return cached data if available, even if expired
    if (cache[cacheKey]) {
      return cache[cacheKey].data;
    }
    throw error;
  }
};

/**
 * Fetch current Premier League standings
 */
export const fetchPremierLeagueStandings = async (
  apiKey?: string
): Promise<any> => {
  const url = `${FOOTBALL_DATA_BASE_URL}/competitions/${PREMIER_LEAGUE_COMP_ID}/standings`;
  return fetchWithCache(url, 'pl-standings', apiKey);
};

/**
 * Fetch today's or upcoming Premier League matches
 */
export const fetchPremierLeagueMatches = async (
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' = 'LIVE',
  apiKey?: string
): Promise<any> => {
  const url = `${FOOTBALL_DATA_BASE_URL}/competitions/${PREMIER_LEAGUE_COMP_ID}/matches?status=${status}`;
  return fetchWithCache(url, `pl-matches-${status}`, apiKey);
};

/**
 * Fetch specific match details
 */
export const fetchMatchDetail = async (
  matchId: number,
  apiKey?: string
): Promise<any> => {
  const url = `${FOOTBALL_DATA_BASE_URL}/matches/${matchId}`;
  return fetchWithCache(url, `match-${matchId}`, apiKey);
};

/**
 * Fetch team information
 */
export const fetchTeamInfo = async (
  teamId: number,
  apiKey?: string
): Promise<any> => {
  const url = `${FOOTBALL_DATA_BASE_URL}/teams/${teamId}`;
  return fetchWithCache(url, `team-${teamId}`, apiKey);
};

/**
 * Transform football-data.org match to LiveStream format
 */
export const transformMatchToLiveStream = (
  match: any,
  index: number = 0
): LiveStream => {
  const homeTeam = match.homeTeam || {};
  const awayTeam = match.awayTeam || {};
  const status = match.status || 'SCHEDULED';
  const score = match.score || {};

  // Determine stream status
  const streamStatus: 'live' | 'upcoming' | 'ended' =
    status === 'LIVE' ? 'live' : status === 'SCHEDULED' ? 'upcoming' : 'ended';

  // Format match time
  const utcDate = new Date(match.utcDate);
  const matchTimeStr = utcDate.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const matchDateStr = utcDate.toLocaleDateString('th-TH', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Get team logos (using placeholder images, can be replaced with real logos)
  const getTeamLogo = (teamName: string): string => {
    const logoMap: Record<string, string> = {
      'Arsenal FC': 'https://crests.football-data.org/64.png',
      'Aston Villa FC': 'https://crests.football-data.org/66.png',
      'Bournemouth AFC': 'https://crests.football-data.org/1044.png',
      'Brentford FC': 'https://crests.football-data.org/402.png',
      'Brighton and Hove Albion FC': 'https://crests.football-data.org/131.png',
      'Chelsea FC': 'https://crests.football-data.org/61.png',
      'Crystal Palace FC': 'https://crests.football-data.org/73.png',
      'Everton FC': 'https://crests.football-data.org/62.png',
      'Fulham FC': 'https://crests.football-data.org/63.png',
      'Ipswich Town FC': 'https://crests.football-data.org/87.png',
      'Leicester City FC': 'https://crests.football-data.org/338.png',
      'Liverpool FC': 'https://crests.football-data.org/64.png',
      'Manchester City FC': 'https://crests.football-data.org/65.png',
      'Manchester United FC': 'https://crests.football-data.org/66.png',
      'Newcastle United FC': 'https://crests.football-data.org/67.png',
      'Nottingham Forest FC': 'https://crests.football-data.org/68.png',
      'Southampton FC': 'https://crests.football-data.org/340.png',
      'Tottenham Hotspur FC': 'https://crests.football-data.org/69.png',
      'West Ham United FC': 'https://crests.football-data.org/70.png',
      'Wolverhampton Wanderers FC': 'https://crests.football-data.org/71.png',
    };
    return logoMap[teamName] || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150';
  };

  return {
    id: `live-pl-${match.id}`,
    code: `#LIVE-PL${String(index).padStart(2, '0')}`,
    title: `${homeTeam.name} พบ ${awayTeam.name}`,
    league: 'พรีเมียร์ลีก อังกฤษ (Premier League)',
    category: 'football',
    status: streamStatus,
    homeTeam: {
      name: homeTeam.name || 'Home Team',
      logo: getTeamLogo(homeTeam.name),
      score: score.home !== null ? score.home : undefined,
      color: '#DA291C', // Default color
    },
    awayTeam: {
      name: awayTeam.name || 'Away Team',
      logo: getTeamLogo(awayTeam.name),
      score: score.away !== null ? score.away : undefined,
      color: '#132257', // Default color
    },
    matchTime: `${matchTimeStr} น.`,
    matchDate: matchDateStr,
    stadium: match.venue || 'Stadium TBA',
    competitionRound: `Matchday ${match.stage?.match(/\d+/) || '?'}`,
    currentMinute: 
      streamStatus === 'live' 
        ? `${score.elapsed || '?'}'`
        : streamStatus === 'ended'
        ? 'จบเกม'
        : 'ยังไม่เริ่ม',
    streamServers: [
      {
        id: 'srv-1',
        name: 'Server 1 - True Premier Football HD (หลัก 4K)',
        quality: '4K 60FPS',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        bitrate: '8500 kbps',
      },
      {
        id: 'srv-2',
        name: 'Server 2 - FHD สำรองลื่นไหล',
        quality: '1080p 60FPS',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        bitrate: '4500 kbps',
      },
      {
        id: 'srv-3',
        name: 'Server 3 - HD สำหรับเน็ตช้า',
        quality: '720p 50FPS',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        bitrate: '2200 kbps',
        isBackup: true,
      },
    ],
    currentViewers: Math.floor(Math.random() * 500000 + 100000),
    thumbnail: getTeamLogo(homeTeam.name),
    backdrop: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600',
    resolution: '4K UHD 60FPS',
    commentary: 'พากย์ไทย (True Premier Football)',
    channelName: 'True Premier Football HD 1',
    pinned: streamStatus === 'live',
    featured: streamStatus === 'live' || streamStatus === 'upcoming',
    chatEnabled: true,
    createdAt: new Date(match.utcDate).toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Get all live and upcoming Premier League matches
 */
export const getAllPremierLeagueMatches = async (apiKey?: string): Promise<LiveStream[]> => {
  try {
    // Fetch both live and scheduled matches
    const [liveData, scheduledData] = await Promise.all([
      fetchPremierLeagueMatches('LIVE', apiKey),
      fetchPremierLeagueMatches('SCHEDULED', apiKey),
    ]);

    const allMatches = [
      ...(liveData.matches || []),
      ...(scheduledData.matches || []),
    ];

    // Transform to LiveStream format
    return allMatches
      .map((match, index) => transformMatchToLiveStream(match, index + 1))
      .sort((a, b) => {
        // Sort: Live first, then upcoming by time
        if (a.status === 'live' && b.status !== 'live') return -1;
        if (a.status !== 'live' && b.status === 'live') return 1;
        return 0;
      });
  } catch (error) {
    console.error('Failed to fetch Premier League matches:', error);
    return [];
  }
};

/**
 * Validate API key with health check
 */
export const validatePremierLeagueApiKey = async (
  apiKey: string
): Promise<{ success: boolean; message: string; statusCode: number }> => {
  const key = apiKey.trim();
  if (!key) {
    return {
      success: false,
      message: 'กรุณากรอก API Key สำหรับ football-data.org',
      statusCode: 400,
    };
  }

  try {
    const response = await fetch(`${FOOTBALL_DATA_BASE_URL}/competitions/${PREMIER_LEAGUE_COMP_ID}`, {
      headers: getAuthHeaders(key),
    });

    if (response.ok) {
      return {
        success: true,
        message: 'เชื่อมต่อ API สำเร็จ — ข้อมูล Premier League พร้อมใช้งาน',
        statusCode: 200,
      };
    } else if (response.status === 401) {
      return {
        success: false,
        message: 'API Key ไม่ถูกต้อง (401 Unauthorized)',
        statusCode: 401,
      };
    } else {
      return {
        success: false,
        message: `เกิดข้อผิดพลาด (HTTP ${response.status})`,
        statusCode: response.status,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `ไม่สามารถเชื่อมต่อ: ${error.message}`,
      statusCode: 500,
    };
  }
};

/**
 * Get Premier League standings for current season
 */
export const getPremierLeagueStandings = async (apiKey?: string): Promise<any> => {
  try {
    const data = await fetchPremierLeagueStandings(apiKey);
    return {
      season: data.season,
      standings: data.standings?.[0]?.table || [],
    };
  } catch (error) {
    console.error('Failed to fetch standings:', error);
    return { season: null, standings: [] };
  }
};
