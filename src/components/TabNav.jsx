import { useApp } from '../context/AppContext';
import { T } from '../translations';
import { CATEGORIES } from '../data/places';

const COLOR_ACTIVE = {
  orange: 'text-orange-500',
  purple: 'text-purple-500',
  green:  'text-green-500',
  blue:   'text-blue-500',
  pink:   'text-pink-500',
  amber:  'text-amber-500',
  red:    'text-red-500',
};

const BG_ACTIVE = {
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  green:  'bg-green-500',
  blue:   'bg-blue-500',
  pink:   'bg-pink-500',
  amber:  'bg-amber-500',
  red:    'bg-red-500',
};

export default function TabNav() {
  const { tab, changeTab, lang } = useApp();
  const t = T[lang];

  const labels = {
    '식당':   t.restaurant,
    '운동':   t.sports,
    '마사지':  t.massage,
    '쇼핑':   t.shopping,
    '집/회사': t.home,
    '내 장소': t.myPlacesTab,
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-bottom">
      <div className="flex">
        {CATEGORIES.map(cat => {
          const active = tab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => changeTab(cat.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative ${
                active ? COLOR_ACTIVE[cat.color] : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {/* Active indicator bar */}
              {active && (
                <span className={`absolute top-0 left-0 right-0 h-0.5 ${BG_ACTIVE[cat.color]}`} />
              )}
              <span className="text-2xl leading-none">{cat.icon}</span>
              <span className="text-xs font-semibold leading-tight">{labels[cat.id]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
