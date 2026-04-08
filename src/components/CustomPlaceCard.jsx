import { useState } from 'react';
import { Heart, Phone, Clock, MapPin, DollarSign, Pencil, Trash2, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T } from '../translations';

const CATEGORY_COLORS = {
  restaurant: { bg: 'from-orange-400 to-amber-500', badge: 'bg-orange-500' },
  massage:    { bg: 'from-purple-400 to-pink-500',  badge: 'bg-purple-500' },
  billiards:  { bg: 'from-green-400 to-teal-500',   badge: 'bg-green-500'  },
  home:       { bg: 'from-blue-400 to-indigo-500',  badge: 'bg-blue-500'   },
};
const SUB_COLORS = {
  korean:  'bg-red-500',
  chinese: 'bg-amber-500',
};
const CATEGORY_EMOJI = {
  restaurant: { korean: '🍚', chinese: '🥢', default: '🍽' },
  massage:    '💆',
  billiards:  '🎱',
  home:       '🏠',
};

function getEmoji(cat, sub) {
  const c = CATEGORY_EMOJI[cat];
  if (!c) return '📍';
  if (typeof c === 'string') return c;
  return c[sub] || c.default;
}

function MiniStars({ rating }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={rating >= i ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
      ))}
      <span className="ml-1 text-xs font-bold text-amber-500">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function CustomPlaceCard({ place, onEdit }) {
  const { lang, toggleFavorite, isFavorite, deleteCustomPlace } = useApp();
  const t = T[lang];
  const [confirmDel, setConfirmDel] = useState(false);
  const fav = isFavorite(place.id);
  const colors = CATEGORY_COLORS[place.category] || CATEGORY_COLORS.restaurant;
  const subColor = place.subcategory ? (SUB_COLORS[place.subcategory] || 'bg-gray-400') : null;
  const emoji = getEmoji(place.category, place.subcategory);

  const displayName = place.name || '(이름 없음)';

  const catLabels = { restaurant: t.restaurant, massage: t.massage, billiards: t.billiards, home: t.home };
  const subLabels = { korean: t.korean, chinese: t.chinese };

  const handleDelete = () => {
    deleteCustomPlace(place.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-dashed border-orange-300 dark:border-orange-700 hover:shadow-md transition-shadow">
      {/* Image placeholder */}
      <div className={`h-36 bg-gradient-to-br ${colors.bg} flex items-center justify-center relative`}>
        <span className="text-5xl opacity-70">{emoji}</span>

        {/* "내 장소" badge */}
        <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 text-orange-600 shadow">
          {t.customBadge}
        </span>

        {/* Subcategory badge */}
        {place.subcategory && subColor && (
          <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full text-white shadow ${subColor}`}>
            {subLabels[place.subcategory] || place.subcategory}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Name row */}
        <div className="flex items-start gap-2 mb-1.5">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{displayName}</h3>
            {place.nameZh && (
              <p className="text-gray-400 text-xs truncate">{place.nameZh}</p>
            )}
          </div>
          {/* Favorite */}
          <button
            onClick={() => toggleFavorite(place.id)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            aria-label={fav ? t.removeFav : t.addFav}
          >
            <Heart size={16} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-300 dark:text-gray-600'} />
          </button>
        </div>

        {/* Category badge + rating */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${colors.badge}`}>
            {catLabels[place.category] || place.category}
          </span>
          {place.rating > 0 && <MiniStars rating={place.rating} />}
        </div>

        {/* Info rows */}
        <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
          {place.address && (
            <p className="flex items-start gap-1.5">
              <MapPin size={12} className="text-orange-400 mt-0.5 flex-shrink-0" />
              <span className="truncate">{place.address}</span>
            </p>
          )}
          {place.phone && (
            <p className="flex items-center gap-1.5">
              <Phone size={12} className="text-blue-400 flex-shrink-0" />
              <a href={`tel:${place.phone}`} className="text-blue-500 hover:underline truncate">{place.phone}</a>
            </p>
          )}
          {place.hours && (
            <p className="flex items-center gap-1.5">
              <Clock size={12} className="text-green-400 flex-shrink-0" />
              <span className="truncate">{place.hours}</span>
            </p>
          )}
          {place.price && (
            <p className="flex items-center gap-1.5">
              <DollarSign size={12} className="text-amber-400 flex-shrink-0" />
              <span className="font-medium text-orange-500">{place.price}</span>
            </p>
          )}
        </div>

        {/* Description */}
        {place.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{place.description}</p>
        )}

        {/* Action buttons */}
        {confirmDel ? (
          /* Delete confirmation */
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2">
            <span className="flex-1 text-xs text-red-600 dark:text-red-400 font-medium">{t.deleteConfirm}</span>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
            >
              {t.confirmYes}
            </button>
            <button
              onClick={() => setConfirmDel(false)}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t.confirmNo}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(place)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Pencil size={14} />
              {t.edit}
            </button>
            <button
              onClick={() => setConfirmDel(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              <Trash2 size={14} />
              {t.delete}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
