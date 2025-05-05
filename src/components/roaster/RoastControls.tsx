"use client";

import type React from "react";
import type { RoastProfile } from "@/lib/types";
import { formatTime } from "@/lib/converte";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "../ui/label";
import ControlButtoms from "./roastController/controlButtoms";
import CardPanel from "../ui/cardPanel";
import SectionTitle from "../ui/sectionTitle";

interface RoastControlsProps {
  isRoasting: boolean;
  profiles: RoastProfile[];
  selectedProfile: RoastProfile;
  time: number;
  onStartRoast: () => void;
  onPauseRoast: () => void;
  onResetRoast: () => void;
  onSelectProfile: (profileName: string) => void;
}

const RoastControls: React.FC<RoastControlsProps> = ({
  isRoasting,
  profiles,
  selectedProfile,
  time,
  onStartRoast,
  onPauseRoast,
  onResetRoast,
  onSelectProfile,
}) => {
  return (
    <CardPanel>
      <div className="flex flex-col gap-2">
        <SectionTitle>Roast Controls</SectionTitle>
        {/* Profile Selection */}
        <div>
          <Label
            htmlFor="profile-select"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Select Roast Profile
          </Label>
          <Select
            value={selectedProfile.name}
            onValueChange={onSelectProfile}
            disabled={isRoasting}
          >
            <SelectTrigger id="profile-select" className="w-full">
              <SelectValue placeholder="Select a profile" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((profile) => (
                <SelectItem key={profile.name} value={profile.name}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="bg-muted/20 p-3 rounded-md text-sm text-muted-foreground border border-border mt-4">
          <p>{selectedProfile.description}</p>
        </div>
      </div>

      <ControlButtoms
        onStartRoast={onStartRoast}
        onPauseRoast={onPauseRoast}
        onResetRoast={onResetRoast}
        isRoasting={isRoasting}
      />
      {/* Time Display */}
      <div className="text-center p-4 bg-muted/10 rounded-lg border border-border">
        <div className="text-sm text-muted-foreground mb-1">Elapsed Time</div>
        <div className="text-2xl sm:text-3xl font-mono text-foreground">
          {formatTime(time)}
        </div>
        {isRoasting && (
          <Badge
            variant="outline"
            className="mt-2 bg-primary/10 text-primary animate-pulse"
          >
            Roasting in progress
          </Badge>
        )}
      </div>
    </CardPanel>
  );
};

export default RoastControls;
