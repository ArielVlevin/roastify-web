// Main export file - re-exports all API functions
// Re-export types and base utilities
export { API_URL } from "@/lib/api/base";
export type { ApiError } from "@/lib/api/base";

// Re-export temperature functions
export {
  getTemperature,
  getRoastStatus,
  checkActiveRoast,
  syncState,
} from "@/lib/api/temp";

// Re-export control functions
export {
  startRoast,
  pauseRoast,
  resetRoast,
  forceResetRoast,
  setHeatLevel,
} from "@/lib/api/control";

// Re-export data functions
export { saveRoast, getRoastLogs, getRoastLog } from "@/lib/api/data";
