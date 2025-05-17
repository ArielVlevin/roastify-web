// lib/hooks/useRoaster.ts
import { useCallback, useEffect, useRef } from "react";
import { useRoastStore } from "@/lib/store/roastStore";
import { useApiStore } from "@/lib/store/apiStore";
import { PROFILES } from "@/lib/types";

/**
 * Main hook for using the roast store with API integration
 */
export default function useRoaster() {
  // Reference to our interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get everything from the stores
  const roastStore = useRoastStore();
  const apiStore = useApiStore();

  // Setup temperature fetch interval when roasting
  useEffect(() => {
    // Clear any existing interval when component using this hook mounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!roastStore.isRoasting) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Setup interval for regular updates - 1 second
    intervalRef.current = setInterval(() => {
      apiStore.fetchTemperature();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [roastStore.isRoasting, apiStore]);

  // Auto clear notifications after 3 seconds
  useEffect(() => {
    if (!roastStore.notification) return;

    const timer = setTimeout(() => {
      roastStore.setNotification(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [roastStore]);

  // Load session from localStorage on initial mount
  useEffect(() => {
    if (roastStore.hasRestoredSession) return;

    apiStore.checkForActiveRoast();
    roastStore.setHasRestoredSession(true);
  }, [apiStore, roastStore]);

  // Periodic sync with server when roasting
  useEffect(() => {
    if (!roastStore.isRoasting) return;

    // Sync every 10 seconds
    const syncInterval = setInterval(() => {
      apiStore.syncWithServer().catch(console.error);
    }, 10000);

    return () => clearInterval(syncInterval);
  }, [roastStore.isRoasting, apiStore]);

  // Helper to select a profile by name
  const selectProfile = useCallback(
    (profileName: string) => {
      if (profileName === roastStore.selectedProfile.name) return;

      const profile = PROFILES.find((p) => p.name === profileName);
      if (profile) roastStore.setSelectedProfile(profile);
      else console.warn(`Profile with name '${profileName}' not found`);
    },
    [roastStore]
  );

  // Start roast with API integration
  const startRoast = useCallback(
    async (profileName?: string) => {
      try {
        if (profileName) selectProfile(profileName);

        await apiStore.startRoastProcess();
        roastStore.setIsRoasting(true);

        // If we don't have a start time yet, set it
        if (!roastStore.startTime) roastStore.setStartTime(Date.now());
      } catch (error) {
        console.error("Failed to start roast:", error);
        roastStore.setNotification({
          type: "warning",
          message: "Failed to start roast process!",
        });
      }
    },
    [apiStore, roastStore, selectProfile]
  );

  // Pause roast with API integration
  const pauseRoast = useCallback(async () => {
    try {
      await apiStore.pauseRoastProcess();
      roastStore.setIsRoasting(false);
    } catch (error) {
      console.error("Failed to pause roast:", error);
      roastStore.setNotification({
        type: "warning",
        message: "Failed to pause roast process!",
      });
    }
  }, [roastStore, apiStore]);

  // Reset roast with API integration
  const resetRoast = useCallback(async () => {
    try {
      await apiStore.resetRoastProcess();

      // Reset local state
      roastStore.setIsRoasting(false);
      roastStore.setTime(0);
      roastStore.setTemperature(24);
      roastStore.setTemperatureData([]);
      roastStore.setRoastStage("Green");
      roastStore.setCrackStatus({ first: false, second: false });
      roastStore.setFirstCrackTime(null);
      roastStore.setSecondCrackTime(null);
      roastStore.setCompleted(false);
      roastStore.setNotification(null);
      roastStore.setStartTime(0);
      roastStore.setSelectedProfile(PROFILES[0]);
      roastStore.clearMarkers();
    } catch (error) {
      console.error("Failed to reset roast:", error);
      roastStore.setNotification({
        type: "warning",
        message: "Failed to reset roast process!",
      });
    }
  }, [apiStore, roastStore]);

  // Save roast data with API integration
  const saveRoastData = useCallback(
    async (name: string, notes: string = "") => {
      try {
        const success = await apiStore.saveRoastData({
          name,
          profile: roastStore.selectedProfile.name,
          notes,
          markers: roastStore.markers,
        });

        console.log("\nSaved roast:\n", success);
        await resetRoast();

        return success;
      } catch (error) {
        console.error("Failed to save roast:", error);
        roastStore.setNotification({
          type: "warning",
          message: "Failed to save roast!",
        });
        return false;
      }
    },
    [apiStore, roastStore, resetRoast]
  );

  // Restore session with API integration
  const restoreSession = useCallback(async () => {
    try {
      // First sync with server
      await apiStore.syncWithServer();

      // Then start the roast process if not active
      if (!roastStore.isRoasting) {
        await apiStore.startRoastProcess();
        roastStore.setIsRoasting(true);
      }

      roastStore.setShowRestorePrompt(false);
      roastStore.setNotification({
        type: "info",
        message: "Previous roast session restored!",
      });

      return true;
    } catch (error) {
      console.error("Failed to restore session:", error);
      roastStore.setNotification({
        type: "warning",
        message: "Failed to restore previous session!",
      });
      roastStore.setShowRestorePrompt(false);
      return false;
    }
  }, [apiStore, roastStore]);

  // Decline restore
  const declineRestore = useCallback(async () => {
    await resetRoast();
    roastStore.setShowRestorePrompt(false);
  }, [resetRoast, roastStore]);

  // Return combined API from both stores plus additional methods
  return {
    // State from roastStore
    ...roastStore,

    // API loading state
    isLoading: apiStore.isLoading,
    error: apiStore.error,

    // Override methods with API-integrated versions
    startRoast,
    pauseRoast,
    resetRoast,
    saveRoastData,
    restoreSession,
    declineRestore,

    // Helper functions
    selectProfile,

    // Constants
    profiles: PROFILES,
    maxDuration: roastStore.MAX_DURATION,
  };
}
