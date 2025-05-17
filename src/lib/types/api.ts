// API URL - Change this to your Raspberry Pi address
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Type for API error
export interface ApiError extends Error {
  status?: number;
}
