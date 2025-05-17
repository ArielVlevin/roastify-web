"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMarkerStore } from "@/lib/store/markerStore";
import * as Icons from "lucide-react";

const availableIcons = [
  "Zap",
  "Coffee",
  "Star",
  "Bookmark",
  "Flag",
  "Flame",
] as const;

type MarkerIcon = (typeof availableIcons)[number];

export default function ManageMarkersPanel() {
  const { markers, addMarker, removeMarker, resetMarkers } = useMarkerStore();

  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#808080");
  const [icon, setIcon] = useState<MarkerIcon>("Bookmark");

  const handleAdd = () => {
    if (!label.trim()) return;
    addMarker({ label, color, icon });
    setLabel("");
    setColor("#808080");
    setIcon("Bookmark");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Markers</h2>

      {/* List of current markers */}
      <ul className="space-y-2">
        {markers.map((marker) => {
          const Icon = Icons[marker.icon || "Bookmark"];
          return (
            <li
              key={marker.label}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} style={{ color: marker.color }} />
                <span>{marker.label}</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeMarker(marker.label)}
              >
                Delete
              </Button>
            </li>
          );
        })}
      </ul>

      {/* Add new marker */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-medium">Add New Marker</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />

          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          <select
            className="border rounded px-2 py-1"
            value={icon}
            onChange={(e) => setIcon(e.target.value as MarkerIcon)}
          >
            {availableIcons.map((ic) => (
              <option key={ic} value={ic}>
                {ic}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={handleAdd}>Add Marker</Button>
        <Button variant="outline" onClick={resetMarkers} className="ml-2">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
