"use client";

import type React from "react";
import { Button } from "@/components/ui/button";

interface TemperatureUnitToggleProps {
  temperatureUnit: "F" | "C";
  toggleTemperatureUnit: () => void;
  className?: string;
}

const TemperatureUnitToggle: React.FC<TemperatureUnitToggleProps> = ({
  temperatureUnit,
  toggleTemperatureUnit,
  className = "",
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-xs text-muted-foreground mr-2">
        Temperature Unit:
      </span>
      <Button
        onClick={toggleTemperatureUnit}
        variant="outline"
        size="sm"
        className="h-8 px-2 text-xs font-medium"
      >
        °{temperatureUnit} <span className="ml-1 text-muted-foreground">→</span>{" "}
        °{temperatureUnit === "F" ? "C" : "F"}
      </Button>
    </div>
  );
};

export default TemperatureUnitToggle;
