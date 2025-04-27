// components/roaster/RoastControls.tsx
import React from "react";
import { Play, Pause, RotateCcw, Home } from "lucide-react";
import { RoastProfile } from "@/lib/types";
import { formatTime } from "@/lib/converte";
import { Button } from "../ui/button";

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
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-stone-800 mb-4">
        Roast Controls
      </h2>

      {/* Profile Selection */}
      <div className="mb-6">
        <label
          htmlFor="profile-select"
          className="block text-sm font-medium text-stone-700 mb-2"
        >
          Select Roast Profile
        </label>
        <select
          id="profile-select"
          value={selectedProfile.name}
          onChange={(e) => onSelectProfile(e.target.value)}
          className="block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={isRoasting}
        >
          {profiles.map((profile) => (
            <option key={profile.name} value={profile.name}>
              {profile.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-6 bg-stone-50 p-3 rounded-md text-sm text-stone-600">
        <p>{selectedProfile.description}</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          onClick={onStartRoast}
          disabled={isRoasting}
          className="flex flex-col items-center justify-center p-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={24} />
          <span className="mt-1 text-sm">Start</span>
        </button>

        <button
          onClick={onPauseRoast}
          disabled={!isRoasting}
          className="flex flex-col items-center justify-center p-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Pause size={24} />
          <span className="mt-1 text-sm">Pause</span>
        </button>

        <button
          onClick={onResetRoast}
          className="flex flex-col items-center justify-center p-3 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          <RotateCcw size={24} />
          <span className="mt-1 text-sm">Reset</span>
        </button>
      </div>

      {/* Time Display */}
      <div className="text-center mb-6">
        <div className="text-sm text-stone-500 mb-1">Elapsed Time</div>
        <div className="text-3xl font-mono">{formatTime(time)}</div>
      </div>

      {/* Home Button */}
      <Button
        onClick={onGoHome}
        className="w-full flex items-center justify-center p-2 mt-4 bg-stone-200 text-stone-700 rounded-md hover:bg-stone-300"
      >
        <Home size={16} className="mr-2" />
        <span>Back to Home</span>
      </Button>
    </div>
  );
};

export default RoastControls;
