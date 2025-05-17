// Temperature related functions

import { CrackStatus, createApiError, TemperaturePoint } from "@/lib/api/base";
import { API_URL } from "@/lib/types/api";

/**
 * Get the current temperature
 */
export async function getTemperature() {
  try {
    const response = await fetch(`${API_URL}/temperature`);
    if (!response.ok) {
      throw createApiError(
        `Failed to fetch temperature: ${response.status}`,
        response.status
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching temperature:", error);
    throw error;
  }
}

/**
 * Get the current roast status
 */
export async function getRoastStatus() {
  try {
    const response = await fetch(`${API_URL}/status`);
    if (!response.ok) {
      throw createApiError(
        `Failed to fetch status: ${response.status}`,
        response.status
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching roast status:", error);
    throw error;
  }
}

/**
 * Check if there's an active roast on the server
 * This is used when loading the page to see if we should restore a session
 */
export async function checkActiveRoast() {
  try {
    // Send a minimal sync request to get server state
    return await syncState({
      is_roasting: false,
      data: [],
      start_time: 0,
    });
  } catch (error) {
    console.error("Error checking for active roast:", error);
    throw error;
  }
}

/**
 * Synchronize client state with server state
 */
export async function syncState(clientState: {
  is_roasting: boolean;
  data: TemperaturePoint[];
  start_time: number;
  crack_status?: CrackStatus;
}) {
  try {
    // Convert timestamps from JS milliseconds to Unix seconds for the server
    const serverFormat = {
      is_roasting: clientState.is_roasting,
      data: clientState.data,
      start_time: Math.floor(clientState.start_time / 1000), // Convert ms to seconds
      crack_status: clientState.crack_status || { first: false, second: false },
    };

    const response = await fetch(`${API_URL}/sync-state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serverFormat),
    });

    if (!response.ok) {
      throw createApiError(
        `Failed to sync state: ${response.status}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error syncing state:", error);
    throw error;
  }
}
