const STORAGE_KEY = 'pingpulse_monitors_v1';

export function getStoredMonitors() {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return [];
  }
}

export function saveStoredMonitors(monitors) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(monitors));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}
