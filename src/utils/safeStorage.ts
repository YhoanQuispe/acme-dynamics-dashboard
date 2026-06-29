// Safe storage utility with in-memory fallback to avoid sandboxed iframe localStorage exceptions
const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[Storage] Failed to read "${key}" from localStorage. Falling back to memory storage.`, e);
    }
    return memoryStore[key] !== undefined ? memoryStore[key] : null;
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn(`[Storage] Failed to write "${key}" to localStorage. Falling back to memory storage.`, e);
    }
    memoryStore[key] = String(value);
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn(`[Storage] Failed to remove "${key}" from localStorage. Falling back to memory storage.`, e);
    }
    delete memoryStore[key];
  }
};
