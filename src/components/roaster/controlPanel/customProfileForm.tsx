"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/app-ui/panel";
import { RoastProfile } from "@/lib/types";
import Title from "@/components/ui/app-ui/title";

interface CustomProfileFormProps {
  createNewProfile: (profile: RoastProfile) => void;
  isDisabled?: boolean;
}

const CustomProfileForm: React.FC<CustomProfileFormProps> = ({
  createNewProfile,
  isDisabled,
}) => {
  const [name, setName] = useState("Custom Profile");
  const [targetTemp, setTargetTemp] = useState(220);
  const [duration, setDuration] = useState(10);

  const handleSubmit = () => {
    const profile: RoastProfile = {
      name,
      type: "custom",
      targetTemp,
      duration,
      description: "User-defined custom profile",
    };
    try {
      createNewProfile(profile);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Panel className="p-4 space-y-4">
      <div>
        <Title>Profile Name</Title>
        <Input
          className="bg-primary-dark/10 dark:bg-primary-dark/10 animate-fade-in"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isDisabled}
        />
      </div>
      <div>
        <Title>Target Temperature (C)</Title>
        <Input
          className="bg-primary-dark/10 dark:bg-primary-dark/10 animate-fade-in"
          type="number"
          value={targetTemp}
          onChange={(e) => setTargetTemp(Number(e.target.value))}
          disabled={isDisabled}
        />
      </div>
      <div>
        <Title>Estimated Duration (min)</Title>
        <Input
          className="bg-primary-dark/10 dark:bg-primary-dark/10 animate-fade-in"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          disabled={isDisabled}
        />
      </div>
      <Button onClick={handleSubmit} disabled={isDisabled}>
        Create Profile
      </Button>
    </Panel>
  );
};

export default CustomProfileForm;
