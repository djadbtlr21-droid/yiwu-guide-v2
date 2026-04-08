import { useApp } from '../context/AppContext';
import { T } from '../translations';
import { SUBCATEGORIES } from '../data/places';

const PILL_ACTIVE = {
  '한식': 'bg-red-500 text-white',
  '중식': 'bg-amber-500 text-white',
  '전체': 'bg-orange-500 text-white',
};

export default function FilterBar() {
  const { tab, filter, setFilter, lang } = useApp();
  const t = T[lang];

  const subs = SUBCATEGORIES[tab];
  if (!subs) return null;

  // Display labels for subcategory values
  const labels = { '전체': t.all, '한식': t.korean, '중식': t.chinese };

  return (
    <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      {subs.map(sub => {
        const active = filter === sub;
        return (
          <button
            key={sub}
            onClick={() => setFilter(sub)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              active
                ? (PILL_ACTIVE[sub] || 'bg-orange-500 text-white')
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {labels[sub] || sub}
          </button>
        );
      })}
    </div>
  );
}
