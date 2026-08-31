/**
 * Re-exports & Bridges to Series Open API (https://api.seriesjeen.online)
 * All mock data has been deleted and replaced with real calls to https://api.seriesjeen.online.
 */

export * from './seriesJeenService';

import {
  SERIES_JEEN_BASE_URL,
  getStoredSeriesJeenKey,
  setStoredSeriesJeenKey,
  validateSeriesJeenKey,
  fetchPlatformDramas,
  searchPlatformDramas,
  fetchThaiDubList,
  fetchThaiDubDetail,
  transformSeriesJeenToMovie,
  SeriesJeenDramaItem,
} from './seriesJeenService';
import { Movie } from '../types';

export const validateTMDBKey = validateSeriesJeenKey;
export const getStoredApiKey = getStoredSeriesJeenKey;
export const setStoredApiKey = setStoredSeriesJeenKey;

export const fetchTMDBMovies = async (
  endpoint: 'popular' | 'now_playing' | 'top_rated' | 'upcoming',
  page: number = 1,
  _language: string = 'th-TH',
  apiKeyInput?: string
): Promise<{ movies: Movie[]; rawData: any }> => {
  const platform = endpoint === 'popular' ? 'thaidub' : endpoint === 'now_playing' ? 'shortmax' : endpoint === 'top_rated' ? 'dramabox' : 'reelshort';
  if (platform === 'thaidub') {
    const res = await fetchThaiDubList({ page, page_size: 20 }, apiKeyInput);
    const movies = res.list.map((item) => transformSeriesJeenToMovie(item, 'ThaiDub'));
    return { movies, rawData: res };
  } else {
    const res = await fetchPlatformDramas(platform, { page, page_size: 20 }, apiKeyInput);
    const movies = res.list.map((item) => transformSeriesJeenToMovie(item, platform));
    return { movies, rawData: res };
  }
};

export const searchTMDBMovies = async (
  query: string,
  _language: string = 'th-TH',
  apiKeyInput?: string
): Promise<Movie[]> => {
  try {
    const res = await fetchThaiDubList({ keyword: query, page_size: 20 }, apiKeyInput);
    if (res.list && res.list.length > 0) {
      return res.list.map((item) => transformSeriesJeenToMovie(item, 'ThaiDub'));
    }
  } catch (e) {
    // fallback search on shortmax
  }
  const dramas = await searchPlatformDramas('shortmax', query, 1, apiKeyInput);
  return dramas.map((item) => transformSeriesJeenToMovie(item, 'ShortMax'));
};

export const getTMDBMovieDetails = async (
  id: number | string,
  _language: string = 'th-TH',
  apiKeyInput?: string
): Promise<Movie | null> => {
  try {
    const drama = await fetchThaiDubDetail(id, apiKeyInput);
    if (drama) {
      return transformSeriesJeenToMovie(drama, 'ThaiDub');
    }
  } catch (e) {
    // fallback
  }
  return null;
};
