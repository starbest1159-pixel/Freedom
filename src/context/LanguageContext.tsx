import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, translations } from '../locales/translations';

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isThai: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('movieflix_lang');
      if (saved === 'th' || saved === 'en') {
        return saved;
      }
    } catch (e) {}
    return 'th'; // Default Thai
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('movieflix_lang', lang);
      document.documentElement.lang = lang;
    } catch (e) {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch (e) {}
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: translations[language],
        setLanguage,
        toggleLanguage,
        isThai: language === 'th',
        isEnglish: language === 'en',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
