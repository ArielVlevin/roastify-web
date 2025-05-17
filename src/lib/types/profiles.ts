export type RoastProfileType = "built-in" | "custom" | "imported" | "none";

export interface RoastProfile {
  id?: string;
  type: RoastProfileType;
  name: string;
  targetTemp: number; // in c
  duration: number;
  description: string;
}

// Constants
export const BUILT_IN_PROFILES: RoastProfile[] = [
  {
    name: "No Profile",
    type: "none",
    targetTemp: 0,
    duration: 0,
    description: "No roast profile selected",
  },
  {
    name: "Light City",
    type: "built-in",
    targetTemp: 200,
    duration: 8,
    description: "Light brown color, no oil, mild taste",
  },
  {
    name: "Full City",
    type: "built-in",
    targetTemp: 210,
    duration: 10,
    description: "Medium brown, stronger flavor profile",
  },
  {
    name: "Vienna",
    type: "built-in",

    targetTemp: 230,
    duration: 12,
    description: "Dark brown, slight oil, full-bodied",
  },
  {
    name: "Italian",
    type: "built-in",
    targetTemp: 220,
    duration: 14,
    description: "Nearly black, oily surface, bittersweet",
  },
];
