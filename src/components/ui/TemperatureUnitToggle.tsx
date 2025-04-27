import React from "react";
import { Button } from "./button";

type TemperatureUnitToggleProps = {
  temperatureUnit: "F" | "C";
  toggleTemperatureUnit: () => void;
  className?: string;
};

const TemperatureUnitToggle: React.FC<TemperatureUnitToggleProps> = ({
  temperatureUnit,
  toggleTemperatureUnit,
  className = "",
}) => {
  return (
    <Button
      onClick={toggleTemperatureUnit}
      className={` px-2 py-1 text-sm rounded border border-gray-300 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className} `}
      title={`Switch to ${temperatureUnit === "F" ? "Celsius" : "Fahrenheit"}`}
    >
      °{temperatureUnit === "F" ? "C" : "F"}
    </Button>
  );
};

export default TemperatureUnitToggle;
