import { Moon, Sun, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { T } from '../translations';

export default function Header() {
  const { theme, toggleTheme, lang, toggleLang, favorites } = useApp();
  const t = T[lang];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm safe-top">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🇨🇳</span>
          <div className="leading-tight">
            <div className="font-bold text-orange-500 text-base leading-none">{t.appName}</div>
            <div className="text-gray-400 text-xs">{t.appSub}</div>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Favorites link */}
          <Link
            to="/favorites"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={t.favorites}
          >
            <Heart size={20} className="text-gray-500 dark:text-gray-400" />
            {favorites.size > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                {favorites.size > 9 ? '9+' : favorites.size}
              </span>
            )}
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="px-2 py-1 text-xs font-bold rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-[36px]"
            aria-label="Toggle language"
          >
            {lang === 'ko' ? 'EN' : '한'}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
