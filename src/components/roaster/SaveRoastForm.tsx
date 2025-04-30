"use client";

import type React from "react";
import { useState } from "react";

interface SaveRoastFormProps {
  profileName: string;
  onSave: (name: string, notes: string) => Promise<boolean>;
  onCancel: () => void;
}

const SaveRoastForm: React.FC<SaveRoastFormProps> = ({
  profileName,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState<string>(
    `${profileName} ${new Date().toLocaleDateString()}`
  );
  const [notes, setNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const success = await onSave(name, notes);
      if (success) {
        onCancel();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-card rounded-lg shadow-lg p-5 sm:p-6 max-w-md w-full border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Save Roast Data
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="roastName"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Roast Name
            </label>
            <input
              type="text"
              id="roastName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-background text-foreground"
              placeholder="Enter a name for this roast"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="roastNotes"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Notes (optional)
            </label>
            <textarea
              id="roastNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-input rounded-md h-24 bg-background text-foreground"
              placeholder="Add any notes about this roast"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 border border-border rounded-md hover:bg-muted text-foreground"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary-dark disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Roast"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveRoastForm;
