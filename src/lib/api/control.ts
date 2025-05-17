// Roast control functions

import { createApiError } from "@/lib/api/base";
import { API_URL } from "@/lib/types";

/**
 * Start the roast process
 */
export async function startRoast() {
  try {
    const response = await fetch(`${API_URL}/start`, {
      method: "POST",
    });

    if (!response.ok) {
      throw createApiError(
        `Failed to start roast: ${response.status}`,
        response.status
      );
    }
    console.log("startRoast response: ", response);
    return await response.json();
  } catch (error) {
    console.error("Error starting roast:", error);
    throw error;
  }
}

/**
 * Pause the roast process
 */
export async function pauseRoast() {
  try {
    const response = await fetch(`${API_URL}/pause`, {
      method: "POST",
    });

    if (!response.ok) {
      throw createApiError(
        `Failed to pause roast: ${response.status}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error pausing roast:", error);
    throw error;
  }
}

/**
 * Reset the roast process
 */
export async function resetRoast() {
  try {
    const response = await fetch(`${API_URL}/reset`, {
      method: "POST",
    });

    if (!response.ok) {
      throw createApiError(
        `Failed to reset roast: ${response.status}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error resetting roast:", error);
    throw error;
  }
}

/**
 * Force reset the roast process (for recovery scenarios)
 */
export async function forceResetRoast() {
  try {
    const response = await fetch(`${API_URL}/force-reset`, {
      method: "POST",
    });

    if (!response.ok) {
      throw createApiError(
        `Failed to force reset roast: ${response.status}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error force resetting roast:", error);
    throw error;
  }
}
