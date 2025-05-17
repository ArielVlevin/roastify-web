import { id } from "@/lib/types/basicTypes";
import { CrackStatus, TemperaturePoint } from "@/lib/types/temp";
import { RoastMarker } from "@/lib/types/marker";
import { RoastProfile } from "./profiles";

export interface SaveRoastRequest {
  name: string;
  profile: string;
  notes?: string;
  filename?: string;
}

export interface RoastSaveData {
  name: string;
  timestamp: number;
  date: string;
  profile: RoastProfile;
  notes: string;
  data: TemperaturePoint[];
  markers: RoastMarker[];
  crack_status: CrackStatus;
  //todo:optinal
  //max_temp: number
  //
}

export interface RoastLog extends RoastSaveData {
  id: id;
}

export interface RoastLogSummary {
  id: id;
  name: string;
  date: string;
  profile: string;
  duration: number;
  max_temp: number;
}
