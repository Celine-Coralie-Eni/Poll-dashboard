"use client";

import React, { createContext, useContext, useMemo } from 'react';

// Available languages (only include languages with translation files)
export const languages = {
  en: "English",
  es: "Español", 
  fr: "Français",
  de: "Deutsch",
};

export type Language = keyof typeof languages;

// Pre-loaded translations cache
const translationsCache = new Map<string, Record<string, any>>();

// Translation context
interface TranslationContextType {
  translations: Record<string, any>;
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

// Optimized translation provider
export function TolgeeProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('poll-dashboard-language');
      return saved && saved in languages ? saved : 'en';
    }
    return 'en';
  });

  const [translations, setTranslations] = React.useState<Record<string, any>>({});

  // Load translations only when language changes
  React.useEffect(() => {
    const loadTranslations = async () => {
      // Check cache first
      if (translationsCache.has(currentLanguage)) {
        setTranslations(translationsCache.get(currentLanguage)!);
        return;
      }

      try {
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
        
        const loadedTranslations = translationModule.default || translationModule;
        translationsCache.set(currentLanguage, loadedTranslations);
        setTranslations(loadedTranslations);
      } catch (error) {
        console.warn(`Failed to load translations for ${currentLanguage}, falling back to English`);
        if (!translationsCache.has('en')) {
          try {
            const fallbackModule = await import('../public/locales/en.json');
            const fallbackTranslations = fallbackModule.default || fallbackModule;
            translationsCache.set('en', fallbackTranslations);
            setTranslations(fallbackTranslations);
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError);
            setTranslations({});
          }
        } else {
          setTranslations(translationsCache.get('en')!);
        }
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  const changeLanguage = React.useCallback((lang: string) => {
    if (lang in languages && lang !== currentLanguage) {
      setCurrentLanguage(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('poll-dashboard-language', lang);
      }
    }
  }, [currentLanguage]);

  const contextValue = useMemo(() => ({
    translations,
    currentLanguage,
    changeLanguage,
  }), [translations, currentLanguage, changeLanguage]);

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

// Optimized useTranslations hook
export function useTranslations() {
  const context = useContext(TranslationContext);
  
  if (!context) {
    throw new Error('useTranslations must be used within a TolgeeProvider');
  }

  const { translations, currentLanguage, changeLanguage } = context;

  const t = React.useCallback((key: string, parameters?: Record<string, any>): string => {
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
  }, [translations]);

  return {
    t,
    i18n: {
      changeLanguage,
      language: currentLanguage,
    },
  };
}

// Legacy alias for backward compatibility
export function TolgeeAppProvider({ children }: { children: React.ReactNode }) {
  return <TolgeeProvider>{children}</TolgeeProvider>;
}