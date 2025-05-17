import { RoastProfile } from "./profiles";
import { NotificationType } from "@/lib/types/basicTypes";
import { CrackStatus, TemperaturePoint } from "@/lib/types/temp";

export interface RoastState {
  isRoasting: boolean;
  time: number;
  selectedProfile: RoastProfile;
  temperature: number;
  temperatureData: TemperaturePoint[];
  roastStage: string;
  crackStatus: CrackStatus;
  notification: NotificationType | null;
  completed: boolean;
}
