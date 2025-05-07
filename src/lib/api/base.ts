// API URL - Change this to your Raspberry Pi address
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Type for API error
export interface ApiError extends Error {
  status?: number;
}

// Re-export types from the main types file
export type { TemperatureData, CrackStatus } from "@/lib/types";

// Utility function for handling API errors
export function createApiError(message: string, status: number): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
}
