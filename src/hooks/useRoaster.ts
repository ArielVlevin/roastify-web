// hooks/useRoaster.ts
import { useState, useEffect, useCallback, useRef } from "react";
import {
  RoastProfile,
  TemperatureData,
  NotificationType,
  CrackStatus,
  PROFILES,
  FIRST_CRACK,
  SECOND_CRACK,
} from "@/lib/types";
import * as api from "@/lib/api";
import {
  saveActiveRoast,
  getActiveRoast,
  clearActiveRoast,
  updateActiveRoast,
} from "@/lib/localStorageService";

const MAX_DURATION = 15; // Maximum time in minutes

export default function useRoaster() {
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

  // Refs
  const fetchingRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const syncStateWithServer = useCallback(async () => {
    try {
      const serverState = await api.syncState({
        is_roasting: isRoasting,
        data: temperatureData,
        start_time: startTimeRef.current,
      });

      console.log("State synchronized with server:", serverState);
      return serverState;
    } catch (error) {
      console.error("Failed to sync state with server:", error);
      return null;
    }
  }, [isRoasting, temperatureData]);

  // Load session from localStorage on initial mount
  useEffect(() => {
    if (hasRestoredSession) return;

    const activeRoast = getActiveRoast();
    if (activeRoast) {
      setShowRestorePrompt(true);
    }

    setHasRestoredSession(true);
  }, [hasRestoredSession]);

  // Restore previous session
  const restoreSession = useCallback(async () => {
    const activeRoast = getActiveRoast();
    if (!activeRoast) return false;

    try {
      // First sync with server to resolve any conflicts
      await syncStateWithServer();

      // Restore data from localStorage
      setTemperatureData(activeRoast.temperatureData);

      // Find and set the selected profile
      const profile =
        PROFILES.find((p) => p.name === activeRoast.selectedProfileName) ||
        PROFILES[1];
      setSelectedProfile(profile);

      // Restore other state
      setCrackStatus(activeRoast.crackStatus);
      setFirstCrackTime(activeRoast.firstCrackTime);
      setSecondCrackTime(activeRoast.secondCrackTime);
      setCompleted(activeRoast.completed);

      // Calculate elapsed time
      const elapsedTime = (Date.now() - activeRoast.startTime) / (1000 * 60); // in minutes
      setTime(Math.min(elapsedTime, MAX_DURATION));

      // Set current temperature from the last data point
      if (activeRoast.temperatureData.length > 0) {
        const lastPoint =
          activeRoast.temperatureData[activeRoast.temperatureData.length - 1];
        setTemperature(lastPoint.temperature);
      }

      startTimeRef.current = activeRoast.startTime;

      // Don't automatically resume roasting, but update UI to reflect restored state
      setIsRoasting(false);
      setNotification({
        type: "info",
        message: "Previous roast session restored. Press Start to continue.",
      });

      setShowRestorePrompt(false);
      return true;
    } catch (error) {
      console.error("Failed to restore session:", error);
      clearActiveRoast();
      return false;
    }
  }, [syncStateWithServer]);

  // Decline restoring previous session
  const declineRestore = useCallback(() => {
    clearActiveRoast();
    setShowRestorePrompt(false);
  }, []);

  // Periodically save session data to localStorage when roasting
  useEffect(() => {
    if (!isRoasting) return;

    const saveInterval = setInterval(() => {
      saveActiveRoast({
        startTime: startTimeRef.current,
        lastUpdated: Date.now(),
        temperatureData,
        selectedProfileName: selectedProfile.name,
        crackStatus,
        firstCrackTime,
        secondCrackTime,
        completed,
      });
    }, 5000); // Save every 5 seconds

    return () => clearInterval(saveInterval);
  }, [
    isRoasting,
    temperatureData,
    selectedProfile,
    crackStatus,
    firstCrackTime,
    secondCrackTime,
    completed,
  ]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isRoasting || temperatureData.length > 0) {
        saveActiveRoast({
          startTime: startTimeRef.current,
          lastUpdated: Date.now(),
          temperatureData,
          selectedProfileName: selectedProfile.name,
          crackStatus,
          firstCrackTime,
          secondCrackTime,
          completed,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [
    isRoasting,
    temperatureData,
    selectedProfile,
    crackStatus,
    firstCrackTime,
    secondCrackTime,
    completed,
  ]);

  // Fetch temperature data from backend
  useEffect(() => {
    if (!isRoasting) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const fetchTemperatureData = async () => {
      if (fetchingRef.current) return; // Prevent multiple simultaneous requests

      fetchingRef.current = true;

      try {
        // Get temperature
        const tempData = await api.getTemperature();
        setTemperature(tempData.temperature);

        // Calculate elapsed time from start time
        const elapsedTime = (Date.now() - startTimeRef.current) / (1000 * 60); // in minutes
        setTime(elapsedTime);

        // Add data point to chart
        setTemperatureData((prevData) => [
          ...prevData,
          { time: elapsedTime, temperature: tempData.temperature },
        ]);

        // Check if maximum time reached
        if (elapsedTime >= MAX_DURATION) {
          await pauseRoast();
          setNotification({
            type: "warning",
            message: "Maximum roast time reached!",
          });
        }
      } catch (error) {
        console.error("Failed to fetch temperature data:", error);
        setNotification({
          type: "warning",
          message: "Failed to fetch temperature data!",
        });
      } finally {
        fetchingRef.current = false;
      }
    };

    // Initial fetch
    fetchTemperatureData();

    // Setup interval for regular updates
    intervalRef.current = setInterval(fetchTemperatureData, 600);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRoasting]);

  // Monitor roast stages
  useEffect(() => {
    // Update roast stage based on temperature
    if (temperature < 200) {
      setRoastStage("Green");
    } else if (temperature < 300) {
      setRoastStage("Yellow");
    } else if (temperature < 350) {
      setRoastStage("Light Brown");
    } else if (temperature < 400) {
      setRoastStage("Medium Brown");
    } else if (temperature < 435) {
      setRoastStage("Dark Brown");
    } else {
      setRoastStage("Nearly Black");
    }

    // First crack detection
    if (
      !crackStatus.first &&
      temperature >= FIRST_CRACK.min &&
      temperature <= FIRST_CRACK.max
    ) {
      setCrackStatus((prev) => ({ ...prev, first: true }));
      setFirstCrackTime(time);
      setNotification({ type: "info", message: "First crack detected!" });
    }

    // Second crack detection
    if (
      !crackStatus.second &&
      temperature >= SECOND_CRACK.min &&
      temperature <= SECOND_CRACK.max
    ) {
      setCrackStatus((prev) => ({ ...prev, second: true }));
      setSecondCrackTime(time);
      setNotification({ type: "info", message: "Second crack detected!" });
    }

    // Check if target profile is reached
    if (
      isRoasting &&
      temperature >= selectedProfile.targetTemp &&
      time >= selectedProfile.duration
    ) {
      pauseRoast();
      setCompleted(true);
      setNotification({
        type: "success",
        message: `${selectedProfile.name} roast completed successfully!`,
      });

      // Also save this state
      updateActiveRoast({ completed: true });
    }
  }, [temperature, isRoasting, time, crackStatus, selectedProfile]);

  // Calculate and send optimal heat level based on temperature and profile
  useEffect(() => {
    if (!isRoasting) return;

    // Determine heat level based on temperature and profile
    const calculateOptimalHeatLevel = () => {
      const targetTemp = selectedProfile.targetTemp;
      const tempDifference = targetTemp - temperature;

      // Linear scale: higher heat when far from target, lower when close
      if (tempDifference > 150) return 10;
      if (tempDifference > 100) return 8;
      if (tempDifference > 50) return 6;
      if (tempDifference > 20) return 5;
      if (tempDifference > 0) return 4;

      // Maintain temperature when at target
      return 3;
    };

    const optimalHeatLevel = calculateOptimalHeatLevel();

    // Only update if heat level needs to change
    if (optimalHeatLevel !== heatLevel) {
      setHeatLevel(optimalHeatLevel);

      // Send to API
      const updateHeatLevel = async () => {
        try {
          await api.setHeatLevel(optimalHeatLevel);
        } catch (error) {
          console.error("Failed to update heat level:", error);
        }
      };

      updateHeatLevel();
    }
  }, [isRoasting, temperature, selectedProfile, heatLevel]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification]);

  // Starting a fresh roast session
  const startRoast = useCallback(async () => {
    try {
      // First try to sync with server
      await syncStateWithServer();

      // If continuing a previous session, use the existing startTime
      if (temperatureData.length > 0 && !completed) {
        // We are continuing a paused session
        try {
          await api.startRoast();
          setIsRoasting(true);
          return;
        } catch (resumeError) {
          // If we get an error (400) trying to resume, we'll try resetting and starting fresh
          console.log(
            "Error trying to resume, attempting reset and restart..."
          );
          await api.resetRoast();
          await api.startRoast();
          setIsRoasting(true);
          return;
        }
      }

      // Starting a fresh roast session
      await api.startRoast();
      setIsRoasting(true);
      setCompleted(false);
      setCrackStatus({ first: false, second: false });
      setFirstCrackTime(null);
      setSecondCrackTime(null);
      setTemperatureData([]);

      // Store the start time
      startTimeRef.current = Date.now();
      setTime(0);

      // Clear any previous roast data
      clearActiveRoast();
    } catch (error) {
      console.error("Failed to start roast process:", error);

      // Check if error is due to roast already in progress
      if (error instanceof Error && error.message.includes("400")) {
        // Try to force reset and start again
        try {
          await api.resetRoast();
          // Try starting again after reset
          await api.startRoast();
          setIsRoasting(true);
          setNotification({
            type: "info",
            message: "Restart successful after reset",
          });
        } catch (resetError) {
          setNotification({
            type: "warning",
            message: "Could not start roast. Try refreshing the page.",
          });
        }
      } else {
        setNotification({
          type: "warning",
          message: "Failed to start roast process!",
        });
      }
    }
  }, [syncStateWithServer, completed, temperatureData.length]);

  // Sync with server on initial mount
  useEffect(() => {
    const initialSync = async () => {
      try {
        await syncStateWithServer();
      } catch (error) {
        console.error("Initial sync failed:", error);
      }
    };

    // Only run once after first render
    if (hasRestoredSession) {
      initialSync();
    }
  }, [syncStateWithServer, hasRestoredSession]);

  const pauseRoast = useCallback(async () => {
    try {
      await api.pauseRoast();
      setIsRoasting(false);
    } catch (error) {
      console.error("Failed to pause roast process:", error);
      setNotification({
        type: "warning",
        message: "Failed to pause roast process!",
      });
    }
  }, []);

  const resetRoast = useCallback(async () => {
    try {
      await api.resetRoast();
      setIsRoasting(false);
      setTime(0);
      setTemperature(70);
      setTemperatureData([]);
      setRoastStage("Green");
      setCrackStatus({ first: false, second: false });
      setFirstCrackTime(null);
      setSecondCrackTime(null);
      setCompleted(false);
      setNotification(null);
      clearActiveRoast();
    } catch (error) {
      console.error("Failed to reset roast process:", error);
      setNotification({
        type: "warning",
        message: "Failed to reset roast process!",
      });
    }
  }, []);

  const selectProfile = useCallback((profileName: string) => {
    const profile = PROFILES.find((p) => p.name === profileName);
    if (profile) {
      setSelectedProfile(profile);
    }
  }, []);

  const saveRoastData = useCallback(
    async (name: string, notes: string = "") => {
      try {
        await api.saveRoast({
          name,
          profile: selectedProfile.name,
          notes,
        });
        setNotification({
          type: "success",
          message: "Roast saved successfully!",
        });

        // Clear active roast after successful save
        clearActiveRoast();
        return true;
      } catch (error) {
        console.error("Failed to save roast:", error);
        setNotification({ type: "warning", message: "Failed to save roast!" });
        return false;
      }
    },
    [selectedProfile.name]
  );

  return {
    // State
    isRoasting,
    time,
    heatLevel,
    selectedProfile,
    temperature,
    temperatureData,
    roastStage,
    crackStatus,
    notification,
    completed,
    firstCrackTime,
    secondCrackTime,
    showRestorePrompt,

    // Actions
    startRoast,
    pauseRoast,
    resetRoast,
    selectProfile,
    saveRoastData,
    restoreSession,
    declineRestore,
    syncStateWithServer,

    // Constants
    profiles: PROFILES,
    maxDuration: MAX_DURATION,
  };
}
