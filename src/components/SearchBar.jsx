import { Search, X, ArrowUpDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T } from '../translations';

const SORT_OPTIONS = [
  { value: 'default',  ko: '기본순',  en: 'Default'  },
  { value: 'distance', ko: '거리순', en: 'Distance' },
  { value: 'rating',   ko: '별점순', en: 'Rating'   },
  { value: 'name',     ko: '이름순', en: 'Name'     },
];

export default function SearchBar() {
  const { query, setQuery, sortBy, setSortBy, lang } = useApp();
  const t = T[lang];

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      {/* Search input */}
      <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t.search}
          className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Sort selector */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="appearance-none pl-2 pr-6 py-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {lang === 'ko' ? opt.ko : opt.en}
            </option>
          ))}
        </select>
        <ArrowUpDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
