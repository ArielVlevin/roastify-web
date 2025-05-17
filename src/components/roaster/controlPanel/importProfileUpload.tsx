// components/roaster/controlPanel/importProfileUpload.tsx
"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { RoastProfile } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/app-ui/panel";

interface ImportProfileUploadProps {
  onUpload: (profile: RoastProfile) => void;
  isDisabled?: boolean;
}

const ImportProfileUpload: React.FC<ImportProfileUploadProps> = ({
  onUpload,
  isDisabled,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Validate the object structure
      if (
        typeof json.name === "string" &&
        typeof json.targetTemp === "number" &&
        typeof json.duration === "number"
      ) {
        const profile: RoastProfile = {
          name: json.name,
          targetTemp: json.targetTemp,
          duration: json.duration,
          description: json.description || "Imported profile",
          type: "imported",
        };

        onUpload(profile);
      } else {
        alert("Invalid profile format");
      }
    } catch (err) {
      alert("Failed to read profile file");
    }
  };

  return (
    <Panel className="p-4 space-y-2">
      <Label htmlFor="import-profile">Import Profile (JSON)</Label>
      <input
        ref={inputRef}
        id="import-profile"
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="text-sm"
        disabled={isDisabled}
      />
      <Button onClick={() => inputRef.current?.click()} disabled={isDisabled}>
        Choose File
      </Button>
    </Panel>
  );
};

export default ImportProfileUpload;
