/**
 * Local storage service for storing and retrieving roast session data
 */
import { TemperatureData } from "./types";

// Key for storing active roast in localStorage
const ACTIVE_ROAST_KEY = "artisan_active_roast";
const TEMP_UNIT_KEY = "temperatureUnit";

// Safe check for browser environment
const isBrowser = typeof window !== "undefined";

// Interface for active roast data
export interface ActiveRoastData {
  startTime: number;
  lastUpdated: number;
  temperatureData: TemperatureData[];
  selectedProfileName: string;
  crackStatus: {
    first: boolean;
    second: boolean;
  };
  firstCrackTime: number | null;
  secondCrackTime: number | null;
  completed: boolean;
}

/**
 * Safe localStorage getter that works with SSR
 */
const safeGetItem = (key: string): string | null => {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get item ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Safe localStorage setter that works with SSR
 */
const safeSetItem = (key: string, value: string): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to set item ${key} in localStorage:`, error);
  }
};

/**
 * Safe localStorage remover that works with SSR
 */
const safeRemoveItem = (key: string): void => {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item ${key} from localStorage:`, error);
  }
};

/**
 * Save active roast data to localStorage
 */
export const saveActiveRoast = (data: ActiveRoastData): void => {
  safeSetItem(
    ACTIVE_ROAST_KEY,
    JSON.stringify({
      ...data,
      lastUpdated: Date.now(), // Always update timestamp
    })
  );
};

/**
 * Get active roast data from localStorage
 * Returns null if no active roast data is found or if data is invalid
 */
export const getActiveRoast = (): ActiveRoastData | null => {
  const data = safeGetItem(ACTIVE_ROAST_KEY);
  if (!data) return null;

  try {
    const roastData = JSON.parse(data) as ActiveRoastData;

    // Validate data has all required fields
    if (!roastData.startTime || !roastData.temperatureData) {
      return null;
    }

    // Check if data isn't too old (older than 24 hours)
    const MAX_AGE = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
    if (Date.now() - roastData.lastUpdated > MAX_AGE) {
      clearActiveRoast();
      return null;
    }

    return roastData;
  } catch (error) {
    console.error("Failed to parse roast data from localStorage:", error);
    return null;
  }
};

/**
 * Clear active roast data from localStorage
 */
export const clearActiveRoast = (): void => {
  safeRemoveItem(ACTIVE_ROAST_KEY);
};

/**
 * Check if there is an active roast in progress
 */
export const hasActiveRoast = (): boolean => {
  return getActiveRoast() !== null;
};

/**
 * Update specific fields of active roast data
 */
export const updateActiveRoast = (
  updatedFields: Partial<ActiveRoastData>
): void => {
  const currentData = getActiveRoast();
  if (!currentData) return;

  saveActiveRoast({
    ...currentData,
    ...updatedFields,
    lastUpdated: Date.now(),
  });
};

/**
 * Get temperature unit preference from localStorage
 * Defaults to "F" if not set
 */
export function getTemperatureUnit(): "F" | "C" {
  // Default for SSR or if localStorage is unavailable
  if (!isBrowser) return "F";

  const unit = safeGetItem(TEMP_UNIT_KEY);
  return unit === "C" ? "C" : "F"; // Return "F" if value is missing or invalid
}

/**
 * Set temperature unit preference in localStorage
 */
export function setTemperatureUnit(unit: "F" | "C"): void {
  safeSetItem(TEMP_UNIT_KEY, unit);
}
