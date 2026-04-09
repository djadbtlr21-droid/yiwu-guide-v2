import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HOME_LOCATION } from '../config';

const AppContext = createContext(null);

const FAVORITES_KEY = 'yiwu_guide_favorites';
const THEME_KEY = 'yiwu_guide_theme';
const LANG_KEY = 'yiwu_guide_lang';
const CUSTOM_KEY = 'customBusinesses';

export function AppProvider({ children }) {
  // ── Tab & filter (Korean string IDs) ─────────────────────────
  const [tab, setTab] = useState('식당');
  const [filter, setFilter] = useState('전체');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // ── Theme ─────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  // ── Language ──────────────────────────────────────────────────
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || 'ko');

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(l => (l === 'ko' ? 'en' : 'ko'));
  }, []);

  // ── Favorites ─────────────────────────────────────────────────
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  const saveFavorites = useCallback(set => {
    setFavorites(set);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...set]));
  }, []);

  const toggleFavorite = useCallback(id => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isFavorite = useCallback(id => favorites.has(id), [favorites]);

  // ── Home location ─────────────────────────────────────────────
  const [homeLocation, setHomeLocation] = useState(HOME_LOCATION);

  // ── Custom places ──────────────────────────────────────────────
  const [customPlaces, setCustomPlaces] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const addCustomPlace = useCallback(data => {
    const place = {
      ...data,
      id: 'custom_' + Date.now(),
      addedDate: new Date().toISOString(),
      images: [],
      isCustom: true,
    };
    setCustomPlaces(prev => {
      const next = [...prev, place];
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateCustomPlace = useCallback((id, data) => {
    setCustomPlaces(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...data } : p);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteCustomPlace = useCallback(id => {
    setCustomPlaces(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Reset filter when tab changes
  const changeTab = useCallback(newTab => {
    setTab(newTab);
    setFilter('전체');
    setQuery('');
  }, []);

  const value = {
    tab, changeTab,
    filter, setFilter,
    query, setQuery,
    sortBy, setSortBy,
    theme, toggleTheme,
    lang, toggleLang,
    favorites, toggleFavorite, isFavorite, saveFavorites,
    homeLocation, setHomeLocation,
    customPlaces, addCustomPlace, updateCustomPlace, deleteCustomPlace,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
