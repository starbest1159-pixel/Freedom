import React from 'react';
import { motion } from 'motion/react';
import {
  Film,
  Radio,
  Plus,
  Command,
  Eye,
  Menu,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { AdminMenuTab } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MobileQuickBarProps {
  currentTab: AdminMenuTab;
  onSelectTab: (tab: AdminMenuTab) => void;
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onOpenAddMovie: () => void;
  onOpenPreview: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  onOpenCommandPalette,
  onOpenAddMovie,
  onOpenPreview,
}) => {
  const { language } = useLanguage();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#161616]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Menu / Sidebar trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white active:bg-white/10 transition min-w-[56px] min-h-[44px]"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium leading-none">
            {language === 'th' ? 'เมนู' : 'Menu'}
          </span>
        </button>

        {/* Movies Tab */}
        <button
          onClick={() => onSelectTab('movies')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition min-w-[56px] min-h-[44px] ${
            currentTab === 'movies'
              ? 'text-[#E50914] font-bold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Film className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none">
            {language === 'th' ? 'ภาพยนตร์' : 'Movies'}
          </span>
        </button>

        {/* Center Prominent Add Button */}
        <button
          onClick={onOpenAddMovie}
          className="relative -top-3 w-12 h-12 rounded-full bg-[#E50914] hover:bg-[#b80710] text-white flex items-center justify-center shadow-lg shadow-red-900/50 active:scale-95 transition min-w-[48px] min-h-[48px]"
          title={language === 'th' ? 'เพิ่มภาพยนตร์' : 'Add Movie'}
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Live Sports Tab */}
        <button
          onClick={() => onSelectTab('live-streams')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition min-w-[56px] min-h-[44px] ${
            currentTab === 'live-streams'
              ? 'text-[#E50914] font-bold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Radio className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none">
            {language === 'th' ? 'สตรีมสด' : 'Live'}
          </span>
        </button>

        {/* Command Search / Hotkey trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white active:bg-white/10 transition min-w-[56px] min-h-[44px]"
        >
          <Command className="w-5 h-5 mb-0.5 text-blue-400" />
          <span className="text-[10px] font-medium leading-none">
            {language === 'th' ? 'คำสั่ง' : 'Cmd'}
          </span>
        </button>
      </div>
    </div>
  );
};
