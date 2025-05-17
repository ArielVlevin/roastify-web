"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMarkerStore } from "@/lib/store/markerStore";
import * as Icons from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

const availableIcons = [
  "Zap",
  "Coffee",
  "Star",
  "Bookmark",
  "Flag",
  "Flame",
] as const;

type MarkerIcon = (typeof availableIcons)[number];

export default function ManageMarkersDialog() {
  const { markers, addMarker, removeMarker, resetMarkers } = useMarkerStore();
  const [open, setOpen] = useState(false);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="ml-auto capitalize cursor-pointer data-[state=open]:bg-primary data-[state=open]:text-white dark:data-[state=open]:border-muted-foreground data-[state=open]:border-2 dark:bg-white/30 
                      dark:hover:bg-white/50 text-gray-600 hover:text-gray-700 dark:text-white bg-white/30 hover:bg-white/50 "
        >
          <MapPin className="h-5 w-5 mr-2" /> Manage Markers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-primary bg-primary-dark/10 backdrop-blur-sm text-white  ">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Manage Markers
          </DialogTitle>
        </DialogHeader>

        {/* List of current markers */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {markers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No markers added yet.
            </p>
          ) : (
            markers.map((marker) => {
              const Icon = Icons[marker.icon || "Bookmark"];
              return (
                <div
                  key={marker.label}
                  className="flex items-center justify-between p-3 border rounded-md bg-muted/50 dark:border-muted-foreground border-primary-light"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} style={{ color: marker.color }} />
                    <span>{marker.label}</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => removeMarker(marker.label)}
                  >
                    Delete
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Add new marker */}
        <div className="border-t pt-4 space-y-4">
          <h3 className="font-medium">Add New Marker</h3>

          <div className="grid grid-cols-1 gap-4">
            <Input
              placeholder="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />

            <div className="flex gap-3">
              <div className="flex-1">
                <Select
                  value={icon}
                  onValueChange={(value) => setIcon(value as MarkerIcon)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent className="bg-primary-dark/10 backdrop-blur-sm text-white ">
                    {availableIcons.map((ic) => {
                      const IconComponent = Icons[ic];
                      return (
                        <SelectItem
                          key={ic}
                          value={ic}
                          className="flex items-center gap-2 cursor-pointer "
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent size={16} style={{ color }} />
                            <span>{ic}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <div className="flex items-center h-10 rounded-md border px-3 hover:cursor-pointer hover:bg-primary/10">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-6  border-0 p-0 hover:cursor-pointer "
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleAdd}>Add Marker</Button>
            <Button
              variant="outline"
              className="ml-auto bg-white/30 hover:bg-white/50 text-white dark:text-white dark:hover:text-white/50"
              onClick={() => {
                const confirmReset = window.confirm(
                  "Are you sure you want to reset all markers to defaults?"
                );
                if (confirmReset) {
                  resetMarkers();
                }
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
