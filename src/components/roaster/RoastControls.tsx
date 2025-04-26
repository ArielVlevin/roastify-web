// components/roaster/RoastControls.tsx
import React from "react";
import { Play, Pause, RotateCcw, Home } from "lucide-react";
import { RoastProfile } from "@/lib/types";
import { Button } from "../ui/button";

interface RoastControlsProps {
  isRoasting: boolean;
  profiles: RoastProfile[];
  selectedProfile: RoastProfile;
  onStartRoast: () => void;
  onPauseRoast: () => void;
  onResetRoast: () => void;
  onSelectProfile: (profileName: string) => void;
  disableControls?: boolean;
  onGoHome: () => void;
  time: number;
}

const RoastControls: React.FC<RoastControlsProps> = ({
  isRoasting,
  profiles,
  selectedProfile,
  onStartRoast,
  onPauseRoast,
  onResetRoast,
  onSelectProfile,
  onGoHome,
  disableControls = false,
  time,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-stone-800">Roast Controls</h2>
        <button
          onClick={onGoHome}
          className="p-2 text-stone-600 hover:text-stone-800 rounded-full hover:bg-stone-100"
          title="Return to Home"
        >
          <Home size={20} />
        </button>
      </div>

      {/* Profile Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-stone-600 mb-2">
          Select Profile:
        </label>
        <select
          className="w-full p-2 border border-stone-300 rounded-md bg-stone-50"
          value={selectedProfile.name}
          onChange={(e) => onSelectProfile(e.target.value)}
          disabled={isRoasting || disableControls}
        >
          {profiles.map((profile) => (
            <option key={profile.name} value={profile.name}>
              {profile.name} ({profile.targetTemp}°F, {profile.duration} min)
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-stone-500">
          {selectedProfile.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!isRoasting ? (
          <Button
            onClick={onStartRoast}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disableControls}
          >
            <Play size={16} /> {time === 0 ? "Start Roast" : "Resume"}
          </Button>
        ) : (
          <Button
            onClick={onPauseRoast}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disableControls}
          >
            <Pause size={16} /> Pause
          </Button>
        )}
        <Button
          onClick={onResetRoast}
          className="flex items-center gap-1 bg-stone-600 hover:bg-stone-700 text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={time === 0 || disableControls}
        >
          <RotateCcw size={16} /> Reset
        </Button>
      </div>
    </div>
  );
};

export default RoastControls;
