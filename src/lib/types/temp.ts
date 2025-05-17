export interface TemperaturePoint {
  time: number;
  temperature: number;
}

// First crack temperature range
export const FIRST_CRACK = { min: 365, max: 385 };

// Second crack temperature range
export const SECOND_CRACK = { min: 435, max: 450 };
export interface CrackStatus {
  first: boolean;
  second: boolean;
  first_time?: number;
  second_time?: number;
}
