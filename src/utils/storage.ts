import { get, set, del, keys } from 'idb-keyval';

/**
 * Robust asynchronous storage using IndexedDB with fallback to localStorage
 */
export const persistentStorage = {
  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const val = await get<T>(key);
      if (val !== undefined && val !== null) {
        return val;
      }
    } catch {
      // Fallback to localStorage
    }

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) {
          return JSON.parse(raw);
        }
      } catch {}
    }

    return defaultValue;
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    // 1. Save to IndexedDB
    try {
      await set(key, value);
    } catch {}

    // 2. Also keep mirror in localStorage for instant synchronous boots
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await del(key);
    } catch {}

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch {}
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      const allKeys = await keys();
      return allKeys.map(String);
    } catch {
      return typeof window !== 'undefined' ? Object.keys(localStorage) : [];
    }
  }
};
