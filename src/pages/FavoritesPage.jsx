import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T } from '../translations';
import { places } from '../data/places';
import PlaceCard from '../components/PlaceCard';

export default function FavoritesPage() {
  const { favorites, lang } = useApp();
  const t = T[lang];

  const favPlaces = places.filter(p => favorites.has(p.id));

  return (
    <main className="flex-1 overflow-y-auto px-4 py-4 pb-4">
      <h2 className="font-bold text-lg text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        <Heart size={20} className="fill-red-500 text-red-500" />
        {t.favorites}
        {favPlaces.length > 0 && (
          <span className="ml-auto text-sm font-normal text-gray-400">{favPlaces.length}개</span>
        )}
      </h2>

      {favPlaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Heart size={48} className="mb-3 text-gray-200 dark:text-gray-700" />
          <p className="text-base font-medium">{t.noFavorites}</p>
          <p className="text-sm mt-1 text-gray-400">
            {lang === 'ko' ? '카드의 ❤️ 버튼을 눌러 추가하세요' : 'Tap ❤️ on any card to add'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {favPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </main>
  );
}
