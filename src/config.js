// Amap (高德地图) API Key
// Get free key at: https://lbs.amap.com/
// Set VITE_AMAP_KEY in .env.local for static map images
export const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';

// Default home location for distance calculation
// 义乌国际商贸城 area (International Trade City)
export const HOME_LOCATION = {
  lng: 120.0657,
  lat: 29.3089,
  name: { ko: '의우 국제무역도시', en: 'Yiwu Trade City' },
};
