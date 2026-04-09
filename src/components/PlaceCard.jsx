import { Heart, MapPin, Car, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { T } from '../translations';
import { isOpenNow, getCategoryGradient } from '../utils/amap';

function StarRating({ rating, size = 14 }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const filled = rating >= i;
        const half = !filled && rating >= i - 0.5;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill={filled ? '#f59e0b' : half ? `url(#half-${i})` : '#d1d5db'}
            />
          </svg>
        );
      })}
    </div>
  );
}

export { StarRating };

// Get display name based on language
function getDisplayName(place, lang) {
  if (lang === 'en' && place.nameEn) return place.nameEn;
  if (place.nameKo) return place.nameKo;
  return place.name;
}

// Get sub name (Chinese)
function getSubName(place) {
  return place.name || '';
}

// Category emoji
function getCategoryEmoji(category, subCategory) {
  if (category === '식당') return subCategory === '한식' ? '🍚' : '🥢';
  if (category === '마사지') return '💆';
  if (category === '운동') return '🏃';
  if (category === '여가') return '🎉';
  if (category === '쇼핑몰') return '🛍';
  if (category === '내 장소') return '📌';
  return '🏠';
}

export default function PlaceCard({ place }) {
  const { lang, toggleFavorite, isFavorite } = useApp();
  const t = T[lang];
  const fav = isFavorite(place.id);

  const gradient = getCategoryGradient(place.category, place.subCategory);
  const open = isOpenNow(place.hours);
  const displayName = getDisplayName(place, lang);
  const subName = getSubName(place);
  const emoji = getCategoryEmoji(place.category, place.subCategory);

  const subBadgeColor = place.subCategory === '한식' ? 'bg-red-500' : 'bg-amber-500';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      {/* Image / Placeholder */}
      <Link to={`/place/${place.id}`} className="block relative">
        <div className={`h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          {place.images && place.images[0] ? (
            <img
              src={place.images[0]}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl opacity-75">{emoji}</span>
          )}
        </div>

        {/* Subcategory badge */}
        {place.subCategory && (
          <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full text-white shadow ${subBadgeColor}`}>
            {place.subCategory}
          </span>
        )}

        {/* Open/Closed badge */}
        {open !== null && (
          <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full text-white shadow ${
            open ? 'bg-green-500' : 'bg-gray-500'
          }`}>
            {open ? t.open : t.closed}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/place/${place.id}`} className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">
              {displayName}
            </h3>
            <p className="text-gray-400 text-xs truncate">{subName}</p>
          </Link>

          {/* Favorite */}
          <button
            onClick={() => toggleFavorite(place.id)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            aria-label={fav ? t.removeFav : t.addFav}
          >
            <Heart
              size={18}
              className={fav ? 'fill-red-500 text-red-500' : 'text-gray-300 dark:text-gray-600'}
            />
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          {place.rating > 0 ? (
            <>
              <StarRating rating={place.rating} />
              <span className="text-sm font-bold text-amber-500">{place.rating.toFixed(1)}</span>
              {place.reviews > 0 && (
                <span className="text-xs text-gray-400">({place.reviews.toLocaleString()})</span>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-400">{t.noRatingText}</span>
          )}
        </div>

        {/* Distance & time (static) */}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
          {place.distance && (
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-orange-400" />
              {place.distance}
            </span>
          )}
          {place.driveTime && (
            <span className="flex items-center gap-1">
              <Car size={12} className="text-blue-400" />
              {place.driveTime}
            </span>
          )}
          <span className="ml-auto font-medium text-orange-500">{place.priceRange}</span>
        </div>
      </div>
    </div>
  );
}
