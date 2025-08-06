'use client';

import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';

// Import translation files
import enTranslations from './translations/en.json';
import frTranslations from './translations/fr.json';

// Language definitions - only French and English
export const languages = {
  en: 'English',
  fr: 'Français',
};

export type Language = keyof typeof languages;

// Translation data
const translations = {
  en: enTranslations,
  fr: frTranslations,
};

// Context for language state
interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setCurrentLanguage: () => {},
});

// Provider component
export const TolgeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && languages[savedLanguage]) {
        setCurrentLanguage(savedLanguage);
      }
    }
  }, []);

  // Save language to localStorage when it changes
  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage: handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
};

// App Provider (alias for compatibility)
export const TolgeeAppProvider = TolgeeProvider;

// Custom hook for translations
export const useTranslations = () => {
  const { currentLanguage, setCurrentLanguage } = useContext(LanguageContext);

  const t = (key: string, defaultValue?: string) => {
    const translation = translations[currentLanguage][key as keyof typeof translations[typeof currentLanguage]];
    return translation || defaultValue || key;
  };

  const i18n = {
    changeLanguage: (lang: Language) => {
      setCurrentLanguage(lang);
    },
    language: currentLanguage,
  };

  return { t, i18n };
};