import { ApiError } from "@/lib/types/api";

// Re-export types from the main types file
export type { TemperaturePoint, CrackStatus } from "@/lib/types";

// Utility function for handling API errors
export function createApiError(message: string, status: number): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
}
