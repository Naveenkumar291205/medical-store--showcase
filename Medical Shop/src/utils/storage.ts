export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(`smartpharma_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`smartpharma_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

export const clearStorageKey = (key: string): void => {
  try {
    localStorage.removeItem(`smartpharma_${key}`);
  } catch (error) {
    console.error(`Error clearing ${key} from storage:`, error);
  }
};
