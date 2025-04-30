"use client";

import { useCallback, useEffect, useState } from "react";
import {
  setTemperatureUnit,
  getTemperatureUnit,
} from "@/lib/localStorageService";

export function useTemperatureHandling(
  initialUnit: "F" | "C",
  setTempUnit: (unit: "F" | "C") => void
) {
  // Track if we're mounted on the client to safely use localStorage
  const [isMounted, setIsMounted] = useState(false);

  // Initialize with server-side compatible default
  useEffect(() => {
    setIsMounted(true);

    // Only load from localStorage on the client
    if (typeof window !== "undefined") {
      const savedUnit = getTemperatureUnit();
      // Only update if different to avoid unnecessary re-renders
      if (savedUnit !== initialUnit) {
        setTempUnit(savedUnit);
      }
    }
  }, [initialUnit, setTempUnit]);

  // Temperature conversion functions
  const fahrenheitToCelsius = useCallback((tempF: number): number => {
    return Math.round((((tempF - 32) * 5) / 9) * 10) / 10;
  }, []);

  const celsiusToFahrenheit = useCallback((tempC: number): number => {
    return Math.round(((tempC * 9) / 5 + 32) * 10) / 10;
  }, []);

  // Toggle temperature unit safely
  const toggleTemperatureUnit = useCallback(() => {
    if (!isMounted) return; // Don't execute during SSR

    const newUnit = initialUnit === "F" ? "C" : "F";
    setTempUnit(newUnit);

    // Only access localStorage on client
    if (typeof window !== "undefined") {
      setTemperatureUnit(newUnit);
    }
  }, [initialUnit, setTempUnit, isMounted]);

  // Get the displayed temperature
  const getDisplayTemperature = useCallback(
    (tempF: number): number => {
      return initialUnit === "F" ? tempF : fahrenheitToCelsius(tempF);
    },
    [initialUnit, fahrenheitToCelsius]
  );

  // Format temperature with unit
  const formatTemperature = useCallback(
    (tempF: number): string => {
      const displayTemp = getDisplayTemperature(tempF);
      return `${displayTemp} °${initialUnit}`;
    },
    [getDisplayTemperature, initialUnit]
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
    isMounted,
  };
}
