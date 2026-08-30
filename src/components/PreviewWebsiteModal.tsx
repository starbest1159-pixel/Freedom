import React, { useState } from 'react';
import {
  Play,
  Info,
  Star,
  Search,
  ChevronLeft,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Clock,
  Sparkles,
  Flame,
  Check,
  Plus,
  Shield,
  Layers,
  Radio,
  Trophy,
  Users,
  Server,
  Activity,
  MapPin,
  Bell,
} from 'lucide-react';
import { Movie, Banner, LiveStream, LiveNotification } from '../types';
import { INITIAL_LIVE_STREAMS } from '../data/initialData';
import { LiveStreamPlayerModal } from './LiveStreamPlayerModal';
import { MovieCinemaPlayerModal } from './MovieCinemaPlayerModal';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { FreedomLogo } from './FreedomLogo';

interface PreviewWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  banners: Banner[];
  liveStreams?: LiveStream[];
  notifications?: LiveNotification[];
}

export const PreviewWebsiteModal: React.FC<PreviewWebsiteModalProps> = ({
  isOpen,
  onClose,
  movies,
  banners,
  liveStreams = INITIAL_LIVE_STREAMS,
  notifications = [],
}) => {
  const { t, language } = useLanguage();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isMovieDetailOpen, setIsMovieDetailOpen] = useState(false);
  const [isCinemaPlayerOpen, setIsCinemaPlayerOpen] = useState(false);
  const [movieForCinema, setMovieForCinema] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [myList, setMyList] = useState<string[]>([]);
  const [selectedLiveStream, setSelectedLiveStream] = useState<LiveStream | null>(null);
  const [isLivePlayerOpen, setIsLivePlayerOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [bannerAlertDismissed, setBannerAlertDismissed] = useState(false);

  if (!isOpen) return null;

  const heroMovie = movies.find((m) => m.featured) || movies[0] || null;

  const getMovieTitle = (movie: Movie) => {
    if (language === 'en' && movie.titleEn) {
      return movie.titleEn;
    }
    return movie.title;
  };

  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.titleEn && m.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategoryFilter === 'all' || activeCategoryFilter === 'live' || m.category === activeCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const toggleMyList = (id: string) => {
    if (myList.includes(id)) {
      setMyList(myList.filter((item) => item !== id));
    } else {
      setMyList([...myList, id]);
    }
  };

  const handlePlayMovie = (movie: Movie) => {
    setMovieForCinema(movie);
    setIsCinemaPlayerOpen(true);
    setIsMovieDetailOpen(false);
  };

  const handleOpenMovieDetail = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsMovieDetailOpen(true);
  };

  const handleOpenLiveStream = (stream: LiveStream) => {
    setSelectedLiveStream(stream);
    setIsLivePlayerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0F0F] text-white flex flex-col overflow-y-auto selection:bg-[#E50914] selection:text-white">
      {/* Top Admin Notice Bar */}
      <header className="sticky top-0 z-40 bg-[#1A1A1A]/95 backdrop-blur-md px-4 py-2.5 border-b border-white/10 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <FreedomLogo size="xs" variant="compact" showAdminBadge={false} />
          <span className="text-xs bg-white/10 text-emerald-400 font-medium px-2.5 py-0.5 rounded-full border border-emerald-400/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {language === 'th' ? 'มุมมองตัวอย่างเว็บไซต์ (Live Preview)' : 'Live Website Preview'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'th' ? 'กลับสู่หน้าแอดมิน' : 'Back to Admin'}</span>
          </button>
        </div>
      </header>

      {/* Website Navigation */}
      <nav className="px-6 md:px-12 py-4 flex items-center justify-between border-b border-white/5 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <FreedomLogo size="sm" variant="compact" showAdminBadge={false} />
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`hover:text-white transition cursor-pointer ${
                activeCategoryFilter === 'all' ? 'text-white font-semibold' : ''
              }`}
            >
              {t.preview.navHome}
            </button>
            <button
              onClick={() => setActiveCategoryFilter('ภาพยนตร์ไทย')}
              className={`hover:text-white transition cursor-pointer ${
                activeCategoryFilter === 'ภาพยนตร์ไทย' ? 'text-white font-semibold' : ''
              }`}
            >
              {language === 'th' ? 'หนังไทย' : 'Thai Movies'}
            </button>
            <button
              onClick={() => setActiveCategoryFilter('ภาพยนตร์แอ็คชั่น')}
              className={`hover:text-white transition cursor-pointer ${
                activeCategoryFilter === 'ภาพยนตร์แอ็คชั่น' ? 'text-white font-semibold' : ''
              }`}
            >
              {language === 'th' ? 'ภาพยนตร์แอ็คชั่น' : 'Action'}
            </button>
            <button
              onClick={() => setActiveCategoryFilter('ภาพยนตร์สยองขวัญ')}
              className={`hover:text-white transition cursor-pointer ${
                activeCategoryFilter === 'ภาพยนตร์สยองขวัญ' ? 'text-white font-semibold' : ''
              }`}
            >
              {language === 'th' ? 'สยองขวัญ' : 'Horror'}
            </button>
            <button
              onClick={() => setActiveCategoryFilter('ภาพยนตร์แอนิเมชัน')}
              className={`hover:text-white transition cursor-pointer ${
                activeCategoryFilter === 'ภาพยนตร์แอนิเมชัน' ? 'text-white font-semibold' : ''
              }`}
            >
              {language === 'th' ? 'แอนิเมชัน' : 'Animation'}
            </button>
            <button
              onClick={() => setActiveCategoryFilter('live')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeCategoryFilter === 'live'
                  ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/40'
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              }`}
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{t.preview.navLiveSports}</span>
            </button>
          </div>
        </div>

        {/* Search bar, Notification Bell & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.preview.searchInCatalog}
              className="bg-[#242424] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#E50914] w-36 sm:w-56 transition-all"
            />
          </div>

          {/* Live Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-2 rounded-full bg-[#242424] hover:bg-white/10 text-gray-300 hover:text-white transition border border-white/10 cursor-pointer"
              title="Live Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E50914] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1F1F1F] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden text-left">
                <div className="p-3 bg-[#171717] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#E50914]" />
                    <span className="font-bold text-xs text-white">{t.header.notifications}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {notifications.length} {t.common.items}
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400">
                      {language === 'th' ? 'ยังไม่มีการแจ้งเตือนใหม่ในขณะนี้' : 'No new notifications at this time.'}
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const matchedStream = liveStreams.find((s) => s.id === notif.streamId);
                      return (
                        <div
                          key={notif.id}
                          className="p-3.5 hover:bg-white/5 transition flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="bg-red-500/20 text-red-400 text-[10px] font-black px-2 py-0.5 rounded border border-red-500/30">
                              {notif.badge || 'LIVE MATCH'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {notif.sentAt ? new Date(notif.sentAt).toLocaleTimeString(language === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </span>
                          </div>
                          <div className="font-bold text-xs text-white">{notif.title}</div>
                          <p className="text-[11px] text-gray-300 leading-relaxed">{notif.message}</p>

                          {matchedStream && (
                            <button
                              onClick={() => {
                                setSelectedLiveStream(matchedStream);
                                setIsLivePlayerOpen(true);
                                setIsNotifDropdownOpen(false);
                              }}
                              className="mt-1 px-3 py-1.5 bg-[#E50914] hover:bg-[#E50914]/90 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer self-start"
                            >
                              <Play className="w-3 h-3 fill-white" />
                              <span>{language === 'th' ? 'รับชมแมตช์นี้ทันที' : 'Watch Match Now'}</span>
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </nav>

      {/* Floating In-App Live Notification Banner */}
      {!bannerAlertDismissed && notifications.length > 0 && (
        <div className="mx-4 sm:mx-8 mt-3 bg-gradient-to-r from-red-950/80 via-black/90 to-[#1F1F1F] border border-red-500/40 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 animate-pulse flex-shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#E50914] text-white text-[10px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider">
                  {notifications[0].badge || 'LIVE NOTIFICATION'}
                </span>
                <span className="font-bold text-xs sm:text-sm text-white">
                  {notifications[0].title}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 line-clamp-1">
                {notifications[0].message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {notifications[0].streamId && (
              <button
                onClick={() => {
                  const targetStream =
                    liveStreams.find((s) => s.id === notifications[0].streamId) ||
                    liveStreams[0];
                  if (targetStream) {
                    setSelectedLiveStream(targetStream);
                    setIsLivePlayerOpen(true);
                  }
                }}
                className="px-3.5 py-1.5 bg-[#E50914] hover:bg-[#E50914]/90 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-lg cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{language === 'th' ? 'ชมสดเลย' : 'Watch Live'}</span>
              </button>
            )}
            <button
              onClick={() => setBannerAlertDismissed(true)}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner Showcase */}
      {heroMovie && !searchQuery && activeCategoryFilter === 'all' && (
        <section className="relative h-[65vh] min-h-[420px] max-h-[600px] w-full overflow-hidden">
          {/* Backdrop Image with gradient overlays */}
          <img
            src={heroMovie.backdrop || heroMovie.poster}
            alt={getMovieTitle(heroMovie)}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-12 left-6 md:left-12 max-w-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#E50914] text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                {language === 'th' ? 'มาแรงอันดับ 1' : 'TOP #1 TODAY'}
              </span>
              <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-xs font-semibold text-emerald-400 border border-emerald-400/20">
                {heroMovie.quality} Ultra HD
              </span>
              <span className="flex items-center gap-1 text-xs text-yellow-400 bg-black/60 px-2 py-0.5 rounded font-bold">
                <Star className="w-3 h-3 fill-yellow-400" />
                {heroMovie.rating.toFixed(1)}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {getMovieTitle(heroMovie)}
            </h1>

            <p className="text-sm md:text-base text-gray-300 line-clamp-3 leading-relaxed">
              {heroMovie.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handlePlayMovie(heroMovie)}
                className="bg-white text-black hover:bg-white/90 font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm transition shadow-lg hover:scale-105 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>{t.preview.heroWatchNow}</span>
              </button>

              <button
                onClick={() => setSelectedMovie(heroMovie)}
                className="bg-white/20 hover:bg-white/30 text-white font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm backdrop-blur-md transition cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span>{t.preview.heroMoreInfo}</span>
              </button>

              <button
                onClick={() => toggleMyList(heroMovie.id)}
                className="p-2.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/20 text-white transition cursor-pointer"
                title="Add to watchlist"
              >
                {myList.includes(heroMovie.id) ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="px-6 md:px-12 py-8 space-y-10 flex-1">
        {/* 🔴 Featured Live Stream Matches Section (Premier League, UCL, etc.) */}
        {(activeCategoryFilter === 'all' || activeCategoryFilter === 'live') && !searchQuery && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-[#E50914] animate-pulse" />
                  <span>{t.preview.liveSportsTitle}</span>
                  <span className="text-xs bg-red-600/90 text-white font-bold px-2 py-0.5 rounded-full animate-pulse ml-1">
                    LIVE NOW
                  </span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {language === 'th' ? 'สัญญาณสด คมชัดระดับ 4K HDR เสียงพากย์ไทย พร้อมห้องแชทสด Real-time' : '4K HDR Live Broadcast with multi-server and live interactive chat.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-gray-400">
                  {language === 'th' ? `กำลังถ่ายทอดสด ${liveStreams.filter((s) => s.status === 'live').length} คู่` : `${liveStreams.filter((s) => s.status === 'live').length} live matches now`}
                </span>
              </div>
            </div>

            {/* Live Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveStreams.map((stream) => {
                const isLive = stream.status === 'live';
                return (
                  <div
                    key={stream.id}
                    onClick={() => handleOpenLiveStream(stream)}
                    className="group bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 hover:border-red-500/50 rounded-2xl p-4 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-500/10 cursor-pointer flex flex-col justify-between"
                  >
                    {/* Top League & Status */}
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-white/5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-400">
                        <Trophy className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[180px]">{stream.league}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1 ${
                          isLive
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-sky-500/20 text-sky-400'
                        }`}
                      >
                        {isLive ? '🔴 LIVE' : (language === 'th' ? '⏳ เร็วๆ นี้' : '⏳ Upcoming')}
                      </span>
                    </div>

                    {/* Match Score & Teams */}
                    <div className="py-4 flex items-center justify-between">
                      {/* Home */}
                      <div className="flex flex-col items-center text-center flex-1">
                        <div className="w-12 h-12 rounded-full bg-white/5 p-1 border border-white/10 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                          <img
                            src={stream.homeTeam.logo}
                            alt={stream.homeTeam.name}
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                        <span className="font-bold text-xs text-white truncate w-full">
                          {stream.homeTeam.name}
                        </span>
                      </div>

                      {/* Score / Time */}
                      <div className="flex flex-col items-center px-3">
                        {isLive ? (
                          <>
                            <div className="text-xl font-black text-white font-mono tracking-wider">
                              {stream.homeTeam.score ?? 0} - {stream.awayTeam.score ?? 0}
                            </div>
                            <span className="text-[10px] text-amber-400 font-bold bg-white/5 px-2 py-0.5 rounded-full mt-1">
                              {stream.currentMinute || "75'"}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-bold text-gray-400">VS</span>
                            <span className="text-[11px] font-semibold text-sky-400 mt-1">
                              {stream.matchTime}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Away */}
                      <div className="flex flex-col items-center text-center flex-1">
                        <div className="w-12 h-12 rounded-full bg-white/5 p-1 border border-white/10 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                          <img
                            src={stream.awayTeam.logo}
                            alt={stream.awayTeam.name}
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                        <span className="font-bold text-xs text-white truncate w-full">
                          {stream.awayTeam.name}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Metadata & Action Button */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Users className="w-3.5 h-3.5" />
                        <span>{(stream.currentViewers || 0).toLocaleString()} {language === 'th' ? 'กำลังดู' : 'watching'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-white font-bold group-hover:text-[#E50914] transition-colors">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isLive ? (language === 'th' ? 'คลิกเพื่อรับชมสด' : 'Watch Live') : (language === 'th' ? 'ดูรายละเอียด' : 'Details')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section Header */}
        {activeCategoryFilter !== 'live' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#E50914]" />
                  {searchQuery
                    ? `${language === 'th' ? 'ผลการค้นหาสำหรับ' : 'Search results for'} "${searchQuery}"`
                    : activeCategoryFilter === 'all'
                    ? t.preview.featuredMovies
                    : activeCategoryFilter}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {language === 'th' ? `รวม ${filteredMovies.length} เรื่องที่พร้อมสตรีมในระบบ` : `Total ${filteredMovies.length} titles available`}
                </p>
              </div>
            </div>

            {/* Movie Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handlePlayMovie(movie)}
                  className="group relative rounded-xl overflow-hidden bg-[#1A1A1A] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#E50914]/20 border border-white/5"
                >
                  {/* Poster */}
                  <div className="aspect-[2/3] relative overflow-hidden bg-black/40">
                    <img
                      src={movie.poster}
                      alt={getMovieTitle(movie)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold">
                      {movie.year}
                    </div>

                    <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 text-yellow-400">
                      <Star className="w-3 h-3 fill-current" />
                      {movie.rating.toFixed(1)}
                    </div>

                    <div className="absolute bottom-2 left-2 bg-[#E50914]/90 px-1.5 py-0.5 rounded text-[10px] font-extrabold text-white">
                      {movie.quality}
                    </div>

                    {/* Hover Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 text-center">
                      <div className="w-11 h-11 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">{t.common.playNow}</span>
                    </div>
                  </div>

                  {/* Card Meta */}
                  <div className="p-3">
                    <h3 className="font-semibold text-xs sm:text-sm truncate text-white group-hover:text-[#E50914] transition-colors">
                      {getMovieTitle(movie)}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                      <span>{movie.duration || `115 ${t.common.minutes}`}</span>
                      <span className="truncate max-w-[80px]">{movie.genres[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Movie Details Modal */}
      {isMovieDetailOpen && selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl fade-in relative my-8">
            {/* Close Modal Button */}
            <button
              onClick={() => {
                setSelectedMovie(null);
                setIsMovieDetailOpen(false);
              }}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition border border-white/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Backdrop Header with Play Button */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedMovie.backdrop || selectedMovie.poster}
                alt={getMovieTitle(selectedMovie)}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/50" />
              <button
                onClick={() => handlePlayMovie(selectedMovie)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#E50914] hover:bg-[#E50914]/90 text-white flex items-center justify-center shadow-2xl transition hover:scale-110 cursor-pointer"
                title="Play Movie"
              >
                <Play className="w-7 h-7 fill-white ml-1" />
              </button>
            </div>

            {/* Info Body */}
            <div className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedMovie.title}</h2>
                  {selectedMovie.titleEn && (
                    <p className="text-sm text-gray-400">{selectedMovie.titleEn}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-yellow-500/30">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    {selectedMovie.rating.toFixed(1)} / 10
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded text-xs font-bold border border-emerald-500/30">
                    {selectedMovie.quality}
                  </span>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
                <span className="font-semibold text-white">{t.common.year} {selectedMovie.year}</span>
                <span>•</span>
                <span>{selectedMovie.duration || `120 ${t.common.minutes}`}</span>
                <span>•</span>
                <span className="text-gray-400">{t.movieForm.code} {selectedMovie.code}</span>
                <span>•</span>
                <div className="flex gap-1.5">
                  {selectedMovie.genres.map((g) => (
                    <span key={g} className="bg-white/10 px-2 py-0.5 rounded text-[11px]">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Synopsis */}
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedMovie.description}
              </p>

              {/* Cast & Director */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-400 border-t border-white/10 pt-4">
                {selectedMovie.director && (
                  <div>
                    <span className="text-gray-500">{t.common.director}:</span>{' '}
                    <span className="text-white">{selectedMovie.director}</span>
                  </div>
                )}
                {selectedMovie.cast && selectedMovie.cast.length > 0 && (
                  <div>
                    <span className="text-gray-500">{t.common.cast}:</span>{' '}
                    <span className="text-white">{selectedMovie.cast.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => toggleMyList(selectedMovie.id)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  {myList.includes(selectedMovie.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'th' ? 'อยู่ในรายการโปรดแล้ว' : 'In Watchlist'}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'th' ? 'เพิ่มในรายการโปรด' : 'Add to Watchlist'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handlePlayMovie(selectedMovie)}
                  className="bg-[#E50914] hover:bg-[#E50914]/90 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-lg cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{t.preview.playerCinemaTitle}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Cinema Interactive Full Player Modal */}
      <MovieCinemaPlayerModal
        isOpen={isCinemaPlayerOpen}
        onClose={() => {
          setIsCinemaPlayerOpen(false);
          setMovieForCinema(null);
        }}
        movie={movieForCinema}
        allMovies={movies}
        onSelectOtherMovie={(m) => setMovieForCinema(m)}
      />

      {/* Live Stream Full Player Modal */}
      <LiveStreamPlayerModal
        isOpen={isLivePlayerOpen}
        onClose={() => {
          setIsLivePlayerOpen(false);
          setSelectedLiveStream(null);
        }}
        stream={selectedLiveStream}
        otherStreams={liveStreams}
        onSelectOtherStream={(stream) => setSelectedLiveStream(stream)}
      />

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 bg-[#141414] border-t border-white/5 text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          {t.preview.footerCopyright}
        </div>
        <div className="flex items-center gap-4">
          <span>{language === 'th' ? 'ข้อกำหนดการใช้งาน' : 'Terms of Service'}</span>
          <span>{language === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}</span>
          <span>{language === 'th' ? 'ศูนย์ช่วยเหลือ' : 'Help Center'}</span>
        </div>
      </footer>
    </div>
  );
};
