"use client";

import { RoastProfile } from "@/lib/types";
import { useFormattedTemperature } from "@/lib/hooks/useFormattedTemperature";

interface TargetProfileInfoProps {
  selectedProfile: RoastProfile;
  formatTime: (time: number) => string;
}

const TargetProfileInfo = ({
  selectedProfile,
  formatTime,
}: TargetProfileInfoProps) => {
  const formattedTemperature = useFormattedTemperature(
    selectedProfile.targetTemp
  );

  return (
    <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border mb-4">
      <div className="flex flex-col sm:flex-row justify-between text-sm">
        <div className="mb-2 sm:mb-0">
          <span className="text-muted-foreground">Target Temperature:</span>
          <span className="ml-2 font-medium text-foreground">
            {formattedTemperature}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Target Time:</span>
          <span className="ml-2 font-medium text-foreground">
            {formatTime(selectedProfile.duration * 60)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TargetProfileInfo;
