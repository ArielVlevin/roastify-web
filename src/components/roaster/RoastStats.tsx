// components/roaster/RoastStats.tsx
import React from "react";
import { Check } from "lucide-react";
import { CrackStatus, NotificationType } from "@/lib/types";
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
        <h2 className="text-xl font-semibold text-stone-800">Roast Progress</h2>

        {/* Status Indicators */}
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <div
              className={`w-3 h-3 rounded-full ${
                isRoasting ? "bg-green-500 animate-pulse" : "bg-stone-300"
              }`}
            ></div>
            <span className="text-sm text-stone-600">
              {isRoasting ? "Roasting" : "Idle"}
            </span>
          </div>

          {completed && (
            <div className="flex items-center gap-1 text-green-600">
              <Check size={16} />
              <span className="text-sm">Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
              ? "bg-blue-100 text-blue-800"
              : notification.type === "warning"
              ? "bg-amber-100 text-amber-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default RoastStats;
