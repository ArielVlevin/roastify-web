import React from "react";
import { Button } from "@/components/ui/button";
import { Coffee, Flag, Zap, Star, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkerButtonsProps {
  onAddMarker: (label: string, color?: string) => void;
  disabled: boolean;
  className?: string;
}

const MarkerButtons: React.FC<MarkerButtonsProps> = ({
  onAddMarker,
  disabled,
  className,
}) => {
  return (
    <div className={cn(className, "flex flex-wrap gap-2 mt-4")}>
      <Button
        onClick={() => onAddMarker("First Crack", "#FF5733")}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 h-8"
      >
        <Zap size={14} className="text-orange-500" /> First Crack
      </Button>

      <Button
        onClick={() => onAddMarker("Second Crack", "#C70039")}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 h-8"
      >
        <Zap size={14} className="text-red-600" /> Second Crack
      </Button>

      <Button
        onClick={() => onAddMarker("Turning Point", "#9B59B6")}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 h-8"
      >
        <Star size={14} className="text-purple-500" /> Turning Point
      </Button>

      <Button
        onClick={() => onAddMarker("Development Start", "#3498DB")}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 h-8"
      >
        <Flag size={14} className="text-blue-500" /> Development Start
      </Button>

      <Button
        onClick={() => onAddMarker("End of Roast", "#44BD32")}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 h-8"
      >
        <Coffee size={14} className="text-green-500" /> End of Roast
      </Button>

      <Button
        onClick={() => onAddMarker("Custom Marker")}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 h-8"
      >
        <Bookmark size={14} className="text-gray-500" /> Custom Marker
      </Button>
    </div>
  );
};

export default MarkerButtons;
