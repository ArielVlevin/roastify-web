"use client";

import { useRoastStore } from "@/lib/store/roastStore";
import { BUILT_IN_PROFILES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function ProfileDeleteList() {
  const profiles = useRoastStore((state) => state.profiles);
  const setProfiles = useRoastStore((state) => state.setProfiles);
  const selectedProfile = useRoastStore((state) => state.selectedProfile);
  const setSelectedProfile = useRoastStore((state) => state.setSelectedProfile);

  const builtInIds = new Set(BUILT_IN_PROFILES.map((p) => p.id));

  const customProfiles = profiles.filter((p) => !builtInIds.has(p.id));

  const handleDelete = (name: string) => {
    const updated = profiles.filter((p) => p.name !== name);
    setProfiles(updated);
    if (selectedProfile.id === name) setSelectedProfile(BUILT_IN_PROFILES[0]);
  };

  if (customProfiles.length === 0) return null;

  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-sm font-medium">Your Custom Profiles</h3>
      {customProfiles.map((profile) => (
        <div
          key={profile.id}
          className="flex justify-between items-center bg-muted/30 px-4 py-2 rounded-md"
        >
          <span>{profile.name}</span>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(profile.name)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
