// hooks/useTemperatureHandling.ts
import { useCallback } from "react";
import { setTemperatureUnit } from "@/lib/localStorageService";

export function useTemperatureHandling(
  temperatureUnit: "F" | "C",
  setTempUnit: (unit: "F" | "C") => void
) {
  // Temperature conversion functions
  const fahrenheitToCelsius = useCallback((tempF: number): number => {
    return Math.round((((tempF - 32) * 5) / 9) * 10) / 10;
  }, []);

  const celsiusToFahrenheit = useCallback((tempC: number): number => {
    return Math.round(((tempC * 9) / 5 + 32) * 10) / 10;
  }, []);

  // Toggle temperature unit
  const toggleTemperatureUnit = useCallback(() => {
    const newUnit = temperatureUnit === "F" ? "C" : "F";
    setTempUnit(newUnit);
    setTemperatureUnit(newUnit);
  }, [temperatureUnit, setTempUnit]);

  // Get the displayed temperature
  const getDisplayTemperature = useCallback(
    (tempF: number): number => {
      return temperatureUnit === "F" ? tempF : fahrenheitToCelsius(tempF);
    },
    [temperatureUnit, fahrenheitToCelsius]
  );

  // Format temperature with unit
  const formatTemperature = useCallback(
    (tempF: number): string => {
      const displayTemp = getDisplayTemperature(tempF);
      return `${displayTemp} °${temperatureUnit}`;
    },
    [getDisplayTemperature, temperatureUnit]
  );

  // Format time display - convert seconds to mm:ss format
  const formatTime = useCallback((timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  return {
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    toggleTemperatureUnit,
    getDisplayTemperature,
    formatTemperature,
    formatTime,
  };
}
