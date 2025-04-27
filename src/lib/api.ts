import { TemperatureData, CrackStatus } from "@/lib/types";

// API URL - Change this to your Raspberry Pi address
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Type for API error
export interface ApiError extends Error {
  status?: number;
}

/**
 * Get the current temperature
 */
export async function getTemperature() {
  try {
    const response = await fetch(`${API_URL}/temperature`);
    if (!response.ok) {
      const error = new Error(
        `Failed to fetch temperature: ${response.status}`
      ) as ApiError;
      error.status = response.status;
      throw error;
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
      const error = new Error(
        `Failed to fetch status: ${response.status}`
      ) as ApiError;
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching roast status:", error);
    throw error;
  }
}

/**
 * Start the roast process
 */
export async function startRoast() {
  try {
    const response = await fetch(`${API_URL}/start`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = new Error(
        `Failed to start roast: ${response.status}`
      ) as ApiError;
      error.status = response.status;
      throw error;
    }

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
      const error = new Error(
        `Failed to pause roast: ${response.status}`
      ) as ApiError;
      error.status = response.status;
      throw error;
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
      const error = new Error(
        `Failed to reset roast: ${response.status}`
      ) as ApiError;
      error.status = response.status;
      throw error;
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
      const error = new Error(
        `Failed to force reset roast: ${response.status}`
      ) as ApiError;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error force resetting roast:", error);
    throw error;
  }
}

/**
 * Set the heat level
 */
export async function setHeatLevel(level: number) {
  try {
    const response = await fetch(`${API_URL}/heat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ level }),
    });

    if (!response.ok) {
      const error = new Error(
        `Failed to set heat level: ${response.status}`
      ) as ApiError;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error setting heat level:", error);
    throw error;
  }
}

/**
 * Save roast data
 */
export async function saveRoast(data: {
  name: string;
  profile: string;
  notes?: string;
  filename?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = new Error(
        `Failed to save roast: ${response.status}`
      ) as ApiError;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving roast:", error);
    throw error;
  }
}

/**
 * Get all roast logs
 */
export async function getRoastLogs() {
  try {
    const response = await fetch(`${API_URL}/logs`);

    if (!response.ok) {
      const error = new Error(
        `Failed to fetch logs: ${response.status}`
      ) as ApiError;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching roast logs:", error);
    throw error;
  }
}

/**
 * Get a specific roast log
 */
export async function getRoastLog(filename: string) {
  try {
    const response = await fetch(`${API_URL}/logs/${filename}`);

    if (!response.ok) {
      const error = new Error(
        `Failed to fetch log: ${response.status}`
      ) as ApiError;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching roast log:", error);
    throw error;
  }
}

/**
 * Synchronize client state with server state
 */
export async function syncState(clientState: {
  is_roasting: boolean;
  data: TemperatureData[];
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
      const error = new Error(
        `Failed to sync state: ${response.status}`
      ) as ApiError;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error syncing state:", error);
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
