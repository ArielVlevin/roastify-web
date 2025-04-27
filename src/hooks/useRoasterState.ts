// hooks/useRoasterState.ts
import { useState, useRef } from "react";
import {
  RoastProfile,
  TemperatureData,
  NotificationType,
  CrackStatus,
  PROFILES,
} from "@/lib/types";
import { getTemperatureUnit } from "@/lib/localStorageService";

// Maximum roast duration in seconds (15 minutes = 900 seconds)
export const MAX_DURATION = 15 * 60;

export function useRoasterState() {
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
  const [temperatureUnit, setTempUnit] = useState<"F" | "C">(
    getTemperatureUnit() || "F"
  );

  // Refs
  const fetchingRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

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

    // Refs
    fetchingRef,
    intervalRef,
    startTimeRef,

    // Constants
    MAX_DURATION,
  };
}
