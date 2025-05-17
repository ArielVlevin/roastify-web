"use client";

import type React from "react";
import { useState } from "react";
import type { RoastProfile } from "@/lib/types";
import ControlButtoms from "@/components/roaster/controlPanel/controlButtoms";
import { Panel } from "@/components/ui/app-ui/panel";
import Title from "@/components/ui/app-ui/title";
import TimeDisplay from "@/components/roaster/controlPanel/timeDisplay";
import RoastProfileSelect from "@/components/roaster/controlPanel/profileSelect";
import ProfileDescription from "@/components/roaster/controlPanel/profileDescription";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomProfileForm from "./controlPanel/customProfileForm";
import ImportProfileUpload from "./controlPanel/importProfileUpload";
import { useRoastStore } from "@/lib/store/roastStore";

interface RoastControlsProps {
  isRoasting: boolean;
  profiles: RoastProfile[];
  selectedProfile: RoastProfile;
  time: number;
  onStartRoast: () => void;
  onPauseRoast: () => void;
  onResetRoast: () => void;
  onSelectProfile: (profileName: string) => void;
  createNewProfile: (profile: RoastProfile) => void;
  onImportProfile: (profile: RoastProfile) => void;
}

const RoastControls: React.FC<RoastControlsProps> = ({
  isRoasting,
  selectedProfile,
  time,
  onStartRoast,
  onPauseRoast,
  onResetRoast,
  onSelectProfile,
  createNewProfile,
  onImportProfile,
}) => {
  const [profileType, setProfileType] = useState<
    "built-in" | "custom" | "imported"
  >("built-in");

  const onCreateNewProfile = async (profile: RoastProfile) => {
    try {
      createNewProfile(profile);
      setProfileType("built-in");

      const updatedProfiles = useRoastStore.getState().profiles;
      if (updatedProfiles.find((p) => p.name === profile.name))
        useRoastStore.getState().setSelectedProfile(profile);
    } catch (error) {
      console.error("Failed to create profile:", error);
      alert("Failed to create profile: " + (error as Error).message);
    }
  };

  return (
    <Panel className="flex flex-col space-between">
      <div className="mb-8">
        <Title>Profile Type</Title>
        <Tabs
          value={profileType}
          onValueChange={(v) => setProfileType(v as typeof profileType)}
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value="built-in">Built-in</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="imported">Imported</TabsTrigger>
          </TabsList>
        </Tabs>

        {profileType === "built-in" && (
          <Panel className="p-4 space-y-4">
            <div>
              <Title>Roast Profile</Title>
              <RoastProfileSelect
                onSelectProfile={onSelectProfile}
                isRoasting={isRoasting}
              />
            </div>
            <div>
              <Title>Profile Description</Title>
              <ProfileDescription selectedProfile={selectedProfile} />
            </div>
          </Panel>
        )}

        {profileType === "custom" && (
          <>
            <Title>Custom Profile</Title>
            <CustomProfileForm
              createNewProfile={onCreateNewProfile}
              isDisabled={isRoasting}
            />
          </>
        )}

        {profileType === "imported" && (
          <>
            <Title>Import Profile</Title>
            <ImportProfileUpload
              onUpload={onImportProfile}
              isDisabled={isRoasting}
            />
          </>
        )}
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
