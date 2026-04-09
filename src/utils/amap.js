import { AMAP_KEY } from '../config';

// ── Haversine distance (meters) — kept for future use ──────────
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function estimateTravelTime(meters) {
  const walkingMin = Math.ceil(meters / 83.3);
  const drivingMin = Math.ceil(meters / 500);
  return { walking: walkingMin, driving: drivingMin };
}

// ── Amap static map URL (requires VITE_AMAP_KEY) ───────────────
export function getStaticMapUrl(lng, lat, zoom = 15, size = '600*300') {
  if (!AMAP_KEY) return null;
  const marker = `mid,,A:${lng},${lat}`;
  return (
    `https://restapi.amap.com/v3/staticmap` +
    `?location=${lng},${lat}&zoom=${zoom}&size=${size}` +
    `&markers=${encodeURIComponent(marker)}&key=${AMAP_KEY}`
  );
}

// ── Amap navigation deeplink (keyword search, not coordinates) ─
export function getAmapNavUrl(name = '') {
  const encoded = encodeURIComponent(name);
  return `https://ditu.amap.com/search?query=${encoded}&city=义乌`;
}

// ── Open Amap with mobile deeplink → web fallback ─────────────
export function openAmapNavigation(name = '') {
  const ua = navigator.userAgent;
  const isAndroid = /Android/.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const encodedName = encodeURIComponent(name);
  const webUrl = `https://ditu.amap.com/search?query=${encodedName}&city=义乌`;

  if (isIOS) {
    const deeplink = `iosamap://poi?sourceApplication=yiwuguide&keywords=${encodedName}&dev=0`;
    const timer = setTimeout(() => { window.location.href = webUrl; }, 2000);
    window.addEventListener('visibilitychange', function handler() {
      clearTimeout(timer);
      window.removeEventListener('visibilitychange', handler);
    }, { once: true });
    window.location.href = deeplink;
  } else if (isAndroid) {
    const deeplink = `androidamap://poi?sourceApplication=yiwuguide&keywords=${encodedName}&dev=0`;
    const timer = setTimeout(() => { window.location.href = webUrl; }, 2000);
    window.addEventListener('visibilitychange', function handler() {
      clearTimeout(timer);
      window.removeEventListener('visibilitychange', handler);
    }, { once: true });
    window.location.href = deeplink;
  } else {
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  }
}

// ── WhatsApp URL ───────────────────────────────────────────────
export function getWhatsAppUrl(number) {
  if (!number) return null;
  const cleaned = number.replace(/[^+\d]/g, '');
  return `https://wa.me/${cleaned.replace('+', '')}`;
}

// ── Check if currently open ────────────────────────────────────
export function isOpenNow(hours) {
  if (!hours || hours.includes('24시간')) return true;
  try {
    const now = new Date();
    const hhmm = now.getHours() * 60 + now.getMinutes();
    const ranges = hours.split('/').map(s => s.trim());
    for (const range of ranges) {
      const match = range.match(/(\d{1,2}):(\d{2})[~\-](?:翌(\d{1,2}):(\d{2})|익일(\d{1,2}):(\d{2})|(\d{1,2}):(\d{2}))/);
      if (!match) continue;
      const [, sh, sm, nh1, nm1, nh2, nm2, eh, em] = match;
      const open = parseInt(sh) * 60 + parseInt(sm);
      let close;
      if (nh1) close = parseInt(nh1) * 60 + parseInt(nm1) + 24 * 60;
      else if (nh2) close = parseInt(nh2) * 60 + parseInt(nm2) + 24 * 60;
      else close = parseInt(eh) * 60 + parseInt(em);

      if (close > 24 * 60) {
        if (hhmm >= open || hhmm <= close - 24 * 60) return true;
      } else {
        if (hhmm >= open && hhmm <= close) return true;
      }
    }
    return false;
  } catch {
    return null;
  }
}

// ── Category gradient — now using Korean IDs ──────────────────
const GRADIENTS = {
  '식당': {
    '한식': 'from-red-400 to-orange-500',
    '중식': 'from-yellow-500 to-red-500',
    default: 'from-orange-400 to-amber-500',
  },
  '마사지': 'from-purple-400 to-pink-500',
  '운동':   'from-green-400 to-teal-500',
  '쇼핑':   'from-pink-400 to-rose-500',
  '집/회사': 'from-blue-400 to-indigo-500',
  '내 장소': 'from-red-400 to-rose-500',
};

export function getCategoryGradient(category, subCategory) {
  const cat = GRADIENTS[category];
  if (!cat) return 'from-gray-400 to-gray-500';
  if (typeof cat === 'string') return cat;
  return cat[subCategory] || cat.default;
}
