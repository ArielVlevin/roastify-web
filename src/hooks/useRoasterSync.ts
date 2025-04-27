// hooks/useRoasterSync.ts
import { useCallback } from "react";
import * as api from "@/lib/api";
import { TemperatureData, CrackStatus, RoastProfile } from "@/lib/types";
import { saveActiveRoast, getActiveRoast } from "@/lib/localStorageService";

type RoasterStateProps = {
  isRoasting: boolean;
  temperatureData: TemperatureData[];
  startTimeRef: React.MutableRefObject<number>;
  crackStatus: CrackStatus;
  selectedProfile: RoastProfile;
  setShowRestorePrompt: (show: boolean) => void;
  showRestorePrompt: boolean; // הוספת המשתנה כפרמטר
};

export function useRoasterSync({
  isRoasting,
  temperatureData,
  startTimeRef,
  crackStatus,
  selectedProfile,
  setShowRestorePrompt,
  showRestorePrompt, // יש להוסיף גם כאן
}: RoasterStateProps) {
  const syncStateWithServer = useCallback(async () => {
    try {
      const serverState = await api.syncState({
        is_roasting: isRoasting,
        data: temperatureData,
        start_time: startTimeRef.current,
        crack_status: crackStatus,
      });

      console.log("State synchronized with server:", serverState);

      if (serverState && !isRoasting && serverState.is_roasting) {
        console.log("Server thinks roasting is active but client doesn't");
      }

      return serverState;
    } catch (error) {
      console.error("Failed to sync state with server:", error);
      return null;
    }
  }, [isRoasting, temperatureData, startTimeRef, crackStatus]);

  const checkForActiveRoast = useCallback(async () => {
    try {
      const activeRoast = getActiveRoast();
      const serverState = await api.checkActiveRoast();

      console.log("Checking for active roast:", {
        localActive: !!activeRoast,
        serverActive: serverState.is_roasting,
      });

      if (serverState.is_roasting && !activeRoast && !showRestorePrompt) {
        console.log("Active roast found on server but not in local storage");

        const newActiveRoast = {
          startTime: serverState.start_time * 1000, // Convert seconds to milliseconds
          lastUpdated: Date.now(),
          temperatureData: serverState.data_points || [],
          selectedProfileName: selectedProfile.name,
          crackStatus: serverState.crack_status || {
            first: false,
            second: false,
          },
          firstCrackTime: null,
          secondCrackTime: null,
          completed: false,
        };

        saveActiveRoast(newActiveRoast);
        setShowRestorePrompt(true);
      }
    } catch (error) {
      console.error("Error checking for active roast:", error);
    }
  }, [selectedProfile, setShowRestorePrompt, showRestorePrompt]);

  return {
    syncStateWithServer,
    checkForActiveRoast,
  };
}
