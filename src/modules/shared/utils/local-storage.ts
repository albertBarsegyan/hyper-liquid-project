export const localStorageUtil = {
  setItem: <T>(key: string, value: T) => {
    localStorage?.setItem(key, JSON.stringify(value));
  },
  deleteItem: (key: string) => {
    localStorage?.removeItem(key);
  },
  getItem: <T>(key: string): T | null => {
    const item = localStorage?.getItem(key);

    try {
      const itemParsed = item !== null ? JSON.parse(item) : item;

      return item ? itemParsed : null;
    } catch {
      return item as T;
    }
  },
};
