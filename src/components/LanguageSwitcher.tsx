import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'compact' | 'dropdown' | 'icon';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'pill',
  className = '',
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#242424] hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition cursor-pointer ${className}`}
        title={t.header.switchLanguage}
      >
        <Globe className="w-3.5 h-3.5 text-gray-400" />
        <span className="uppercase tracking-wider font-mono">{language === 'th' ? 'TH' : 'EN'}</span>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <div
        className={`inline-flex items-center bg-[#1A1A1A] p-1 rounded-xl border border-white/10 shadow-inner ${className}`}
        role="group"
        aria-label="Language Selector"
      >
        <button
          type="button"
          onClick={() => setLanguage('th')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
            language === 'th'
              ? 'bg-[#E50914] text-white shadow-sm font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="ภาษาไทย (Thai)"
        >
          <span>ไทย</span>
        </button>

        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
            language === 'en'
              ? 'bg-[#E50914] text-white shadow-sm font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="English (US)"
        >
          <span>EN</span>
        </button>
      </div>
    );
  }

  // Default button with Globe icon
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-gray-400" />
      <div className="inline-flex rounded-lg bg-[#242424] p-0.5 border border-white/10">
        <button
          onClick={() => setLanguage('th')}
          className={`px-2 py-1 text-xs rounded-md transition font-medium cursor-pointer ${
            language === 'th' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          TH
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 text-xs rounded-md transition font-medium cursor-pointer ${
            language === 'en' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
};
