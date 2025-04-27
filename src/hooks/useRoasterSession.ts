// hooks/useRoasterSession.ts
import { useCallback } from "react";
import {
  RoastProfile,
  TemperatureData,
  NotificationType,
  CrackStatus,
  PROFILES,
} from "@/lib/types";
import * as api from "@/lib/api";
import {
  saveActiveRoast,
  getActiveRoast,
  clearActiveRoast,
} from "@/lib/localStorageService";

type SessionProps = {
  setTemperatureData: (data: TemperatureData[]) => void;
  setSelectedProfile: (profile: RoastProfile) => void;
  setCrackStatus: (status: CrackStatus) => void;
  setFirstCrackTime: (time: number | null) => void;
  setSecondCrackTime: (time: number | null) => void;
  setCompleted: (completed: boolean) => void;
  setTime: (time: number) => void;
  setTemperature: (temp: number) => void;
  startTimeRef: React.MutableRefObject<number>;
  setIsRoasting: (isRoasting: boolean) => void;
  setNotification: (notification: NotificationType | null) => void;
  setShowRestorePrompt: (show: boolean) => void;
  resetRoast: () => Promise<void>;
  syncStateWithServer: () => Promise<any>;
  selectedProfile: RoastProfile;
  MAX_DURATION: number;
};

export function useRoasterSession({
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
}: SessionProps) {
  // Restore previous session with auto-start feature
  const restoreSession = useCallback(async () => {
    const activeRoast = getActiveRoast();
    if (!activeRoast) return false;

    try {
      // First sync with server to resolve any conflicts
      const serverState = await syncStateWithServer();

      // Get updated data points from server
      let updatedTemperatureData = [...activeRoast.temperatureData];

      // Check if server has data points
      if (
        serverState &&
        serverState.data_points &&
        serverState.data_points.length > 0
      ) {
        // Find the latest local data point time
        const lastLocalPointTime =
          updatedTemperatureData.length > 0
            ? updatedTemperatureData[updatedTemperatureData.length - 1].time
            : -1;

        console.log(`Last local data point time: ${lastLocalPointTime}`);
        console.log(`Server has ${serverState.data_points.length} data points`);

        // Add only new data points from server
        const newServerPoints = serverState.data_points.filter(
          (serverPoint: { time: number }) =>
            serverPoint.time > lastLocalPointTime
        );

        if (newServerPoints.length > 0) {
          console.log(
            `Adding ${newServerPoints.length} new data points from server`
          );

          // Merge data in correct time order
          updatedTemperatureData = [
            ...updatedTemperatureData,
            ...newServerPoints,
          ];

          // Sort by time in case of out-of-order points
          updatedTemperatureData.sort((a, b) => a.time - b.time);

          // Update local storage with new data
          saveActiveRoast({
            ...activeRoast,
            temperatureData: updatedTemperatureData,
            lastUpdated: Date.now(),
          });
        }
      }

      // Restore data from merged data
      setTemperatureData(updatedTemperatureData);

      // Find and set the selected profile
      const profile =
        PROFILES.find((p) => p.name === activeRoast.selectedProfileName) ||
        PROFILES[1];
      setSelectedProfile(profile);

      // Get updated crack status from server if available
      let updatedCrackStatus = activeRoast.crackStatus;
      if (serverState && serverState.crack_status) {
        updatedCrackStatus = {
          first:
            activeRoast.crackStatus.first || serverState.crack_status.first,
          second:
            activeRoast.crackStatus.second || serverState.crack_status.second,
        };
      }

      // Restore other state
      setCrackStatus(updatedCrackStatus);
      setFirstCrackTime(activeRoast.firstCrackTime);
      setSecondCrackTime(activeRoast.secondCrackTime);

      // Check if roast was completed on server
      let isCompleted = activeRoast.completed;
      if (
        serverState &&
        serverState.elapsed_time >= selectedProfile.duration * 60 &&
        serverState.temperature >= selectedProfile.targetTemp
      ) {
        isCompleted = true;
      }
      setCompleted(isCompleted);

      // Get elapsed time from server if available, otherwise from local storage
      const elapsedTime =
        serverState && serverState.elapsed_time
          ? serverState.elapsed_time
          : Math.floor((Date.now() - activeRoast.startTime) / 1000);

      setTime(Math.min(elapsedTime, MAX_DURATION));

      // Set current temperature - prefer server data
      if (serverState && serverState.temperature) {
        setTemperature(serverState.temperature);
      } else if (updatedTemperatureData.length > 0) {
        const lastPoint =
          updatedTemperatureData[updatedTemperatureData.length - 1];
        setTemperature(lastPoint.temperature);
      }

      // Store original start time
      startTimeRef.current = activeRoast.startTime;

      // Auto-start roast if not completed
      if (!isCompleted && serverState && serverState.is_roasting) {
        // If server is already roasting, just update local state
        setIsRoasting(true);
        setNotification({
          type: "info",
          message: "Previous roast session restored and automatically resumed.",
        });
      } else if (!isCompleted) {
        try {
          // Start roast process on server
          await api.startRoast();
          // Update local state
          setIsRoasting(true);
          setNotification({
            type: "info",
            message:
              "Previous roast session restored and automatically resumed.",
          });
        } catch (error) {
          console.error("Failed to auto-start restored roast:", error);
          setNotification({
            type: "warning",
            message:
              "Roast restored but could not be started automatically. Please start manually.",
          });
          setIsRoasting(false);
        }
      } else {
        // If roast was completed, don't auto-start
        setIsRoasting(false);
        setNotification({
          type: "info",
          message: "Completed roast session restored.",
        });
      }

      setShowRestorePrompt(false);
      return true;
    } catch (error) {
      console.error("Failed to restore session:", error);
      clearActiveRoast();
      return false;
    }
  }, [
    MAX_DURATION,
    selectedProfile,
    setCrackStatus,
    setCompleted,
    setFirstCrackTime,
    setIsRoasting,
    setNotification,
    setSecondCrackTime,
    setSelectedProfile,
    setShowRestorePrompt,
    setTemperature,
    setTemperatureData,
    setTime,
    startTimeRef,
    syncStateWithServer,
  ]);

  // Decline restoring previous session
  const declineRestore = useCallback(() => {
    clearActiveRoast();
    resetRoast();
    setShowRestorePrompt(false);
  }, [resetRoast, setShowRestorePrompt]);

  return {
    restoreSession,
    declineRestore,
  };
}
