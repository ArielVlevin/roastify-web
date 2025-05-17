// lib/store/apiStore.ts
import { create } from "zustand";
import * as api from "@/lib/api";
import { useRoastStore } from "@/lib/store/roastStore";
import { CrackStatus, RoastMarker } from "@/lib/types";
import { useErrorStore } from "@/components/errorModal";

// טיפוס למצב של API
interface ApiState {
  // מצבים
  isLoading: boolean;
  error: string | null;
  lastSyncTime: number | null;

  // פעולות
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // פעולות API
  fetchTemperature: () => Promise<void>;
  startRoastProcess: () => Promise<void>;
  pauseRoastProcess: () => Promise<void>;
  resetRoastProcess: () => Promise<void>;
  syncWithServer: () => Promise<void>;
  saveRoastData: (data: {
    name: string;
    profile: string;
    notes?: string;
    markers: RoastMarker[];
    crack_status: CrackStatus;
  }) => Promise<boolean>;
  checkForActiveRoast: () => Promise<void>;
}

export const useApiStore = create<ApiState>()((set, get) => ({
  //state
  isLoading: false,
  error: null,
  lastSyncTime: null,

  // base functions
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => {
    if (error)
      useErrorStore.getState().showError("Failed to sync with server", error);
    set({ error });
  },
  clearError: () => set({ error: null }),

  fetchTemperature: async () => {
    const roastStore = useRoastStore.getState();

    if (!roastStore.isRoasting || get().isLoading) return;

    try {
      set({ isLoading: true, error: null });
      const tempData = await api.getTemperature();

      // update temperature in store
      roastStore.setTemperature(tempData.temperature);

      // calculate elapsed time
      const elapsedTime =
        tempData.elapsed_time !== undefined
          ? tempData.elapsed_time
          : Math.floor((Date.now() - roastStore.startTime) / 1000);
      // update time in store
      roastStore.setTime(elapsedTime);

      // update points in store
      roastStore.setTemperatureData((prevData) => [
        ...prevData,
        {
          time: elapsedTime,
          temperature: tempData.temperature,
          environmentTemp: tempData.environment_temp,
          heatLevel: tempData.heat_level,
        },
      ]);

      if (tempData.crack_status) {
        roastStore.setCrackStatus(tempData.crack_status);

        if (tempData.crack_status.first && roastStore.firstCrackTime === null) {
          roastStore.setFirstCrackTime(elapsedTime);
          roastStore.setNotification({
            type: "info",
            message: "First crack detected!",
          });
        }

        if (
          tempData.crack_status.second &&
          roastStore.secondCrackTime === null
        ) {
          roastStore.setSecondCrackTime(elapsedTime);
          roastStore.setNotification({
            type: "info",
            message: "Second crack detected!",
          });
        }
      }

      // Check if the roast has reached its maximum duration
      if (elapsedTime >= roastStore.MAX_DURATION) {
        await get().pauseRoastProcess();
        roastStore.setNotification({
          type: "warning",
          message: "Maximum roast time reached!",
        });
      }

      set({ isLoading: false });
    } catch (error) {
      console.error("Failed to fetch temperature data:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      roastStore.setNotification({
        type: "warning",
        message: "Failed to fetch temperature data!",
      });
    }
  },

  // star tRoast Process in backend
  startRoastProcess: async () => {
    const roastStore = useRoastStore.getState();

    try {
      set({ isLoading: true, error: null });
      const result = await api.startRoast();
      set({ isLoading: false });

      // עדכון זמן התחלה בstore
      if (!roastStore.startTime) {
        roastStore.setStartTime(Date.now());
      }

      return result;
    } catch (error) {
      console.error("Failed to start roast process:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  },

  pauseRoastProcess: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await api.pauseRoast();
      set({ isLoading: false });
      return result;
    } catch (error) {
      console.error("Failed to pause roast process:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  },

  // איפוס תהליך הקלייה בשרת
  resetRoastProcess: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await api.resetRoast();

      // בדיקה אם השרת אופס בהצלחה
      const serverState = await api.getRoastStatus();

      // אם השרת עדיין בקלייה או שהזמן לא אופס, ננסה איפוס מאולץ
      if (serverState.is_roasting || serverState.elapsed_time > 0) {
        console.log("Server not properly reset, trying force reset");
        await api.forceResetRoast();
      }

      set({ isLoading: false });
      return result;
    } catch (error) {
      console.error("Failed to reset roast process:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  },

  // סנכרון עם השרת
  syncWithServer: async () => {
    const roastStore = useRoastStore.getState();

    try {
      set({ isLoading: true, error: null });

      // שליחת המצב לשרת
      const result = await api.syncState({
        is_roasting: roastStore.isRoasting,
        data: roastStore.temperatureData,
        start_time: roastStore.startTime,
        crack_status: roastStore.crack_status,
      });

      set({ isLoading: false, lastSyncTime: Date.now() });
      return result;
    } catch (error) {
      console.error("Failed to sync with server:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  },

  // שמירת הקלייה בשרת
  saveRoastData: async (data) => {
    const roastStore = useRoastStore.getState();

    console.log("what user send when save: ", data);
    try {
      set({ isLoading: true, error: null });
      const response = await api.saveRoast(data);

      console.log(" Saved roast data:", response);
      set({ isLoading: false });
      roastStore.setNotification({
        type: "success",
        message: "Roast saved successfully!",
      });

      return true;
    } catch (error) {
      console.error("Failed to save roast:", error);

      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      roastStore.setNotification({
        type: "warning",
        message: "Failed to save roast!",
      });

      return false;
    }
  },

  // בדיקה אם יש קלייה פעילה בשרת
  checkForActiveRoast: async () => {
    const roastStore = useRoastStore.getState();

    try {
      set({ isLoading: true, error: null });
      const serverState = await api.checkActiveRoast();

      console.log("Checking for active roast:", {
        serverActive: serverState.is_roasting,
      });

      if (serverState.is_roasting && !roastStore.showRestorePrompt) {
        console.log("Active roast found on server");

        roastStore.setShowRestorePrompt(true);
        roastStore.setStartTime(serverState.start_time * 1000); // המרה ממילישניות לשניות

        // אם יש נקודות נתונים בשרת, נשמור אותן
        if (serverState.data_points && serverState.data_points.length > 0) {
          roastStore.setTemperatureData(serverState.data_points);
        }
      }

      set({ isLoading: false });
    } catch (error) {
      console.error("Error checking for active roast:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
}));
