import React from "react";
import { Clock, Check, X } from "lucide-react";

interface RestoreSessionPromptProps {
  onRestore: () => void;
  onDecline: () => void;
}

const RestoreSessionPrompt: React.FC<RestoreSessionPromptProps> = ({
  onRestore,
  onDecline,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-amber-100 p-2 rounded-full">
            <Clock size={24} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-stone-800">
            Resume Roast?
          </h2>
        </div>

        <p className="text-stone-600 mb-4">
          We found a previous roast session that was interrupted. Would you like
          to continue where you left off?
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onDecline}
            className="flex items-center justify-center gap-1 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 py-2 px-4 rounded-md flex-1"
          >
            <X size={16} /> Discard
          </button>
          <button
            onClick={onRestore}
            className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex-1"
          >
            <Check size={16} /> Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreSessionPrompt;
