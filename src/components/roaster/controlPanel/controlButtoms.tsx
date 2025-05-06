import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface ControlButtonsProps {
  onStartRoast: () => void;
  onPauseRoast: () => void;
  onResetRoast: () => void;
  isRoasting: boolean;
}

const ControlButtoms = ({
  onStartRoast,
  onPauseRoast,
  onResetRoast,
  isRoasting,
}: ControlButtonsProps) => {
  const controls = [
    {
      key: "start",
      label: "Start",
      icon: <Play size={20} className="mb-1" />,
      onClick: onStartRoast,
      disabled: isRoasting,
      variant: "default",
      className: "bg-primary hover:bg-primary-dark",
    },
    {
      key: "pause",
      label: "Pause",
      icon: <Pause size={20} className="mb-1" />,
      onClick: onPauseRoast,
      disabled: !isRoasting,
      variant: "secondary",
      className: "bg-accent hover:bg-accent-dark text-accent-foreground",
    },
    {
      key: "reset",
      label: "Reset",
      icon: <RotateCcw size={20} className="mb-1" />,
      onClick: onResetRoast,
      disabled: false,
      variant: "destructive",
      className: "",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {controls.map((btn) => (
        <Button
          key={btn.key}
          onClick={btn.onClick}
          disabled={btn.disabled}
          variant={
            btn.variant as "outline" | "default" | "secondary" | "destructive"
          }
          className={`flex flex-col items-center justify-center h-auto py-3 ${btn.className}`}
        >
          {btn.icon}
          <span className="text-xs sm:text-sm">{btn.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ControlButtoms;
