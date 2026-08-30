import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Plus,
  Star,
  Pencil,
  Trash2,
  Eye,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  CheckCircle2,
  Film,
  Calendar,
  Layers,
  Flame,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Movie } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MoviesManagementProps {
  movies: Movie[];
  onAddMovie: () => void;
  onEditMovie: (movie: Movie) => void;
  onDeleteMovie: (movie: Movie) => void;
  onOpenApiSync: () => void;
  onOpenPreview: () => void;
  onPlayMovie?: (movie: Movie) => void;
}

type SortOption = 'latest' | 'rating-desc' | 'rating-asc' | 'year-desc' | 'year-asc' | 'title-az';

export const MoviesManagement: React.FC<MoviesManagementProps> = ({
  movies,
  onAddMovie,
  onEditMovie,
  onDeleteMovie,
  onOpenApiSync,
  onOpenPreview,
  onPlayMovie,
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Extract unique categories and years
  const categories = useMemo(() => {
    const set = new Set(movies.map((m) => m.category).filter(Boolean));
    return Array.from(set);
  }, [movies]);

  const years = useMemo(() => {
    const set = new Set<number>(movies.map((m) => m.year));
    return Array.from(set).sort((a: number, b: number) => b - a);
  }, [movies]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        const matchesSearch =
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (movie.titleEn && movie.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
          movie.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          selectedCategory === 'all' || movie.category === selectedCategory;

        const matchesYear =
          selectedYear === 'all' || movie.year.toString() === selectedYear;

        const matchesQuality =
          selectedQuality === 'all' || movie.quality === selectedQuality;

        return matchesSearch && matchesCategory && matchesYear && matchesQuality;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'rating-desc') {
          return b.rating - a.rating;
        }
        if (sortBy === 'rating-asc') {
          return a.rating - b.rating;
        }
        if (sortBy === 'year-desc') {
          return b.year - a.year;
        }
        if (sortBy === 'year-asc') {
          return a.year - b.year;
        }
        if (sortBy === 'title-az') {
          const titleA = language === 'en' && a.titleEn ? a.titleEn : a.title;
          const titleB = language === 'en' && b.titleEn ? b.titleEn : b.title;
          return titleA.localeCompare(titleB, language === 'en' ? 'en' : 'th');
        }
        return 0;
      });
  }, [movies, searchQuery, selectedCategory, selectedYear, selectedQuality, sortBy, language]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Film className="w-7 h-7 text-[#E50914]" />
              {t.movies.pageTitle}
            </h1>
            <span className="bg-[#E50914]/20 text-[#E50914] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#E50914]/30">
              Live Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {t.movies.pageSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onOpenPreview}
            className="bg-[#E50914] hover:bg-[#E50914]/90 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#E50914]/20 cursor-pointer text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>{t.header.previewSite}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search, API Update, Add Movie, Sorting */}
      <div className="bg-[#1A1A1A] p-4 rounded-xl border border-white/5 space-y-4 shadow-md">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.movies.searchPlaceholder}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071EB]/50 focus:border-[#0071EB] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-white/10 px-1.5 py-0.5 rounded cursor-pointer"
              >
                {t.common.cancel}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2.5 items-center">
            {/* Update via API */}
            <button
              onClick={onOpenApiSync}
              className="bg-[#0071EB] hover:bg-[#0071EB]/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-md shadow-[#0071EB]/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.movies.syncApiBtn}</span>
            </button>

            {/* Add Movie */}
            <button
              onClick={onAddMovie}
              className="bg-[#28A745] hover:bg-[#28A745]/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-md shadow-[#28A745]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.movies.addMovieBtn}</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#0F0F0F] p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title={t.movies.viewGrid}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title={t.movies.viewTable}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Sorting Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs sm:text-sm">
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> {t.common.filter}:
            </span>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0F0F0F] border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#0071EB]"
            >
              <option value="all">{t.movies.allCategories}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Year Select */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#0F0F0F] border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#0071EB]"
            >
              <option value="all">{language === 'th' ? 'ปีทั้งหมด' : 'All Years'}</option>
              {years.map((yr) => (
                <option key={yr} value={yr.toString()}>
                  {yr}
                </option>
              ))}
            </select>

            {/* Quality Select */}
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="bg-[#0F0F0F] border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#0071EB]"
            >
              <option value="all">{t.movies.allQualities}</option>
              <option value="4K">4K Ultra HD</option>
              <option value="FHD">Full HD (1080p)</option>
              <option value="HD">HD (720p)</option>
              <option value="CAM">CAM / ซูม</option>
            </select>

            {(selectedCategory !== 'all' || selectedYear !== 'all' || selectedQuality !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedYear('all');
                  setSelectedQuality('all');
                }}
                className="text-xs text-red-400 hover:underline px-1 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'th' ? 'รีเซ็ตตัวกรอง' : 'Reset Filters'}</span>
              </button>
            )}
          </div>

          {/* Sort & Total count */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-400 text-xs">{t.movies.sortBy}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#0F0F0F] border border-white/10 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#0071EB]"
            >
              <option value="latest">{t.movies.sortLatest}</option>
              <option value="rating-desc">{t.movies.sortRatingHigh}</option>
              <option value="year-desc">{t.movies.sortYearNew}</option>
              <option value="title-az">{t.movies.sortNameAZ}</option>
            </select>

            <span className="text-gray-400 text-xs ml-2 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              {language === 'th' ? (
                <>แสดง {filteredMovies.length.toLocaleString()} จาก <strong className="text-white">1,605</strong> เรื่อง</>
              ) : (
                <>Showing {filteredMovies.length.toLocaleString()} of <strong className="text-white">1,605</strong> titles</>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Movies Content: Grid vs Table */}
      {filteredMovies.length === 0 ? (
        <div className="bg-[#1A1A1A] rounded-xl p-12 text-center border border-white/5 space-y-3">
          <Film className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-medium text-white">{t.common.noData}</h3>
          <p className="text-sm text-gray-400">
            {language === 'th'
              ? 'ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองหมวดหมู่'
              : 'Try changing your search keywords or resetting filters'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedYear('all');
              setSelectedQuality('all');
            }}
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-lg transition cursor-pointer"
          >
            {language === 'th' ? 'ล้างตัวกรองทั้งหมด' : 'Clear All Filters'}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Movie Grid Layout */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMovies.map((movie) => {
            const isUpcomingOrNew = movie.year >= 2025;
            const displayTitle = language === 'en' && movie.titleEn ? movie.titleEn : movie.title;

            return (
              <div
                key={movie.id}
                className="bg-[#242424] rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/50 border border-white/5 flex flex-col group"
              >
                {/* Poster & Badges */}
                <div className="aspect-[2/3] relative overflow-hidden bg-black/50">
                  <img
                    src={movie.poster}
                    alt={displayTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80';
                    }}
                  />

                  {/* Year Badge */}
                  <div
                    className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs font-semibold shadow-md ${
                      isUpcomingOrNew ? 'bg-[#E50914] text-white' : 'bg-black/75 text-gray-100 backdrop-blur-xs'
                    }`}
                  >
                    {movie.year}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-1 text-white shadow-md">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>

                  {/* Quality Pill */}
                  <div className="absolute bottom-2 left-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-emerald-400/30">
                    {movie.quality}
                  </div>

                  {movie.featured && (
                    <div className="absolute bottom-2 right-2 bg-amber-500/90 text-black px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>{language === 'th' ? 'แนะนำ' : 'HOT'}</span>
                    </div>
                  )}

                  {/* Hover Play Button Overlay */}
                  {onPlayMovie && (
                    <button
                      onClick={() => onPlayMovie(movie)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 cursor-pointer z-10"
                      title={t.common.playNow}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                      <span className="text-xs font-bold text-white bg-black/80 px-2.5 py-0.5 rounded-full">
                        {t.movies.playMovie}
                      </span>
                    </button>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-sm truncate text-white group-hover:text-[#E50914] transition-colors" title={displayTitle}>
                      {displayTitle}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2 mt-0.5">
                      <span className="font-mono">{movie.code}</span>
                      <span className="text-[11px] truncate max-w-[90px]">{movie.category.replace('ภาพยนตร์', '')}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-1.5 pt-1 border-t border-white/5">
                    {onPlayMovie && (
                      <button
                        onClick={() => onPlayMovie(movie)}
                        className="bg-[#E50914]/20 hover:bg-[#E50914] text-[#E50914] hover:text-white border border-[#E50914]/40 hover:border-transparent text-xs py-1 px-2 rounded-md font-medium flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{t.movies.playMovie}</span>
                      </button>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditMovie(movie)}
                        className="border border-white/20 text-white hover:bg-white/10 text-xs py-1 px-2 rounded-md flex-1 flex items-center justify-center gap-1 transition duration-150 cursor-pointer"
                      >
                        <Pencil className="w-3 h-3 text-gray-300" />
                        <span>{t.movies.editMovie}</span>
                      </button>
                      <button
                        onClick={() => onDeleteMovie(movie)}
                        className="border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-400/40 text-xs py-1 px-2 rounded-md flex-1 flex items-center justify-center gap-1 transition duration-150 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{t.movies.deleteMovie}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-white/5 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#141414] text-xs uppercase text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3.5">{t.movies.tableCode}</th>
                  <th className="px-4 py-3.5">{t.movies.tableTitle}</th>
                  <th className="px-4 py-3.5">{t.movies.tableCategory}</th>
                  <th className="px-4 py-3.5 text-center">{t.movies.tableYearRating}</th>
                  <th className="px-4 py-3.5 text-center">{t.movies.tableQuality}</th>
                  <th className="px-4 py-3.5 text-center">{t.movies.tableStatus}</th>
                  <th className="px-4 py-3.5 text-right">{t.movies.tableActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMovies.map((movie) => {
                  const displayTitle = language === 'en' && movie.titleEn ? movie.titleEn : movie.title;
                  return (
                    <tr key={movie.id} className="hover:bg-white/5 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{movie.code}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={movie.poster}
                            alt={displayTitle}
                            className="w-10 h-14 object-cover rounded shadow shrink-0"
                            loading="lazy"
                          />
                          <div>
                            <div className="font-semibold text-white truncate max-w-xs">{displayTitle}</div>
                            {movie.titleEn && movie.title !== movie.titleEn && (
                              <div className="text-xs text-gray-400 truncate max-w-xs">{movie.titleEn}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div className="text-white">{movie.category}</div>
                        <div className="text-gray-400 flex flex-wrap gap-1 mt-1">
                          {movie.genres.slice(0, 2).map((g) => (
                            <span key={g} className="bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">
                        <div className="space-y-1">
                          <span className={movie.year >= 2025 ? 'text-[#E50914] font-bold' : 'text-gray-300'}>
                            {movie.year}
                          </span>
                          <div className="inline-flex items-center gap-1 bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                            <Star className="w-2.5 h-2.5 fill-yellow-400" />
                            {movie.rating.toFixed(1)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold">
                          {movie.quality}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            movie.status === 'active' ? 'bg-green-500 ring-4 ring-green-500/20' : 'bg-yellow-500'
                          }`}
                          title={movie.status === 'active' ? t.common.active : t.common.draft}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {onPlayMovie && (
                            <button
                              onClick={() => onPlayMovie(movie)}
                              className="p-1.5 bg-[#E50914]/20 hover:bg-[#E50914] text-[#E50914] hover:text-white rounded transition cursor-pointer"
                              title={t.movies.playMovie}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                          )}
                          <button
                            onClick={() => onEditMovie(movie)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded transition cursor-pointer"
                            title={t.movies.editMovie}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteMovie(movie)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition cursor-pointer"
                            title={t.movies.deleteMovie}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UX Writing Note from initial template */}
      <div className="mt-8 p-5 bg-[#1A1A1A] rounded-lg border border-white/5">
        <h3 className="font-bold text-sm sm:text-base mb-3 text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{t.movies.uxTitle}</span>
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
          <li>{t.movies.uxNote1}</li>
          <li>{t.movies.uxNote2}</li>
          <li>{t.movies.uxNote3}</li>
          <li>{t.movies.uxNote4}</li>
          <li>{t.movies.uxNote5}</li>
          <li>{t.movies.uxNote6}</li>
        </ul>
      </div>
    </div>
  );
};
