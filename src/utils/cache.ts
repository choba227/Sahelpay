/**
 * Sahel Pay Cache Engine
 * Optimise la persistance locale et élimine les rechargements inutiles
 */

const CACHE_PREFIX = 'sahel_pay_cache_';
const CACHE_VERSION = 'v2_2026';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

export function setLocalCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch (e) {
    console.warn('Cache write failed:', e);
  }
}

export function getLocalCache<T>(key: string, maxAgeMs = 7 * 24 * 3600 * 1000): T | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (entry.version !== CACHE_VERSION) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    if (Date.now() - entry.timestamp > maxAgeMs) {
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function clearLocalCache(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Cache clear failed:', e);
  }
}
