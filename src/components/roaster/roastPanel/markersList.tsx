import { X } from "lucide-react";
import type { RoastMarker } from "@/lib/types";
import { usePreferencesStore } from "@/lib/store/preferencesStore";
import * as Icons from "lucide-react";
interface MarkerListProps {
  markers: RoastMarker[];
  removeMarker: (id: string) => void;
}

const MarkerList = ({ markers, removeMarker }: MarkerListProps) => {
  const formatTemperature = usePreferencesStore(
    (state) => state.formatTemperature
  );

  if (markers.length === 0) return null;

  return (
    <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-border">
      <h3 className="text-sm font-medium mb-2">Markings added</h3>
      <div className="text-xs space-y-1">
        {markers.map((marker) => {
          const Icon = Icons[marker.icon || "Bookmark"];
          return (
            <div key={marker.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {marker.icon ? (
                  <Icon size={14} style={{ color: marker.color || "#333" }} />
                ) : (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: marker.color || "#333" }}
                  />
                )}

                <span>{marker.label}</span>
                <span className="text-muted-foreground">
                  {Math.floor(marker.time / 60)}:
                  {(marker.time % 60).toString().padStart(2, "0")},{" "}
                  {formatTemperature(marker.temperature)}
                </span>
              </div>
              <button
                onClick={() => removeMarker(marker.id)}
                className="text-muted-foreground hover:text-destructive size-8"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarkerList;
