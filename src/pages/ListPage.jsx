import { useMemo, useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T } from '../translations';
import { filterPlaces, parseDistanceMeters } from '../data/places';
import PlaceCard from '../components/PlaceCard';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import AddPlaceModal from '../components/AddPlaceModal';
import CustomPlaceCard from '../components/CustomPlaceCard';

export default function ListPage() {
  const { tab, filter, query, sortBy, lang, customPlaces } = useApp();
  const t = T[lang];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);

  // ── Filter & sort built-in places ─────────────────────────────
  const filtered = useMemo(() => {
    return filterPlaces({ category: tab, subcategory: filter, query });
  }, [tab, filter, query]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortBy) {
      case 'rating':
        return arr.sort((a, b) => b.rating - a.rating);
      case 'name':
        return arr.sort((a, b) => (a.nameKo || a.name || '').localeCompare(b.nameKo || b.name || '', 'ko'));
      case 'distance':
      default:
        return arr.sort((a, b) =>
          parseDistanceMeters(a.distance) - parseDistanceMeters(b.distance)
        );
    }
  }, [filtered, sortBy]);

  // ── Filter custom places for current tab ──────────────────────
  const filteredCustom = useMemo(() => {
    return customPlaces.filter(p => {
      if (p.category !== tab) return false;
      if (filter && filter !== '전체') {
        if (p.subcategory !== filter) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        const inName = p.name?.toLowerCase().includes(q);
        const inAddr = p.address?.toLowerCase().includes(q);
        const inDesc = p.description?.toLowerCase().includes(q);
        if (!inName && !inAddr && !inDesc) return false;
      }
      return true;
    });
  }, [customPlaces, tab, filter, query]);

  const tabCustomCount = useMemo(
    () => customPlaces.filter(p => p.category === tab).length,
    [customPlaces, tab]
  );

  const openAdd = () => { setEditingPlace(null); setModalOpen(true); };
  const openEdit = place => { setEditingPlace(place); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingPlace(null); };

  const noBuiltIn = sorted.length === 0;
  const noCustom = filteredCustom.length === 0;

  return (
    <>
      <FilterBar />
      <SearchBar />

      <main className="flex-1 overflow-y-auto px-4 py-3 pb-4">
        {/* ── Add button ──────────────────────────────────────── */}
        <button
          onClick={openAdd}
          className="w-full flex items-center justify-center gap-2 py-3 mb-4 rounded-2xl border-2 border-dashed border-orange-300 dark:border-orange-700 text-orange-500 font-bold text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
        >
          <Plus size={18} />
          {t.addPlace}
        </button>

        {/* ── Built-in places ──────────────────────────────────── */}
        {noBuiltIn && noCustom ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-5xl mb-3">🔍</span>
            <p className="text-base font-medium">
              {query ? t.noResults : t.emptyTab}
            </p>
            {query && <p className="text-sm mt-1">"{query}"</p>}
          </div>
        ) : (
          <>
            {sorted.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {sorted.map(place => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            )}

            {/* ── My custom places ─────────────────────────────── */}
            {tabCustomCount > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-orange-400" />
                  <h3 className="font-bold text-sm text-gray-600 dark:text-gray-300">{t.myPlaces}</h3>
                  <span className="ml-auto text-xs text-gray-400">
                    {filteredCustom.length}/{tabCustomCount}
                  </span>
                </div>
                {filteredCustom.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {filteredCustom.map(place => (
                      <CustomPlaceCard key={place.id} place={place} onEdit={openEdit} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">{t.noResults}</p>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {modalOpen && (
        <AddPlaceModal editingPlace={editingPlace} onClose={closeModal} />
      )}
    </>
  );
}
