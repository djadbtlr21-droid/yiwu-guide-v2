import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, MapPin, Phone, Clock,
  DollarSign, Navigation, ExternalLink, Star, Pencil, Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T } from '../translations';
import { openAmapNavigation, getCategoryGradient } from '../utils/amap';

function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="mt-0.5 text-orange-400 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

export default function CustomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, customPlaces, toggleFavorite, isFavorite, deleteCustomPlace } = useApp();
  const t = T[lang];
  const [confirmDel, setConfirmDel] = useState(false);

  const place = customPlaces.find(p => p.id === id);

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
        <span className="text-5xl mb-3">😕</span>
        <p>{lang === 'ko' ? '장소를 찾을 수 없습니다' : 'Place not found'}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-orange-500 underline text-sm">
          {t.back}
        </button>
      </div>
    );
  }

  const fav = isFavorite(place.id);
  const displayName = place.name || '(이름 없음)';
  const navName = place.nameZh || place.name;
  const gradient = getCategoryGradient(place.category, place.subcategory);

  const handleDelete = () => {
    deleteCustomPlace(place.id);
    navigate('/');
  };

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* Fixed top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-orange-500 font-medium">
          <ArrowLeft size={20} />
          <span className="text-sm">{t.back}</span>
        </button>
        <button onClick={() => toggleFavorite(place.id)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Heart size={22} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
      </div>

      {/* Hero image / gradient */}
      <div className={`h-48 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        {place.images?.length > 0 && place.images[0] ? (
          <img src={place.images[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl opacity-70">📌</span>
        )}
        <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 text-orange-600 shadow">
          {t.customBadge}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {/* Name */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
          {place.nameZh && <p className="text-gray-400 text-sm mt-0.5">{place.nameZh}</p>}
          {place.nameEn && <p className="text-gray-400 text-xs mt-0.5">{place.nameEn}</p>}

          {/* Rating */}
          {place.rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={16} className={place.rating >= i ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
              ))}
              <span className="font-bold text-amber-500 text-lg">{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Amap navigate button */}
        {navName && (
          <button
            onClick={() => openAmapNavigation(navName)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange-500 text-white font-bold mb-4 hover:bg-orange-600 transition-colors shadow-sm cursor-pointer"
          >
            <Navigation size={18} />
            {t.navigate}
            <ExternalLink size={14} className="opacity-70" />
          </button>
        )}

        {/* Info card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 px-4 mb-4">
          {place.address && (
            <InfoRow icon={<MapPin size={18} />} label={t.address}>
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">{place.address}</p>
            </InfoRow>
          )}
          {place.phone && (
            <InfoRow icon={<Phone size={18} />} label={t.phone}>
              <a href={`tel:${place.phone}`} className="text-sm font-medium text-orange-500 hover:underline">{place.phone}</a>
            </InfoRow>
          )}
          {place.hours && (
            <InfoRow icon={<Clock size={18} />} label={t.hours}>
              <p className="text-sm text-gray-700 dark:text-gray-200">{place.hours}</p>
            </InfoRow>
          )}
          {place.price && (
            <InfoRow icon={<DollarSign size={18} />} label={t.price}>
              <p className="text-sm font-bold text-orange-500">{place.price}</p>
            </InfoRow>
          )}
        </div>

        {/* Description */}
        {place.description && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-4">
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200 mb-2">{t.description}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{place.description}</p>
          </div>
        )}

        {/* Image gallery */}
        {place.images?.length > 0 && place.images.some(img => img && !img.includes('placeholder')) && (
          <div className="flex gap-2 overflow-x-auto mb-4">
            {place.images.filter(Boolean).map((img, i) => (
              <img key={i} src={img} alt="" className="w-28 h-28 rounded-xl object-cover flex-shrink-0" />
            ))}
          </div>
        )}

        {/* Edit / Delete buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Pencil size={16} />
            {t.edit}
          </button>
          {confirmDel ? (
            <div className="flex-1 flex gap-2">
              <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold">{t.confirmYes}</button>
              <button onClick={() => setConfirmDel(false)} className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold">{t.confirmNo}</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDel(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              <Trash2 size={16} />
              {t.delete}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
