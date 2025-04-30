// lib/types.ts - Shared TypeScript interfaces

export interface RoastProfile {
  name: string;
  targetTemp: number;
  duration: number;
  description: string;
}

export interface TemperatureData {
  time: number;
  temperature: number;
}

export interface NotificationType {
  type: "info" | "warning" | "success";
  message: string;
}

export interface CrackStatus {
  first: boolean;
  second: boolean;
}

export interface RoastState {
  isRoasting: boolean;
  time: number;
  heatLevel: number;
  selectedProfile: RoastProfile;
  temperature: number;
  temperatureData: TemperatureData[];
  roastStage: string;
  crackStatus: CrackStatus;
  notification: NotificationType | null;
  completed: boolean;
}

export interface RoastLog {
  id: string;
  name: string;
  date: string;
  profile: string;
  duration: number;
  tempData: TemperatureData[];
  notes: string;
  firstCrack: number | null;
  secondCrack: number | null;
}

export interface RoastMarker {
  id: string;
  time: number;
  temperature: number;
  label: string;
  color?: string;
  notes?: string;
}

// Constants
export const PROFILES: RoastProfile[] = [
  {
    name: "Light City",
    targetTemp: 350,
    duration: 8,
    description: "Light brown color, no oil, mild taste",
  },
  {
    name: "Full City",
    targetTemp: 380,
    duration: 10,
    description: "Medium brown, stronger flavor profile",
  },
  {
    name: "Vienna",
    targetTemp: 430,
    duration: 12,
    description: "Dark brown, slight oil, full-bodied",
  },
  {
    name: "Italian",
    targetTemp: 450,
    duration: 14,
    description: "Nearly black, oily surface, bittersweet",
  },
];

// First crack temperature range
export const FIRST_CRACK = { min: 365, max: 385 };

// Second crack temperature range
export const SECOND_CRACK = { min: 435, max: 450 };
