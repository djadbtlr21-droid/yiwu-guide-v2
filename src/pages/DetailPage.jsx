import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, MapPin, Phone, MessageCircle, Clock,
  DollarSign, Tag, Car, Navigation, Copy, Check, ExternalLink, Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T } from '../translations';
import { getPlaceById } from '../data/places';
import { getAmapNavUrl, openAmapNavigation, getWhatsAppUrl, isOpenNow, getCategoryGradient } from '../utils/amap';
import ImageGallery from '../components/ImageGallery';
import { StarRating } from '../components/PlaceCard';

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

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, toggleFavorite, isFavorite } = useApp();
  const t = T[lang];
  const [copied, setCopied] = useState(false);

  const place = getPlaceById(id);

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
        <span className="text-5xl mb-3">😕</span>
        <p>{lang === 'ko' ? '업체를 찾을 수 없습니다' : 'Place not found'}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-orange-500 underline text-sm">
          {t.back}
        </button>
      </div>
    );
  }

  const fav = isFavorite(place.id);
  const open = isOpenNow(place.hours);

  // Display name based on language
  const displayName = lang === 'en' && place.nameEn ? place.nameEn : (place.nameKo || place.name);
  const displayAddress = lang === 'en' ? place.address?.en : (place.address?.ko || place.address?.cn);

  const navName = place.name;
  const navUrl = getAmapNavUrl(navName);
  const waUrl = getWhatsAppUrl(place.wechat);

  const gradient = getCategoryGradient(place.category, place.subCategory);

  const copyWechat = async () => {
    try { await navigator.clipboard.writeText(place.wechat); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Phone list
  const phones = Array.isArray(place.phone) ? place.phone : (place.phone ? [place.phone] : []);

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {/* Fixed top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-orange-500 font-medium"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">{t.back}</span>
        </button>
        <button
          onClick={() => toggleFavorite(place.id)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Heart size={22} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
      </div>

      {/* Image gallery */}
      <ImageGallery
        images={place.images || [null, null, null]}
        category={place.category}
        subcategory={place.subCategory}
      />

      {/* Content */}
      <div className="px-4 pt-4">
        {/* Name & status */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{place.name}</p>
            </div>
            {open !== null && (
              <span className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full text-white mt-1 ${
                open ? 'bg-green-500' : 'bg-gray-500'
              }`}>
                {open ? t.open : t.closed}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            {place.rating > 0 ? (
              <>
                <StarRating rating={place.rating} size={16} />
                <span className="font-bold text-amber-500 text-lg">{place.rating.toFixed(1)}</span>
                {place.reviews > 0 && (
                  <span className="text-gray-400 text-sm">({place.reviews.toLocaleString()} {t.reviews})</span>
                )}
              </>
            ) : (
              <span className="text-gray-400 text-sm">{t.noRatingText}</span>
            )}
          </div>

          {/* Subcategory badge */}
          {place.subCategory && (
            <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full text-white ${
              place.subCategory === '한식' ? 'bg-red-500'
              : place.subCategory === '중식' ? 'bg-amber-500'
              : place.subCategory === '당구' ? 'bg-green-500'
              : place.subCategory === '골프' ? 'bg-emerald-500'
              : place.subCategory === '쇼핑몰' ? 'bg-pink-500'
              : place.subCategory === '마트' ? 'bg-rose-500'
              : 'bg-gray-500'
            }`}>
              {place.subCategory}
            </span>
          )}

          {/* Distance chips */}
          {(place.distance || place.driveTime || place.walkTime) && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {place.distance && (
                <span className="flex items-center gap-1 text-xs bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-3 py-1.5 rounded-full">
                  <MapPin size={12} />
                  {place.distance}
                </span>
              )}
              {place.driveTime && (
                <span className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1.5 rounded-full">
                  <Car size={12} />
                  🚗 {place.driveTime}
                </span>
              )}
              {place.walkTime && (
                <span className="flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-3 py-1.5 rounded-full">
                  🚶 {place.walkTime}
                </span>
              )}
              <span className="ml-2 text-sm font-bold text-orange-400">(신광휘에서 출발 시)</span>
            </div>
          )}
        </div>

        {/* Amap navigate button */}
        {place.coordinates?.lng && (
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
          {/* Address */}
          {displayAddress && (
            <InfoRow icon={<MapPin size={18} />} label={t.address}>
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">{displayAddress}</p>
              {lang !== 'zh' && place.address?.cn && (
                <p className="text-xs text-gray-400 mt-0.5">{place.address.cn}</p>
              )}
            </InfoRow>
          )}

          {/* Phone(s) */}
          {phones.length > 0 && (
            <InfoRow icon={<Phone size={18} />} label={t.phone}>
              <div className="space-y-0.5">
                {phones.map((p, i) => (
                  <a key={i} href={`tel:${p}`} className="block text-sm font-medium text-orange-500 hover:underline">
                    {p}
                  </a>
                ))}
              </div>
            </InfoRow>
          )}

          {/* WeChat */}
          {place.wechat && (
            <InfoRow icon={<span className="text-green-500 font-bold text-sm leading-none">W</span>} label={t.wechat}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{place.wechat}</span>
                <button
                  onClick={copyWechat}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  {copied ? t.copied : t.copyWechat}
                </button>
              </div>
            </InfoRow>
          )}

          {/* Hours */}
          {place.hours && (
            <InfoRow icon={<Clock size={18} />} label={t.hours}>
              <p className="text-sm text-gray-700 dark:text-gray-200">{place.hours}</p>
            </InfoRow>
          )}

          {/* Price */}
          {place.priceRange && (
            <InfoRow icon={<DollarSign size={18} />} label={t.price}>
              <p className="text-sm font-bold text-orange-500">{place.priceRange}</p>
            </InfoRow>
          )}
        </div>

        {/* Amenities */}
        {place.amenities?.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={16} className="text-orange-400" />
              <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200">{t.amenities}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {place.amenities.map(a => (
                <span key={a} className="text-xs px-2.5 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 rounded-full border border-orange-100 dark:border-orange-800">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {place.description && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6">
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200 mb-2">{t.description}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {place.description[lang] || place.description.ko || place.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
