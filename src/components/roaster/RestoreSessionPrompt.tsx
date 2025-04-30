"use client";

import type React from "react";
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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg p-5 sm:p-6 max-w-md w-full border border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-accent/20 p-2 rounded-full">
            <Clock size={24} className="text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Resume Roast?
          </h2>
        </div>

        <p className="text-muted-foreground mb-4">
          We found a previous roast session that was interrupted. Would you like
          to continue where you left off?
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onDecline}
            className="flex items-center justify-center gap-1 border border-border bg-background hover:bg-muted text-foreground py-2 px-4 rounded-md flex-1"
          >
            <X size={16} /> Discard
          </button>
          <button
            onClick={onRestore}
            className="flex items-center justify-center gap-1 bg-primary hover:bg-primary-dark text-primary-foreground py-2 px-4 rounded-md flex-1"
          >
            <Check size={16} /> Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreSessionPrompt;
