import type React from "react";
import { Check } from "lucide-react";
import type { CrackStatus, NotificationType } from "@/lib/types";
import { CrackStatusBox, StatBox } from "../ui/StatBox";

interface RoastStatsProps {
  time: number;
  temperature: number;
  roastStage: string;
  crackStatus: CrackStatus;
  isRoasting: boolean;
  completed: boolean;
  notification: NotificationType | null;
  temperatureUnit: "F" | "C";
  formatTemperature: (tempF: number) => string;
  formatTime: (timeInSeconds: number) => string;
}

const RoastStats: React.FC<RoastStatsProps> = ({
  time,
  temperature,
  roastStage,
  crackStatus,
  isRoasting,
  completed,
  notification,
  formatTemperature,
  formatTime,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Roast Progress
        </h2>

        {/* Status Indicators */}
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <div
              className={`w-3 h-3 rounded-full ${
                isRoasting ? "bg-primary animate-pulse" : "bg-muted"
              }`}
            ></div>
            <span className="text-sm text-muted-foreground">
              {isRoasting ? "Roasting" : "Idle"}
            </span>
          </div>

          {completed && (
            <div className="flex items-center gap-1 text-primary">
              <Check size={16} />
              <span className="text-sm">Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatBox label="Time" value={formatTime(time)} />
        <StatBox label="Temperature" value={formatTemperature(temperature)} />
        <StatBox label="Roast Stage" value={roastStage} />
        <CrackStatusBox first={crackStatus.first} second={crackStatus.second} />
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
            notification.type === "info"
              ? "bg-primary/20 text-primary"
              : notification.type === "warning"
              ? "bg-accent/20 text-accent"
              : "bg-destructive/20 text-destructive"
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default RoastStats;
