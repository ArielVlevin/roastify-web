export interface RoastMarker {
  id: string;

  label: string;
  color?: string;
  icon?: MarkerIcon;

  time: number;
  temperature: number;

  notes?: string;
}

export type MarkerIcon =
  | "Zap"
  | "Coffee"
  | "Star"
  | "Bookmark"
  | "Flag"
  | "Flame";

export interface Marker {
  label: string;
  color?: string;
  icon?: MarkerIcon;
}
