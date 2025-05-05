import { Check } from "lucide-react";

interface StatusIndicatorProps {
  isRoasting: boolean;
  completed: boolean;
}
const StatusIndicator = ({ isRoasting, completed }: StatusIndicatorProps) => {
  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-1">
        <div
          className={`w-3 h-3 rounded-full ${
            isRoasting ? "bg-primary animate-pulse" : "bg-muted"
          }`}
        ></div>
        <span className="text-sm text-muted-foreground">
          {isRoasting ? "Roasting" : "Idle"}
        </span>
      </div>

      {completed && (
        <div className="flex items-center gap-1 text-primary">
          <Check size={16} />
          <span className="text-sm">Complete</span>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
