import { MOCK_MONITORS } from '../data/mockMonitors';

const STORAGE_KEY = 'pingpulse_monitors_v1';
const WALLPAPER_KEY = 'pingpulse_wallpaper_v1';

export function getStoredMonitors() {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MONITORS));
      return MOCK_MONITORS;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return MOCK_MONITORS;
  }
}

export function saveStoredMonitors(monitors) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(monitors));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function getStoredWallpaper() {
  return localStorage.getItem(WALLPAPER_KEY) || '/scenery_landscape.jpg';
}

export function setStoredWallpaper(url) {
  localStorage.setItem(WALLPAPER_KEY, url);
}
