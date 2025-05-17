export interface RoastProfile {
  name: string;
  targetTemp: number;
  duration: number;
  description: string;
}

// Constants
export const PROFILES: RoastProfile[] = [
  {
    name: "Light City",
    targetTemp: 200,
    duration: 8,
    description: "Light brown color, no oil, mild taste",
  },
  {
    name: "Full City",
    targetTemp: 210,
    duration: 10,
    description: "Medium brown, stronger flavor profile",
  },
  {
    name: "Vienna",
    targetTemp: 230,
    duration: 12,
    description: "Dark brown, slight oil, full-bodied",
  },
  {
    name: "Italian",
    targetTemp: 220,
    duration: 14,
    description: "Nearly black, oily surface, bittersweet",
  },
];
