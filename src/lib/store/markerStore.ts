// lib/store/markerStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Marker } from "../types";
import { defaultMarkers } from "../data/defaultMarkers";

interface MarkerState {
  markers: Marker[];
  addMarker: (marker: Marker) => void;
  removeMarker: (label: string) => void;
  resetMarkers: () => void;
}

export const useMarkerStore = create<MarkerState>()(
  persist(
    (set, get) => ({
      markers: defaultMarkers,
      addMarker: (marker) => set({ markers: [...get().markers, marker] }),
      removeMarker: (label) =>
        set({ markers: get().markers.filter((m) => m.label !== label) }),
      resetMarkers: () => set({ markers: defaultMarkers }),
    }),
    {
      name: "user-markers-storage",
    }
  )
);
