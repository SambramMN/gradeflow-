import type { AppData } from '../types';
import { DEFAULT_SETTINGS } from './constants';

const STORAGE_KEY = 'gradeflow-data';

const DEFAULT_APP_DATA: AppData = {
  semesters: [],
  settings: DEFAULT_SETTINGS,
  hasOnboarded: false,
};

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_APP_DATA;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      semesters: parsed.semesters ?? DEFAULT_APP_DATA.semesters,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      hasOnboarded: parsed.hasOnboarded ?? DEFAULT_APP_DATA.hasOnboarded,
    };
  } catch {
    return DEFAULT_APP_DATA;
  }
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

export function clearAppData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportAppData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importAppData(json: string): AppData | null {
  try {
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.semesters)) {
      return {
        semesters: parsed.semesters,
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
        hasOnboarded: parsed.hasOnboarded ?? true,
      };
    }
    return null;
  } catch {
    return null;
  }
}
