"use client";

import { useState, useRef, useEffect } from "react";
import {
  RoastProfile,
  TemperatureData,
  NotificationType,
  CrackStatus,
  PROFILES,
  RoastMarker,
} from "@/lib/types";
import { getTemperatureUnit } from "@/lib/localStorageService";

// Maximum roast duration in seconds (15 minutes = 900 seconds)
export const MAX_DURATION = 15 * 60;

export function useRoasterState() {
  // Client-side mounted state
  const [isMounted, setIsMounted] = useState(false);

  // State
  const [isRoasting, setIsRoasting] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [heatLevel, setHeatLevel] = useState<number>(5);
  const [selectedProfile, setSelectedProfile] = useState<RoastProfile>(
    PROFILES[1]
  ); // Default to Full City
  const [temperature, setTemperature] = useState<number>(70); // Starting room temperature
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([]);
  const [roastStage, setRoastStage] = useState<string>("Green");
  const [crackStatus, setCrackStatus] = useState<CrackStatus>({
    first: false,
    second: false,
  });
  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );
  const [completed, setCompleted] = useState<boolean>(false);
  const [firstCrackTime, setFirstCrackTime] = useState<number | null>(null);
  const [secondCrackTime, setSecondCrackTime] = useState<number | null>(null);
  const [hasRestoredSession, setHasRestoredSession] = useState<boolean>(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState<boolean>(false);

  const [markers, setMarkers] = useState<RoastMarker[]>([]);

  // IMPORTANT: Use a consistent default value for server-side rendering
  // Don't call getTemperatureUnit() during initialization
  const [temperatureUnit, setTempUnit] = useState<"F" | "C">("F");

  // Refs
  const fetchingRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // After hydration, load preferences from localStorage
  useEffect(() => {
    setIsMounted(true);

    // Now it's safe to access localStorage
    const savedUnit = getTemperatureUnit();
    if (savedUnit !== temperatureUnit) {
      setTempUnit(savedUnit);
    }
  }, [temperatureUnit]);

  return {
    // State
    isRoasting,
    setIsRoasting,
    time,
    setTime,
    heatLevel,
    setHeatLevel,
    selectedProfile,
    setSelectedProfile,
    temperature,
    setTemperature,
    temperatureData,
    setTemperatureData,
    roastStage,
    setRoastStage,
    crackStatus,
    setCrackStatus,
    notification,
    setNotification,
    completed,
    setCompleted,
    firstCrackTime,
    setFirstCrackTime,
    secondCrackTime,
    setSecondCrackTime,
    hasRestoredSession,
    setHasRestoredSession,
    showRestorePrompt,
    setShowRestorePrompt,
    temperatureUnit,
    setTempUnit,
    isMounted,
    markers,
    setMarkers,

    // Refs
    fetchingRef,
    intervalRef,
    startTimeRef,

    // Constants
    MAX_DURATION,
  };
}
