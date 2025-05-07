// Roast data and log functions

import { API_URL, createApiError } from "@/lib/api/base";

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
      throw createApiError(
        `Failed to save roast: ${response.status}`,
        response.status
      );
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
      throw createApiError(
        `Failed to fetch logs: ${response.status}`,
        response.status
      );
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
      throw createApiError(
        `Failed to fetch log: ${response.status}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching roast log:", error);
    throw error;
  }
}
