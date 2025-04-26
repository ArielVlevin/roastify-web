/**
 * Local storage service for storing and retrieving roast session data
 */
import { TemperatureData } from "./types";

// Key for storing active roast in localStorage
const ACTIVE_ROAST_KEY = "artisan_active_roast";

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
 * Save active roast data to localStorage
 */
export const saveActiveRoast = (data: ActiveRoastData): void => {
  try {
    localStorage.setItem(
      ACTIVE_ROAST_KEY,
      JSON.stringify({
        ...data,
        lastUpdated: Date.now(), // Always update timestamp
      })
    );
  } catch (error) {
    console.error("Failed to save roast to localStorage:", error);
  }
};

/**
 * Get active roast data from localStorage
 * Returns null if no active roast data is found or if data is invalid
 */
export const getActiveRoast = (): ActiveRoastData | null => {
  try {
    const data = localStorage.getItem(ACTIVE_ROAST_KEY);
    if (!data) return null;

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
    console.error("Failed to retrieve roast from localStorage:", error);
    return null;
  }
};

/**
 * Clear active roast data from localStorage
 */
export const clearActiveRoast = (): void => {
  try {
    localStorage.removeItem(ACTIVE_ROAST_KEY);
  } catch (error) {
    console.error("Failed to clear roast from localStorage:", error);
  }
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
  try {
    const currentData = getActiveRoast();
    if (!currentData) return;

    saveActiveRoast({
      ...currentData,
      ...updatedFields,
      lastUpdated: Date.now(),
    });
  } catch (error) {
    console.error("Failed to update active roast:", error);
  }
};
