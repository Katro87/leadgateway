const CACHE_PREFIX = 'lg_cache_';

export const cacheData = (key, data) => {
  try {
    const entry = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (e) {}
};

export const getCachedData = (key, maxAgeMs = 30 * 60 * 1000) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > maxAgeMs) return null;
    return entry.data;
  } catch (e) {
    return null;
  }
};