'use client';

import React, { ReactNode } from 'react';

// Language definitions
export const languages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

export type Language = keyof typeof languages;

// Simple Provider component that just passes through children
export const TolgeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// App Provider (alias for compatibility)
export const TolgeeAppProvider = TolgeeProvider;

// Custom hook for translations
export const useTranslations = () => {
  const [currentLanguage, setCurrentLanguage] = React.useState<Language>('en');

  const t = (key: string, defaultValue?: string, params?: Record<string, any>) => {
    // Simple fallback translation function - return default value if provided, otherwise key
    return defaultValue || key;
  };

  const i18n = {
    changeLanguage: (lang: Language) => {
      setCurrentLanguage(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
      }
    },
    language: currentLanguage,
  };

  return { t, i18n };
};