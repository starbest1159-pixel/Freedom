import React, { useState } from 'react';
import {
  Film,
  PlusCircle,
  FolderOpen,
  ListOrdered,
  LayoutTemplate,
  Network,
  HelpCircle,
  FileText,
  PlaySquare,
  Monitor,
  Image as ImageIcon,
  Users,
  Settings,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Shield,
  Radio,
  ArrowLeftRight,
  UserCheck,
  UserPlus,
  Layers,
} from 'lucide-react';
import { AdminMenuTab, User } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { FreedomLogo } from './FreedomLogo';

interface SidebarProps {
  currentTab: AdminMenuTab;
  onSelectTab: (tab: AdminMenuTab) => void;
  currentUser: User | null;
  dualSessions: User[];
  onSwitchActiveUser: (userId: string) => void;
  onToggleDualUser: () => void;
  onAddSecondUser?: () => void;
  onLogoutSession: (userId: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAddModal: () => void;
  onOpenShortcuts?: () => void;
  onOpenCommandPalette?: () => void;
}

interface MenuItem {
  id: AdminMenuTab;
  labelKey: keyof typeof import('../locales/translations').translations['th']['nav'];
  icon: React.ElementType;
  badge?: string | number;
  shortcut?: string;
  action?: 'tab' | 'modal';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  dualSessions,
  onSwitchActiveUser,
  onToggleDualUser,
  onAddSecondUser,
  onLogoutSession,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  onOpenAddModal,
  onOpenShortcuts,
  onOpenCommandPalette,
}) => {
  const { t, language } = useLanguage();
  const [showSessionMenu, setShowSessionMenu] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'movies', labelKey: 'movies', icon: Film, shortcut: 'Ctrl+1' },
    { id: 'add-movie', labelKey: 'addMovie', icon: PlusCircle, action: 'modal', shortcut: 'Ctrl+N' },
    { id: 'live-streams', labelKey: 'liveStreams', icon: Radio, badge: 'LIVE', shortcut: 'Ctrl+2' },
    { id: 'categories', labelKey: 'categories', icon: FolderOpen, shortcut: 'Ctrl+3' },
    { id: 'genres', labelKey: 'genres', icon: ListOrdered, shortcut: 'Ctrl+4' },
    { id: 'header-menu', labelKey: 'headerMenu', icon: LayoutTemplate },
    { id: 'footer-menu', labelKey: 'footerMenu', icon: Network },
    { id: 'faqs', labelKey: 'faqs', icon: HelpCircle },
    { id: 'seo', labelKey: 'seo', icon: FileText, shortcut: 'Ctrl+9' },
    { id: 'video-ads', labelKey: 'videoAds', icon: PlaySquare },
    { id: 'banner-templates', labelKey: 'bannerTemplates', icon: Monitor },
    { id: 'home-banners', labelKey: 'homeBanners', icon: ImageIcon, shortcut: 'Ctrl+5' },
    { id: 'users', labelKey: 'users', icon: Users, shortcut: 'Ctrl+7' },
    { id: 'settings', labelKey: 'settings', icon: Settings, shortcut: 'Ctrl+8' },
    { id: 'media-library', labelKey: 'mediaLibrary', icon: ImagePlus, badge: 1, shortcut: 'Ctrl+6' },
  ];

  const standbyUser = dualSessions.find((u) => u.id !== currentUser?.id) || null;

  return (
    <aside
      className={`bg-[#1A1A1A] border-r border-white/5 flex flex-col transition-all duration-300 z-30 shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Logo & Collapse Toggle */}
      <div className="px-3.5 py-3.5 flex items-center justify-between border-b border-white/5 min-h-[65px]">
        <div className="flex items-center gap-2 overflow-hidden">
          <FreedomLogo
            size={isCollapsed ? 'sm' : 'md'}
            variant={isCollapsed ? 'icon-only' : 'full'}
            showAdminBadge={!isCollapsed}
          />
        </div>

        <button
          onClick={onToggleCollapse}
          className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition shrink-0 cursor-pointer"
          title={isCollapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id && item.id !== 'add-movie';
          const label = (t.nav[item.labelKey] as string) || item.labelKey;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'add-movie') {
                  onOpenAddModal();
                } else {
                  onSelectTab(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer relative group text-left ${
                isActive
                  ? 'bg-[#E50914]/20 text-white font-medium shadow-sm shadow-[#E50914]/10 border border-[#E50914]/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
              title={isCollapsed ? label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-[#E50914]' : 'text-gray-400 group-hover:text-white'
                }`}
              />

              {!isCollapsed && <span className="truncate flex-1">{label}</span>}

              {item.shortcut && !isCollapsed && !item.badge && (
                <span className="text-[10px] font-mono text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                  {item.shortcut}
                </span>
              )}

              {item.badge !== undefined && !isCollapsed && (
                <span className="bg-[#E50914] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#242424] text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-white/10 flex items-center gap-1.5">
                  <span>{label}</span>
                  {item.shortcut && <span className="text-[10px] font-mono text-gray-400">({item.shortcut})</span>}
                  {item.badge && <span className="text-[#E50914] font-bold">({item.badge})</span>}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Command Palette Button */}
      <div className="px-2 py-1.5 border-t border-white/5">
        <button
          onClick={onOpenCommandPalette}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition border border-white/5 cursor-pointer ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title={isCollapsed ? 'Command Palette (Ctrl+K)' : undefined}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-400">⌘</span>
            {!isCollapsed && <span>Command Palette</span>}
          </div>
          {!isCollapsed && (
            <kbd className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
              Ctrl+K
            </kbd>
          )}
        </button>
      </div>

      {/* Concurrent Dual-User Session Section & Language Switcher */}
      <div className="p-3 border-t border-white/5 bg-[#141414]/80 space-y-2.5">
        {/* Language switcher */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-gray-400 font-medium">
              {language === 'th' ? 'ภาษาของระบบ' : 'System Language'}
            </span>
            <LanguageSwitcher variant="pill" />
          </div>
        ) : (
          <div className="flex justify-center">
            <LanguageSwitcher variant="compact" />
          </div>
        )}

        {/* DUAL-USER SESSION MANAGER */}
        {isCollapsed ? (
          /* Collapsed View: Dual User Stacked Pill & Quick Toggle */
          <div className="relative group flex flex-col items-center">
            <button
              onClick={onToggleDualUser}
              className="relative p-1 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer border border-white/10 flex items-center justify-center group"
              title={
                standbyUser
                  ? `Active: ${currentUser?.username} (${currentUser?.role}) | Standby: ${standbyUser.username} (Click to toggle Ctrl+U)`
                  : `Active: ${currentUser?.username}`
              }
            >
              {/* Stacked avatars */}
              <div className="relative w-9 h-9">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentUser?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#E50914] shadow-md"
                />
                {standbyUser && (
                  <img
                    src={standbyUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                    alt={standbyUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#1A1A1A] absolute -bottom-1 -right-1 opacity-85"
                  />
                )}
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#1A1A1A]" />
              </div>
            </button>

            {/* Collapsed Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-2 bg-[#222] text-white text-xs rounded-lg shadow-2xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-white/10">
              <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Dual-Session Active (2/2)</span>
              </div>
              <div className="text-gray-300 mt-1 font-mono text-[11px]">
                Active: <span className="text-white font-bold">{currentUser?.username}</span> ({currentUser?.role})
              </div>
              {standbyUser && (
                <div className="text-gray-400 font-mono text-[11px]">
                  Standby: <span className="text-gray-200">{standbyUser.username}</span> ({standbyUser.role})
                </div>
              )}
              <div className="text-[10px] text-gray-500 mt-1">คลิกเพื่อสลับ (Ctrl+U)</div>
            </div>
          </div>
        ) : (
          /* Expanded View: Full Dual-Session Interactive Widget */
          <div className="bg-[#1D1D1D] rounded-xl p-2.5 border border-white/10 space-y-2">
            {/* Header: Dual-Session Mode Status & Fast Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  Dual Session ({dualSessions.length}/2)
                </span>
              </div>
              {standbyUser && (
                <button
                  onClick={onToggleDualUser}
                  className="text-[10px] bg-white/10 hover:bg-[#E50914] text-gray-200 hover:text-white px-2 py-0.5 rounded transition flex items-center gap-1 font-mono cursor-pointer"
                  title="สลับบัญชีผู้ใช้งาน (Ctrl+U)"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>Ctrl+U</span>
                </button>
              )}
            </div>

            {/* Dual Account Cards List */}
            <div className="space-y-1.5">
              {dualSessions.map((session) => {
                const isActive = session.id === currentUser?.id;

                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      if (!isActive) onSwitchActiveUser(session.id);
                    }}
                    className={`p-1.5 rounded-lg flex items-center justify-between gap-2 transition cursor-pointer ${
                      isActive
                        ? 'bg-[#E50914]/15 border border-[#E50914]/40 text-white shadow-sm'
                        : 'bg-[#141414] border border-white/5 text-gray-400 hover:text-gray-200 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={session.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={session.name}
                          className={`w-7 h-7 rounded-full object-cover border ${
                            isActive ? 'border-[#E50914]' : 'border-white/10 opacity-70'
                          }`}
                        />
                        {isActive && (
                          <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-[#1A1A1A]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate flex items-center gap-1 text-white">
                          <span>{session.username}</span>
                          {session.role === 'admin' ? (
                            <ShieldCheck className="w-3 h-3 text-[#E50914] shrink-0" />
                          ) : (
                            <Shield className="w-3 h-3 text-blue-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">
                          {session.role === 'admin' ? 'Super Admin' : 'Staff Editor'}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isActive ? (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                          ACTIVE
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSwitchActiveUser(session.id);
                          }}
                          className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded transition cursor-pointer"
                        >
                          {language === 'th' ? 'สลับ' : 'Switch'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Logout Options Toolbar */}
            <div className="pt-1 flex items-center justify-between text-[11px] border-t border-white/5">
              <button
                onClick={() => currentUser && onLogoutSession(currentUser.id)}
                className="text-gray-400 hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                title="ออกจากระบบเฉพาะบัญชีที่กำลังใช้งานนี้"
              >
                <LogOut className="w-3 h-3" />
                <span>{language === 'th' ? 'ออกบัญชีนี้' : 'Sign out'}</span>
              </button>

              <button
                onClick={onLogout}
                className="text-gray-500 hover:text-red-400 transition cursor-pointer"
                title="ออกจากระบบทั้ง 2 บัญชีพร้อมกัน"
              >
                {language === 'th' ? 'ออกจากระบบทั้งหมด' : 'Sign out all'}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
