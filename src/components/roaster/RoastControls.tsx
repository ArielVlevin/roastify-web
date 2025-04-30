"use client";

import type React from "react";
import { Play, Pause, RotateCcw, Home } from "lucide-react";
import type { RoastProfile } from "@/lib/types";
import { formatTime } from "@/lib/converte";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface RoastControlsProps {
  isRoasting: boolean;
  profiles: RoastProfile[];
  selectedProfile: RoastProfile;
  time: number;
  onStartRoast: () => void;
  onPauseRoast: () => void;
  onResetRoast: () => void;
  onSelectProfile: (profileName: string) => void;
  onGoHome: () => void;
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
  onGoHome,
}) => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-foreground">
          Roast Controls
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Selection */}
        <div>
          <label
            htmlFor="profile-select"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Select Roast Profile
          </label>
          <Select
            value={selectedProfile.name}
            onValueChange={onSelectProfile}
            disabled={isRoasting}
          >
            <SelectTrigger id="profile-select" className="w-full bg-background">
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
        <div className="bg-muted/20 p-3 rounded-md text-sm text-muted-foreground border border-border">
          <p>{selectedProfile.description}</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={onStartRoast}
            disabled={isRoasting}
            variant="default"
            className="flex flex-col items-center justify-center h-auto py-3 bg-primary hover:bg-primary-dark"
          >
            <Play size={20} className="mb-1" />
            <span className="text-xs sm:text-sm">Start</span>
          </Button>

          <Button
            onClick={onPauseRoast}
            disabled={!isRoasting}
            variant="secondary"
            className="flex flex-col items-center justify-center h-auto py-3 bg-accent hover:bg-accent-dark text-accent-foreground"
          >
            <Pause size={20} className="mb-1" />
            <span className="text-xs sm:text-sm">Pause</span>
          </Button>

          <Button
            onClick={onResetRoast}
            variant="destructive"
            className="flex flex-col items-center justify-center h-auto py-3"
          >
            <RotateCcw size={20} className="mb-1" />
            <span className="text-xs sm:text-sm">Reset</span>
          </Button>
        </div>

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
      </CardContent>

      <CardFooter>
        <Button
          onClick={onGoHome}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <Home size={16} className="mr-2" />
          <span>Back to Home</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoastControls;
