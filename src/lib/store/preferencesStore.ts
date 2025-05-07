// lib/store/preferencesStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TemperatureUnit = "F" | "C";

interface PreferencesState {
  // state
  temperatureUnit: TemperatureUnit;

  // actions
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  toggleTemperatureUnit: () => void;

  // helpers functions
  getDisplayTemperature: (tempInC: number) => number;
  formatTemperature: (tempInC: number) => string;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      temperatureUnit: "C",

      setTemperatureUnit: (temperatureUnit) => set({ temperatureUnit }),

      toggleTemperatureUnit: () =>
        set((state) => ({
          temperatureUnit: state.temperatureUnit === "C" ? "F" : "C",
        })),

      getDisplayTemperature: (tempInC: number) => {
        const { temperatureUnit } = get();
        return temperatureUnit === "F" ? (tempInC * 9) / 5 + 32 : tempInC;
      },

      formatTemperature: (tempInC: number) => {
        const { temperatureUnit, getDisplayTemperature } = get();
        const displayTemp = getDisplayTemperature(tempInC);
        return `${displayTemp.toFixed(1)}°${temperatureUnit}`;
      },
    }),
    {
      name: "coffee-preferences-storage",
    }
  )
);
