import type React from "react";
import type { CrackStatus } from "@/lib/types";
import StatPanel from "@/components/ui/app-ui/statPanel";
import { JSX } from "react";

/**
 * Renders the crack status UI based on boolean values.
 * - "1st" appears in accent color if `first` is true.
 * - "2nd" appears in destructive color if `second` is true.
 * - Otherwise, both are muted.
 *
 * @param {CrackStatus} status - Object with `first` and `second` crack booleans
 * @returns {JSX.Element} Rendered crack status
 */
export function renderCrackStatus(status: CrackStatus): JSX.Element {
  return (
    <div className="text-base font-bold">
      <span
        className={status.first ? "text-accent" : "text-muted-foreground/60"}
      >
        1st
      </span>
      <span className="mx-1" />
      <span
        className={
          status.second ? "text-destructive" : "text-muted-foreground/60"
        }
      >
        2nd
      </span>
    </div>
  );
}

interface RoastStatsProps {
  time: number;
  temperature: number;
  roastStage: string;
  crackStatus: CrackStatus;
  temperatureUnit: "F" | "C";
  formatTemperature: (tempF: number) => string;
  formatTime: (timeInSeconds: number) => string;
}

const RoastStats: React.FC<RoastStatsProps> = ({
  time,
  temperature,
  roastStage,
  crackStatus,
  formatTemperature,
  formatTime,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <StatPanel label="Time">{formatTime(time)} </StatPanel>
      <StatPanel label="Temperature">
        {formatTemperature(temperature)}
      </StatPanel>
      <StatPanel label="Roast Stage">{roastStage} </StatPanel>
      <StatPanel label="Crack Status">
        {renderCrackStatus(crackStatus)}
      </StatPanel>
    </div>
  );
};

export default RoastStats;
