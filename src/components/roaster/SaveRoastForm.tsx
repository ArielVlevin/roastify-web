import React, { useState } from "react";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-stone-800">
          Save Roast Data
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="roastName"
              className="block text-sm font-medium text-stone-600 mb-1"
            >
              Roast Name
            </label>
            <input
              type="text"
              id="roastName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-stone-300 rounded-md"
              placeholder="Enter a name for this roast"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="roastNotes"
              className="block text-sm font-medium text-stone-600 mb-1"
            >
              Notes (optional)
            </label>
            <textarea
              id="roastNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-stone-300 rounded-md h-24"
              placeholder="Add any notes about this roast"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 border border-stone-300 rounded-md hover:bg-stone-100"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
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
