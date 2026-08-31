import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Film,
  Image as ImageIcon,
  Star,
  Check,
  AlertCircle,
  Search,
  RefreshCw,
  Database,
  ArrowDownRight,
} from 'lucide-react';
import { Movie, MovieQuality, MovieStatus } from '../types';
import { searchTMDBMovies, getTMDBMovieDetails } from '../services/tmdbService';
import { useLanguage } from '../context/LanguageContext';

interface MovieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movieData: Partial<Movie>) => void;
  movieToEdit?: Movie | null;
  availableCategories: string[];
  availableGenres: string[];
}

export const MovieFormModal: React.FC<MovieFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  movieToEdit,
  availableCategories,
  availableGenres,
}) => {
  const { t, language } = useLanguage();
  const isEditMode = !!movieToEdit;

  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [code, setCode] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [rating, setRating] = useState(7.0);
  const [poster, setPoster] = useState('');
  const [backdrop, setBackdrop] = useState('');
  const [category, setCategory] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [quality, setQuality] = useState<MovieQuality>('4K');
  const [status, setStatus] = useState<MovieStatus>('active');
  const [duration, setDuration] = useState('110 นาที');
  const [description, setDescription] = useState('');
  const [director, setDirector] = useState('');
  const [castString, setCastString] = useState('');
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TMDB Quick Search States
  const [showTmdbSearch, setShowTmdbSearch] = useState(false);
  const [tmdbSearchInput, setTmdbSearchInput] = useState('');
  const [tmdbSearching, setTmdbSearching] = useState(false);
  const [tmdbSearchResults, setTmdbSearchResults] = useState<Movie[]>([]);

  useEffect(() => {
    if (movieToEdit) {
      setTitle(movieToEdit.title);
      setTitleEn(movieToEdit.titleEn || '');
      setCode(movieToEdit.code);
      setYear(movieToEdit.year);
      setRating(movieToEdit.rating);
      setPoster(movieToEdit.poster);
      setBackdrop(movieToEdit.backdrop || '');
      setCategory(movieToEdit.category);
      setSelectedGenres(movieToEdit.genres || []);
      setQuality(movieToEdit.quality);
      setStatus(movieToEdit.status);
      setDuration(movieToEdit.duration || (language === 'th' ? '120 นาที' : '120 min'));
      setDescription(movieToEdit.description || '');
      setDirector(movieToEdit.director || '');
      setCastString((movieToEdit.cast || []).join(', '));
      setFeatured(!!movieToEdit.featured);
    } else {
      // Reset defaults for new movie
      setTitle('');
      setTitleEn('');
      setCode(`#${Math.floor(100 + Math.random() * 9000)}`);
      setYear(2025);
      setRating(7.2);
      setPoster('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80');
      setBackdrop('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80');
      setCategory(availableCategories[0] || (language === 'th' ? 'ภาพยนตร์แอ็คชั่น' : 'Action Movies'));
      setSelectedGenres(['แอ็คชั่น', 'ระทึกขวัญ']);
      setQuality('4K');
      setStatus('active');
      setDuration(language === 'th' ? '118 นาที' : '118 min');
      setDescription('');
      setDirector('');
      setCastString('');
      setFeatured(false);
    }
    setError(null);
    setShowTmdbSearch(false);
    setTmdbSearchResults([]);
  }, [movieToEdit, isOpen, availableCategories, language]);

  if (!isOpen) return null;

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleRandomPoster = () => {
    const samplePosters = [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    ];
    const next = samplePosters[Math.floor(Math.random() * samplePosters.length)];
    setPoster(next);
  };

  const handleTmdbSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmdbSearchInput.trim()) return;

    setTmdbSearching(true);
    try {
      const results = await searchTMDBMovies(tmdbSearchInput.trim(), language === 'en' ? 'en-US' : 'th-TH');
      setTmdbSearchResults(results);
    } catch (err: any) {
      setError(err?.message || (language === 'th' ? 'ค้นหา TMDB ล้มเหลว' : 'TMDB search failed'));
    } finally {
      setTmdbSearching(false);
    }
  };

  const handleApplyTmdbMovie = (tmdbMovie: Movie) => {
    setTitle(tmdbMovie.title);
    setTitleEn(tmdbMovie.titleEn || '');
    setYear(tmdbMovie.year);
    setRating(tmdbMovie.rating);
    setPoster(tmdbMovie.poster);
    if (tmdbMovie.backdrop) setBackdrop(tmdbMovie.backdrop);
    setDuration(tmdbMovie.duration || (language === 'th' ? '120 นาที' : '120 min'));
    setDescription(tmdbMovie.description || '');
    if (tmdbMovie.director) setDirector(tmdbMovie.director);
    if (tmdbMovie.cast && tmdbMovie.cast.length > 0) setCastString(tmdbMovie.cast.join(', '));
    if (tmdbMovie.genres && tmdbMovie.genres.length > 0) setSelectedGenres(tmdbMovie.genres);
    if (tmdbMovie.category) setCategory(tmdbMovie.category);

    setShowTmdbSearch(false);
    setTmdbSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(language === 'th' ? 'กรุณาระบุชื่อภาพยนตร์' : 'Please specify movie title');
      return;
    }
    if (!poster.trim()) {
      setError(language === 'th' ? 'กรุณาระบุ URL รูปภาพโปสเตอร์' : 'Please specify poster URL');
      return;
    }

    const castArray = castString
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    onSave({
      title: title.trim(),
      titleEn: titleEn.trim() || undefined,
      code: code.trim() || `#${Math.floor(100 + Math.random() * 9000)}`,
      year: Number(year) || new Date().getFullYear(),
      rating: Number(rating) || 7.0,
      poster: poster.trim(),
      backdrop: backdrop.trim() || undefined,
      category,
      genres: selectedGenres.length > 0 ? selectedGenres : [language === 'th' ? 'ทั่วไป' : 'General'],
      quality,
      status,
      duration,
      description: description.trim() || (language === 'th' ? 'ไม่มีเรื่องย่อ' : 'No synopsis available'),
      director: director.trim() || undefined,
      cast: castArray,
      featured,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 fade-in flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#E50914]/20 rounded-lg text-[#E50914]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditMode ? t.movieForm.editTitle : t.movieForm.addTitle}
              </h2>
              <p className="text-xs text-gray-400">
                {isEditMode
                  ? `${language === 'th' ? 'กำลังแก้ไข' : 'Editing'} ${movieToEdit?.title}`
                  : (language === 'th' ? 'กรอกรายละเอียดหรือดึงข้อมูลผ่าน TMDB OpenAPI v3' : 'Fill details or auto-fetch via TMDB OpenAPI v3')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TMDB Quick Fill Banner */}
        <div className="bg-[#0e1626] border-b border-[#0071EB]/20 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-blue-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              {language === 'th' ? (
                <>ต้องการความรวดเร็ว? ค้นหาและดึงข้อมูลภาษาไทยอัตโนมัติจาก <strong>The Movie Database (TMDB)</strong></>
              ) : (
                <>Want speed? Auto-fill movie details with <strong>The Movie Database (TMDB)</strong></>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowTmdbSearch(!showTmdbSearch)}
            className="px-3 py-1 bg-[#0071EB] hover:bg-[#0071EB]/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Database className="w-3.5 h-3.5" />
            <span>
              {showTmdbSearch
                ? (language === 'th' ? 'ซ่อนการค้นหา TMDB' : 'Hide TMDB Search')
                : (language === 'th' ? 'ดึงข้อมูลจาก TMDB' : 'Fetch from TMDB')}
            </span>
          </button>
        </div>

        {/* TMDB Search Panel */}
        {showTmdbSearch && (
          <div className="bg-[#121212] border-b border-white/10 p-4 space-y-3">
            <form onSubmit={handleTmdbSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={tmdbSearchInput}
                  onChange={(e) => setTmdbSearchInput(e.target.value)}
                  placeholder={language === 'th' ? 'พิมพ์ชื่อเรื่องภาษาไทยหรืออังกฤษ (เช่น Avatar, Inside Out 2, หลานม่า)...' : 'Type movie title (e.g., Avatar, Inside Out 2)...'}
                  className="w-full bg-[#1e1e1e] border border-white/15 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0071EB]"
                />
              </div>
              <button
                type="submit"
                disabled={tmdbSearching || !tmdbSearchInput.trim()}
                className="px-4 py-2 bg-[#0071EB] hover:bg-[#0071EB]/90 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${tmdbSearching ? 'animate-spin' : ''}`} />
                <span>{tmdbSearching ? (language === 'th' ? 'กำลังค้นหา...' : 'Searching...') : (language === 'th' ? 'ค้นหา' : 'Search')}</span>
              </button>
            </form>

            {/* Results Preview */}
            {tmdbSearchResults.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-gray-400 font-medium">
                  {language === 'th' ? 'คลิกที่เรื่องที่ต้องการเพื่อกรอกข้อมูลลงในฟอร์มอัตโนมัติ:' : 'Click a title to auto-fill form:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {tmdbSearchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleApplyTmdbMovie(item)}
                      className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-white/5 hover:border-[#0071EB] flex items-center gap-3 cursor-pointer transition"
                    >
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-10 h-14 object-cover rounded bg-black shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white truncate">{item.title}</div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-yellow-400 font-semibold">★ {item.rating}</span>
                          <span>•</span>
                          <span>{item.year}</span>
                        </div>
                        <div className="text-[10px] text-[#0071EB] truncate font-medium">
                          {item.genres?.slice(0, 2).join(', ')}
                        </div>
                      </div>
                      <ArrowDownRight className="w-4 h-4 text-cyan-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Poster & Backdrop Preview */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                {t.movieForm.posterUrl}
              </label>
              <div className="aspect-[2/3] bg-black/60 rounded-xl overflow-hidden border border-white/10 relative group">
                <img
                  src={poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                  alt="Poster Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600';
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                  <button
                    type="button"
                    onClick={handleRandomPoster}
                    className="bg-[#E50914] text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#E50914]/90 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {language === 'th' ? 'สุ่มรูปตัวอย่าง' : 'Random Sample'}
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={poster}
                  onChange={(e) => setPoster(e.target.value)}
                  placeholder="https://... Poster URL"
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#E50914]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">
                  {t.movieForm.backdropUrl}
                </label>
                <input
                  type="text"
                  value={backdrop}
                  onChange={(e) => setBackdrop(e.target.value)}
                  placeholder="https://... Backdrop URL"
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>

            {/* Right Column: Movie Info Fields */}
            <div className="md:col-span-2 space-y-4">
              {/* Title Thai & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {t.movieForm.title} *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น หลานม่า, JOY-The Birth of IVF"
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {t.movieForm.titleEn}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. How to Make Millions Before Grandma Dies"
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Code, Year, Rating */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {t.movieForm.code}
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="#584"
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {t.movieForm.year}
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    min={1950}
                    max={2030}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {t.movieForm.rating} (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Category, Quality, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {t.movieForm.category}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E50914]"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {t.movieForm.quality}
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as MovieQuality)}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="4K">4K Ultra HD</option>
                    <option value="FHD">Full HD 1080p</option>
                    <option value="HD">HD 720p</option>
                    <option value="CAM">CAM / ซูม</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {t.movieForm.status}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MovieStatus)}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="active">{language === 'th' ? 'เผยแพร่ทันที (Active)' : 'Active / Published'}</option>
                    <option value="draft">{language === 'th' ? 'แบบร่าง (Draft)' : 'Draft'}</option>
                    <option value="archived">{language === 'th' ? 'เก็บถาวร (Archived)' : 'Archived'}</option>
                  </select>
                </div>
              </div>

              {/* Genre Selection Chips */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  {t.movieForm.genres}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableGenres.map((g) => {
                    const isSelected = selectedGenres.includes(g);
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => toggleGenre(g)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#E50914] text-white border-[#E50914]'
                            : 'bg-[#0F0F0F] text-gray-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration, Director & Cast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {t.movieForm.duration} / {t.movieForm.director}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="115 min"
                      className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                    <input
                      type="text"
                      value={director}
                      onChange={(e) => setDirector(e.target.value)}
                      placeholder={t.movieForm.director}
                      className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    {t.movieForm.cast}
                  </label>
                  <input
                    type="text"
                    value={castString}
                    onChange={(e) => setCastString(e.target.value)}
                    placeholder="เช่น ณเดชน์ คูกิมิยะ, เดนิส เจลีลชา"
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  {t.movieForm.synopsis}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={language === 'th' ? 'กรอกเนื้อเรื่องย่อของภาพยนตร์โดยสังเขป...' : 'Brief synopsis of the movie...'}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-black text-[#E50914] focus:ring-[#E50914]"
                />
                <label htmlFor="featuredCheck" className="text-xs text-gray-300 cursor-pointer">
                  {language === 'th' ? (
                    <>ตั้งเป็น <strong>"ภาพยนตร์แนะนำหน้าแรก" (Featured)</strong></>
                  ) : (
                    <>Mark as <strong>Featured Movie</strong></>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="bg-[#28A745] hover:bg-[#28A745]/90 text-white font-medium px-5 py-2 rounded-lg text-sm transition shadow-md shadow-[#28A745]/20 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditMode ? t.movieForm.editTitle : t.movieForm.addTitle}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
