import { MapPin } from 'lucide-react';
import { getStaticMapUrl, getAmapNavUrl } from '../utils/amap';
import { T } from '../translations';
import { useApp } from '../context/AppContext';

export default function MapView({ lng, lat, name }) {
  const { lang } = useApp();
  const t = T[lang];
  const mapUrl = getStaticMapUrl(lng, lat);
  const navUrl = getAmapNavUrl(lng, lat, name);

  return (
    <a
      href={navUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:opacity-90 transition-opacity"
    >
      {mapUrl ? (
        <img
          src={mapUrl}
          alt="Amap"
          className="w-full h-44 object-cover"
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
      ) : null}

      {/* Placeholder map (always shown if no key, or as fallback) */}
      <div
        className="w-full h-44 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center justify-center gap-2"
        style={{ display: mapUrl ? 'none' : 'flex' }}
      >
        {/* Simple map grid illustration */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            {[25, 50, 75].map(p => (
              <g key={p}>
                <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="currentColor" strokeWidth="1" />
                <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="currentColor" strokeWidth="1" />
              </g>
            ))}
          </svg>

          {/* Center content */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="bg-red-500 rounded-full p-2 shadow-lg">
              <MapPin size={20} className="text-white" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-1.5 shadow text-center">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{name}</p>
              <p className="text-xs text-orange-500 mt-0.5">{t.tapToNavigate}</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
