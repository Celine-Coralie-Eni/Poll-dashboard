"use client";

import React from 'react';

// Available languages (only include languages with translation files)
export const languages = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

export type Language = keyof typeof languages;

// Tolgee configuration
export const tolgeeConfig = {
  apiKey: process.env.NEXT_PUBLIC_TOLGEE_API_KEY,
  apiUrl: process.env.NEXT_PUBLIC_TOLGEE_API_URL || "https://app.tolgee.io",
  defaultLanguage: "en",
  fallbackLanguage: "en",
};

// Custom useTranslations hook that loads from static JSON files
export function useTranslations() {
  const [translations, setTranslations] = React.useState<Record<string, any>>({});
  const [currentLanguage, setCurrentLanguage] = React.useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('poll-dashboard-language');
      return saved && saved in languages ? saved : 'en';
    }
    return 'en';
  });

  React.useEffect(() => {
    // Load translations from static files
    const loadTranslations = async () => {
      try {
        // Use a more explicit import to avoid webpack issues
        let translationModule;
        switch (currentLanguage) {
          case 'en':
            translationModule = await import('../public/locales/en.json');
            break;
          case 'es':
            translationModule = await import('../public/locales/es.json');
            break;
          case 'fr':
            translationModule = await import('../public/locales/fr.json');
            break;
          case 'de':
            translationModule = await import('../public/locales/de.json');
            break;
          default:
            translationModule = await import('../public/locales/en.json');
        }
        setTranslations(translationModule.default || translationModule);
      } catch (error) {
        console.warn(`Failed to load translations for ${currentLanguage}, falling back to English`);
        try {
          const fallbackModule = await import('../public/locales/en.json');
          setTranslations(fallbackModule.default || fallbackModule);
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
          // Set empty translations as last resort
          setTranslations({});
        }
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  const t = (key: string, parameters?: Record<string, any>): string => {
    // Handle nested keys (e.g., "auth.loginTitle")
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to key if translation not found
        return key;
      }
    }
    
    if (typeof value === 'string') {
      // Simple parameter replacement if needed
      if (parameters) {
        return value.replace(/\{\{(\w+)\}\}/g, (match: string, param: string) => {
          return parameters[param] || match;
        });
      }
      return value;
    }
    
    return key;
  };

  return {
    t,
    i18n: {
      changeLanguage: (lang: string) => {
        if (lang in languages) {
          setCurrentLanguage(lang);
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('poll-dashboard-language', lang);
          }
        }
      },
      language: currentLanguage,
    },
  };
}

// Simple Tolgee Provider component
export function TolgeeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Legacy alias
export function TolgeeAppProvider({ children }: { children: React.ReactNode }) {
  return <TolgeeProvider>{children}</TolgeeProvider>;
}
