"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { useMarkerStore } from "@/lib/store/markerStore"; // ⬅️ ה־store שלך
import { Marker } from "@/lib/types";

interface MarkerButtonsProps {
  onAddMarker: (marker: Marker) => void;
  disabled: boolean;
  className?: string;
}

const MarkerButtons: React.FC<MarkerButtonsProps> = ({
  onAddMarker,
  disabled,
  className,
}) => {
  const markers = useMarkerStore((state) => state.markers);

  return (
    <div className={cn(className, "flex flex-wrap gap-2 mt-4")}>
      {markers.map(({ label, color, icon }) => {
        const Icon = Icons[icon || "Bookmark"]; // fallback
        return (
          <Button
            key={label}
            onClick={() => onAddMarker({ label, color, icon })}
            disabled={disabled}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 h-8"
          >
            <Icon size={14} style={{ color }} />
            {label}
          </Button>
        );
      })}
    </div>
  );
};

export default MarkerButtons;
