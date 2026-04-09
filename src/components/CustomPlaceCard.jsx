import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Phone, Clock, MapPin, DollarSign, Pencil, Trash2, Star, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T } from '../translations';
import { openAmapNavigation, getCategoryGradient } from '../utils/amap';

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
  const navigate = useNavigate();
  const { lang, toggleFavorite, isFavorite, deleteCustomPlace } = useApp();
  const t = T[lang];
  const [confirmDel, setConfirmDel] = useState(false);
  const fav = isFavorite(place.id);
  const gradient = getCategoryGradient(place.category, place.subcategory);
  const navName = place.nameZh || place.name;

  const displayName = place.name || '(이름 없음)';

  const handleDelete = () => {
    deleteCustomPlace(place.id);
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking buttons
    if (e.target.closest('button') || e.target.closest('a')) return;
    navigate(`/custom/${place.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-dashed border-orange-300 dark:border-orange-700 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Image placeholder */}
      <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        {place.images?.length > 0 && place.images[0] ? (
          <img src={place.images[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl opacity-70">📌</span>
        )}

        {/* "내 장소" badge */}
        <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 text-orange-600 shadow">
          {t.customBadge}
        </span>
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
          >
            <Heart size={16} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-300 dark:text-gray-600'} />
          </button>
        </div>

        {/* Rating */}
        {place.rating > 0 && (
          <div className="mb-2">
            <MiniStars rating={place.rating} />
          </div>
        )}

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

        {/* Amap navigation */}
        {navName && (
          <button
            onClick={() => openAmapNavigation(navName)}
            className="w-full flex items-center justify-center gap-1.5 py-2 mb-2 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
          >
            <Navigation size={14} />
            {t.navigate}
          </button>
        )}

        {/* Action buttons */}
        {confirmDel ? (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2">
            <span className="flex-1 text-xs text-red-600 dark:text-red-400 font-medium">{t.deleteConfirm}</span>
            <button onClick={handleDelete} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">{t.confirmYes}</button>
            <button onClick={() => setConfirmDel(false)} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t.confirmNo}</button>
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
