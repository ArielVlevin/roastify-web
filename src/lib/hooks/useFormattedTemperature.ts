import { usePreferencesStore } from "@/lib/store/preferencesStore";
import { useIsHydrated } from "./useIsHydrated";

export function useFormattedTemperature(tempInC: number): string {
  const isHydrated = useIsHydrated();
  const unit = usePreferencesStore((state) => state.temperatureUnit);

  if (!isHydrated) return "--.-°";

  const temp = unit === "F" ? (tempInC * 9) / 5 + 32 : tempInC;

  return `${temp.toFixed(1)}°${unit}`;
}
