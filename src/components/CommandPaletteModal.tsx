import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Film,
  Plus,
  Tv,
  Layers,
  Tag,
  Image as ImageIcon,
  Users,
  Settings,
  Globe,
  HelpCircle,
  Video,
  Radio,
  Eye,
  RefreshCw,
  X,
  Sparkles,
  Command,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { AdminMenuTab, Movie } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab?: AdminMenuTab;
  onSelectTab: (tab: AdminMenuTab) => void;
  onOpenAddMovie: () => void;
  onOpenApiSync: () => void;
  onOpenPreview: () => void;
  onOpenShortcuts: () => void;
  onToggleDualUser?: () => void;
  onToggleSidebar?: () => void;
  movies: Movie[];
  onPlayMovie: (movie: Movie) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenAddMovie,
  onOpenApiSync,
  onOpenPreview,
  onOpenShortcuts,
  onToggleDualUser,
  onToggleSidebar,
  movies,
  onPlayMovie,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const navItems = [
    { id: 'movies', label: t.sidebar.movies, icon: Film, shortcut: 'Ctrl+1', action: () => onSelectTab('movies') },
    { id: 'live-streams', label: t.sidebar.liveStreams, icon: Radio, shortcut: 'Ctrl+2', action: () => onSelectTab('live-streams') },
    { id: 'categories', label: t.sidebar.categories, icon: Layers, shortcut: 'Ctrl+3', action: () => onSelectTab('categories') },
    { id: 'genres', label: t.sidebar.genres, icon: Tag, shortcut: 'Ctrl+4', action: () => onSelectTab('genres') },
    { id: 'home-banners', label: t.sidebar.homeBanners, icon: ImageIcon, shortcut: 'Ctrl+5', action: () => onSelectTab('home-banners') },
    { id: 'media-library', label: t.sidebar.mediaLibrary, icon: ImageIcon, shortcut: 'Ctrl+6', action: () => onSelectTab('media-library') },
    { id: 'users', label: t.sidebar.users, icon: Users, shortcut: 'Ctrl+7', action: () => onSelectTab('users') },
    { id: 'settings', label: t.sidebar.settings, icon: Settings, shortcut: 'Ctrl+8', action: () => onSelectTab('settings') },
    { id: 'seo', label: t.sidebar.seo, icon: Globe, shortcut: 'Ctrl+9', action: () => onSelectTab('seo') },
  ];

  const quickActions = [
    { id: 'toggle-user', label: language === 'th' ? 'สลับบัญชีผู้ใช้งานทันที (Dual Session: admin ⇄ staff)' : 'Switch Active User Session (admin ⇄ staff)', icon: Users, shortcut: 'Ctrl+U', action: () => onToggleDualUser && onToggleDualUser(), color: 'text-emerald-400' },
    { id: 'add-movie', label: t.movies.addMovieBtn, icon: Plus, shortcut: 'Ctrl+N', action: onOpenAddMovie, color: 'text-emerald-400' },
    { id: 'api-sync', label: t.movies.syncApiBtn, icon: RefreshCw, shortcut: 'Ctrl+I', action: onOpenApiSync, color: 'text-blue-400' },
    { id: 'preview-site', label: t.header.previewSite, icon: Eye, shortcut: 'Ctrl+P', action: onOpenPreview, color: 'text-amber-400' },
    { id: 'switch-lang', label: `${t.header.switchLanguage} (${language.toUpperCase()})`, icon: Globe, shortcut: 'Ctrl+L', action: toggleLanguage, color: 'text-purple-400' },
    { id: 'shortcuts-help', label: language === 'th' ? 'ดูคีย์ลัดทั้งหมด' : 'View Keyboard Shortcuts', icon: HelpCircle, shortcut: 'Ctrl+/', action: onOpenShortcuts, color: 'text-gray-300' },
  ];

  // Filtered movies matching query
  const matchedMovies = query.trim()
    ? movies
        .filter((m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          (m.titleEn && m.titleEn.toLowerCase().includes(query.toLowerCase())) ||
          m.code.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  // Filtered items
  const filteredNav = navItems.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );
  const filteredActions = quickActions.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  const allFilteredItems = [
    ...filteredActions.map((a) => ({ ...a, type: 'action' as const })),
    ...filteredNav.map((n) => ({ ...n, type: 'nav' as const })),
    ...matchedMovies.map((m) => ({
      id: `movie-${m.id}`,
      label: `${m.title} ${m.titleEn ? `(${m.titleEn})` : ''} [${m.code}]`,
      icon: Film,
      shortcut: 'ENTER',
      action: () => onPlayMovie(m),
      type: 'movie' as const,
      badge: m.quality,
    })),
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (allFilteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (allFilteredItems.length || 1)) % (allFilteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = allFilteredItems[selectedIndex];
        if (selected) {
          selected.action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allFilteredItems, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-2xl bg-[#181818] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-[#1F1F1F]">
          <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={language === 'th' ? 'พิมพ์คำสั่ง, เมนู, หรือค้นหาชื่อภาพยนตร์... (ลูกศร ขึ้น/ลง เพื่อเลือก)' : 'Type a command, menu, or search movie...'}
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none"
          />
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <kbd className="px-2 py-1 text-[10px] font-mono bg-white/10 text-gray-300 rounded border border-white/10">ESC</kbd>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {language === 'th' ? 'คำสั่งลัดระบบ (Quick Actions)' : 'Quick Actions'}
              </div>
              <div className="space-y-1 mt-1">
                {filteredActions.map((item) => {
                  const globalIdx = allFilteredItems.findIndex((x) => x.id === item.id);
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition ${
                        isSelected ? 'bg-[#E50914] text-white' : 'hover:bg-white/5 text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : item.color}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <kbd
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isSelected ? 'bg-black/30 text-white border-white/20' : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                      >
                        {item.shortcut}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matched Movies (if searching) */}
          {matchedMovies.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {language === 'th' ? 'ภาพยนตร์ที่ตรงกัน (Movies)' : 'Matched Movies'}
              </div>
              <div className="space-y-1 mt-1">
                {matchedMovies.map((movie) => {
                  const globalIdx = allFilteredItems.findIndex((x) => x.id === `movie-${movie.id}`);
                  const isSelected = selectedIndex === globalIdx;
                  return (
                    <button
                      key={movie.id}
                      onClick={() => {
                        onPlayMovie(movie);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition ${
                        isSelected ? 'bg-[#E50914] text-white' : 'hover:bg-white/5 text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Film className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="truncate">
                          <span className="text-sm font-medium">{movie.titleTh}</span>
                          <span className="text-xs text-gray-400 ml-2">({movie.titleEn})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-emerald-400">
                          {movie.quality}
                        </span>
                        <span className="text-[10px] text-gray-400">{movie.code}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Menus */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {language === 'th' ? 'สลับหน้าเมนู (Navigation)' : 'Navigation'}
              </div>
              <div className="space-y-1 mt-1">
                {filteredNav.map((item) => {
                  const globalIdx = allFilteredItems.findIndex((x) => x.id === item.id);
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition ${
                        isSelected ? 'bg-[#E50914] text-white' : 'hover:bg-white/5 text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <kbd
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isSelected ? 'bg-black/30 text-white border-white/20' : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                      >
                        {item.shortcut}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {allFilteredItems.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm">{language === 'th' ? 'ไม่พบคำสั่งหรือภาพยนตร์ที่ค้นหา' : 'No commands or movies found'}</p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2.5 bg-[#121212] border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">↓</kbd>
              <span>{language === 'th' ? 'เลื่อน' : 'Navigate'}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">ENTER</kbd>
              <span>{language === 'th' ? 'เลือก' : 'Select'}</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>ENCRYPTED COMMAND DISPATCH</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
