"use client";

import type React from "react";
import type { RoastProfile } from "@/lib/types";
import ControlButtoms from "@/components/roaster/controlPanel/controlButtoms";
import { Panel } from "@/components/ui/app-ui/panel";
import Title from "@/components/ui/app-ui/title";
import TimeDisplay from "@/components/roaster/controlPanel/timeDisplay";
import RoastProfileSelect from "@/components/roaster/controlPanel/profileSelect";
import ProfileDescription from "@/components/roaster/controlPanel/profileDescription";

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
    <Panel className="flex flex-col space-between">
      <div className="mb-8">
        <div className="mb-4">
          <Title>Roast Profile</Title>
          <RoastProfileSelect
            profiles={profiles}
            selectedProfile={selectedProfile}
            onSelectProfile={onSelectProfile}
            isRoasting={isRoasting}
          />
        </div>
        <div>
          <Title>Profle description</Title>
          <ProfileDescription selectedProfile={selectedProfile} />
        </div>
      </div>
      <ControlButtoms
        onStartRoast={onStartRoast}
        onPauseRoast={onPauseRoast}
        onResetRoast={onResetRoast}
        isRoasting={isRoasting}
      />
      <TimeDisplay time={time} isRoasting={isRoasting} />
    </Panel>
  );
};

export default RoastControls;
