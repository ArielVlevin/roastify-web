// hooks/useRoasterControls.ts
import { useCallback } from "react";
import * as api from "@/lib/api";
import { RoastProfile, TemperatureData, NotificationType } from "@/lib/types";
import { clearActiveRoast } from "@/lib/localStorageService";

type ControlProps = {
  isRoasting: boolean;
  setIsRoasting: (isRoasting: boolean) => void;
  resetRoast: () => Promise<void>;
  temperatureData: TemperatureData[];
  completed: boolean;
  startTimeRef: React.MutableRefObject<number>;
  setTime: (time: number) => void;
  setCompleted: (completed: boolean) => void;
  setCrackStatus: (crackStatus: any) => void;
  setFirstCrackTime: (time: number | null) => void;
  setSecondCrackTime: (time: number | null) => void;
  setTemperatureData: (
    data: TemperatureData[] | ((prev: TemperatureData[]) => TemperatureData[])
  ) => void;
  setNotification: (notification: NotificationType | null) => void;
  syncStateWithServer: () => Promise<any>;
  MAX_DURATION: number;
};

export function useRoasterControls({
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
}: ControlProps) {
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
  }, [setIsRoasting, setNotification]);

  const startRoast = useCallback(async () => {
    try {
      // Check server status before starting
      const serverState = await api.getRoastStatus();

      // Reset if maximum time reached
      if (serverState.elapsed_time >= MAX_DURATION) {
        console.log(
          "Maximum roast time detected before starting, resetting first"
        );
        await resetRoast();
      }

      // Sync with server
      await syncStateWithServer();

      // If continuing a previous session
      if (temperatureData.length > 0 && !completed) {
        try {
          await api.startRoast();
          setIsRoasting(true);
          return;
        } catch (resumeError) {
          console.log(
            "Error trying to resume, attempting reset and restart..."
          );
          await resetRoast();
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
        try {
          await resetRoast();
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
  }, [
    MAX_DURATION,
    completed,
    resetRoast,
    setCrackStatus,
    setCompleted,
    setFirstCrackTime,
    setIsRoasting,
    setNotification,
    setSecondCrackTime,
    setTemperatureData,
    setTime,
    startTimeRef,
    syncStateWithServer,
    temperatureData,
  ]);

  const selectProfile = useCallback(
    (profileName: string, profiles: RoastProfile[]) => {
      const profile = profiles.find((p) => p.name === profileName);
      return profile;
    },
    []
  );

  const saveRoastData = useCallback(
    async (
      name: string,
      notes: string,
      selectedProfile: RoastProfile,
      setNotification: (notification: NotificationType | null) => void
    ) => {
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
    []
  );

  return {
    pauseRoast,
    startRoast,
    selectProfile,
    saveRoastData,
  };
}
