// hooks/useRoaster.ts
import { useEffect } from "react";
import { PROFILES } from "@/lib/types";
import * as api from "@/lib/api";
import { saveActiveRoast, getActiveRoast } from "@/lib/localStorageService";

// Import modular hooks
import { useRoasterState } from "./useRoasterState";
import { useTemperatureHandling } from "./useTemperatureHandling";
import { useRoasterSync } from "./useRoasterSync";
import { useRoasterControls } from "./useRoasterControls";
import { useRoasterMonitoring } from "./useRoasterMonitoring";
import { useRoasterSession } from "./useRoasterSession";

export default function useRoaster() {
  // Get all state from state hook
  const state = useRoasterState();
  const {
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
    fetchingRef,
    intervalRef,
    startTimeRef,
    MAX_DURATION,
  } = state;

  // Temperature handling hooks
  const {
    toggleTemperatureUnit,
    getDisplayTemperature,
    formatTemperature,
    formatTime,
  } = useTemperatureHandling(temperatureUnit, setTempUnit);

  // Server sync hooks
  const { syncStateWithServer, checkForActiveRoast } = useRoasterSync({
    isRoasting,
    temperatureData,
    startTimeRef,
    crackStatus,
    selectedProfile,
    setShowRestorePrompt,
    showRestorePrompt, // הוסף את המשתנה כאן
  });

  // Roast reset function - define it early because it's needed by other hooks
  const resetRoast = async () => {
    try {
      await api.resetRoast();

      // Check if server actually reset
      const serverState = await api.getRoastStatus();

      // If server still roasting or time not reset, try force reset
      if (serverState.is_roasting || serverState.elapsed_time > 0) {
        console.log("Server not properly reset, trying force reset");
        await api.forceResetRoast();
      }

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

      // תיקון שימוש ב-&&
      if (getActiveRoast()) {
        saveActiveRoast({
          startTime: 0,
          lastUpdated: Date.now(),
          temperatureData: [],
          selectedProfileName: selectedProfile.name,
          crackStatus: { first: false, second: false },
          firstCrackTime: null,
          secondCrackTime: null,
          completed: false,
        });
      }

      // Reset start time
      startTimeRef.current = 0;
    } catch (error) {
      console.error("Failed to reset roast process:", error);
      setNotification({
        type: "warning",
        message: "Failed to reset roast process!",
      });
    }
  };

  // Control hooks
  const { pauseRoast, startRoast } = useRoasterControls({
    isRoasting,
    setIsRoasting,
    resetRoast,
    temperatureData,
    completed,
    startTimeRef,
    setTime,
    setCompleted,
    setCrackStatus,
    setFirstCrackTime,
    setSecondCrackTime,
    setTemperatureData,
    setNotification,
    syncStateWithServer,
    MAX_DURATION,
  });

  // Monitoring hooks
  const { calculateOptimalHeatLevel } = useRoasterMonitoring({
    isRoasting,
    temperature,
    setTemperature,
    time,
    setTime,
    roastStage,
    setRoastStage,
    crackStatus,
    setCrackStatus,
    firstCrackTime,
    setFirstCrackTime,
    secondCrackTime,
    setSecondCrackTime,
    completed,
    setCompleted,
    temperatureData,
    setTemperatureData,
    notification,
    setNotification,
    fetchingRef,
    intervalRef,
    startTimeRef,
    selectedProfile,
    pauseRoast,
    MAX_DURATION,
  });

  // Session hooks
  const { restoreSession, declineRestore } = useRoasterSession({
    setTemperatureData,
    setSelectedProfile,
    setCrackStatus,
    setFirstCrackTime,
    setSecondCrackTime,
    setCompleted,
    setTime,
    setTemperature,
    startTimeRef,
    setIsRoasting,
    setNotification,
    setShowRestorePrompt,
    resetRoast,
    syncStateWithServer,
    selectedProfile,
    MAX_DURATION,
  });

  // Function to select a profile
  const selectProfile = (profileName: string) => {
    const profile = PROFILES.find((p) => p.name === profileName);
    if (profile) {
      setSelectedProfile(profile);
    }
  };

  // Function to save roast data
  const saveRoastData = async (name: string, notes: string = "") => {
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
      return true;
    } catch (error) {
      console.error("Failed to save roast:", error);
      setNotification({
        type: "warning",
        message: "Failed to save roast!",
      });
      return false;
    }
  };

  // Load session from localStorage on initial mount
  useEffect(() => {
    if (hasRestoredSession) return;

    const activeRoast = getActiveRoast();
    if (activeRoast) {
      setShowRestorePrompt(true);
    }

    setHasRestoredSession(true);
  }, [hasRestoredSession, setHasRestoredSession, setShowRestorePrompt]);

  // Check for active roast on the server after initial load
  useEffect(() => {
    if (hasRestoredSession) {
      checkForActiveRoast();
    }
  }, [hasRestoredSession, checkForActiveRoast]);

  // Calculate and send optimal heat level based on temperature and profile
  useEffect(() => {
    if (!isRoasting) return;

    const optimalHeatLevel = calculateOptimalHeatLevel(
      temperature,
      selectedProfile
    );

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
  }, [
    isRoasting,
    temperature,
    selectedProfile,
    heatLevel,
    calculateOptimalHeatLevel,
    setHeatLevel,
  ]);

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
    startTimeRef,
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
    startTimeRef,
  ]);

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

  return {
    // State
    isRoasting,
    time,
    heatLevel,
    selectedProfile,
    temperature, // Always in Fahrenheit internally
    temperatureData, // Always in Fahrenheit internally
    roastStage,
    crackStatus,
    notification,
    completed,
    firstCrackTime,
    secondCrackTime,
    showRestorePrompt,
    temperatureUnit,

    // Temperature handling
    getDisplayTemperature,
    formatTemperature,
    toggleTemperatureUnit,

    // Actions
    startRoast,
    pauseRoast,
    resetRoast,
    selectProfile,
    saveRoastData,
    restoreSession,
    declineRestore,
    syncStateWithServer,
    formatTime,

    // Constants
    profiles: PROFILES,
    maxDuration: MAX_DURATION,
  };
}
