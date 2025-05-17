// lib/store/roastStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  NotificationType,
  CrackStatus,
  RoastProfile,
  PROFILES,
  RoastMarker,
  TemperaturePoint,
} from "@/lib/types";

// Maximum roast duration in seconds (15 minutes = 900 seconds)
export const MAX_DURATION = 15 * 60;

// Define our store state and actions
interface RoastState {
  // State
  isRoasting: boolean;
  time: number;
  selectedProfile: RoastProfile;
  temperature: number;
  temperatureData: TemperaturePoint[];
  roastStage: string;
  crackStatus: CrackStatus;
  notification: NotificationType | null;
  completed: boolean;
  firstCrackTime: number | null;
  secondCrackTime: number | null;
  hasRestoredSession: boolean;
  showRestorePrompt: boolean;
  markers: RoastMarker[];
  startTime: number;

  // Basic setters
  setIsRoasting: (isRoasting: boolean) => void;
  setRoastStage: (stage: string) => void;
  setCompleted: (completed: boolean) => void;

  setTime: (time: number) => void;

  setSelectedProfile: (profile: RoastProfile) => void;

  setTemperature: (temp: number) => void;
  setTemperatureData: (
    data:
      | TemperaturePoint[]
      | ((prev: TemperaturePoint[]) => TemperaturePoint[])
  ) => void;

  setCrackStatus: (status: CrackStatus) => void;
  setFirstCrackTime: (time: number | null) => void;
  setSecondCrackTime: (time: number | null) => void;

  setNotification: (notification: NotificationType | null) => void;

  setHasRestoredSession: (restored: boolean) => void;
  setShowRestorePrompt: (show: boolean) => void;

  setStartTime: (time: number) => void;

  // Helper methods
  formatTime: (seconds: number) => string;

  // Markers management
  setMarkers: (
    markers: RoastMarker[] | ((prev: RoastMarker[]) => RoastMarker[])
  ) => void;
  addMarker: (label: string, color?: string, notes?: string) => void;
  removeMarker: (markerId: string) => void;
  clearMarkers: () => void;

  // Constants
  MAX_DURATION: number;
}

export const useRoastStore = create<RoastState>()(
  persist(
    (set, get) => ({
      // Initial state
      isRoasting: false,
      time: 0,
      selectedProfile: PROFILES[0],
      temperature: 24, // Starting room temperature
      temperatureData: [],
      roastStage: "Green",
      crackStatus: { first: false, second: false },
      notification: null,
      completed: false,
      firstCrackTime: null,
      secondCrackTime: null,
      hasRestoredSession: false,
      showRestorePrompt: false,
      markers: [],
      startTime: 0,
      MAX_DURATION,

      // Basic setters
      setIsRoasting: (isRoasting) => set({ isRoasting }),
      setTime: (time) => set({ time }),
      setSelectedProfile: (selectedProfile: RoastProfile) =>
        set({ selectedProfile }),
      setTemperature: (temperature) => set({ temperature }),
      setTemperatureData: (temperatureData) =>
        set((state) => {
          if (typeof temperatureData === "function") {
            return { temperatureData: temperatureData(state.temperatureData) };
          }
          return { temperatureData };
        }),
      setRoastStage: (roastStage) => set({ roastStage }),
      setCrackStatus: (crackStatus) => set({ crackStatus }),
      setNotification: (notification) => set({ notification }),
      setCompleted: (completed) => set({ completed }),
      setFirstCrackTime: (firstCrackTime) => set({ firstCrackTime }),
      setSecondCrackTime: (secondCrackTime) => set({ secondCrackTime }),
      setHasRestoredSession: (hasRestoredSession) =>
        set({ hasRestoredSession }),
      setShowRestorePrompt: (showRestorePrompt) => set({ showRestorePrompt }),
      setMarkers: (markers) =>
        set((state) => {
          if (typeof markers === "function") {
            return { markers: markers(state.markers) };
          }
          return { markers };
        }),
      setStartTime: (startTime) => set({ startTime }),

      formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
      },

      // Markers management
      addMarker: (label, color = "#333333", notes = "") => {
        const state = get();
        if (!state.isRoasting && state.temperatureData.length === 0) return;

        const currentTemp = state.temperature;
        const currentTime = state.time;
        const id = `marker-${Date.now()}`;

        const newMarker: RoastMarker = {
          id,
          time: currentTime,
          temperature: currentTemp,
          label,
          notes,
          color,
        };

        state.setMarkers((prev) => [...prev, newMarker]);
      },

      removeMarker: (markerId) => {
        get().setMarkers((prev) =>
          prev.filter((marker) => marker.id !== markerId)
        );
      },

      clearMarkers: () => {
        set({ markers: [] });
      },
    }),
    {
      name: "coffee-roaster-storage",
      // Don't persist everything to avoid localStorage bloat
      partialize: (state) => ({
        selectedProfile: state.selectedProfile,

        // Only include these when there's an active roast
        ...(state.isRoasting || state.temperatureData.length > 0
          ? {
              isRoasting: state.isRoasting,
              startTime: state.startTime,
              temperatureData: state.temperatureData,
              crackStatus: state.crackStatus,
              firstCrackTime: state.firstCrackTime,
              secondCrackTime: state.secondCrackTime,
              completed: state.completed,
              markers: state.markers,
            }
          : {}),
      }),
    }
  )
);
