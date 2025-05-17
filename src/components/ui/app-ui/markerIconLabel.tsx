import { MarkerIcon } from "@/lib/types";
import * as Icons from "lucide-react";

interface MarkerIconLabelProps {
  icon?: MarkerIcon;
  label: string;
  x: number;
  y: number;
  color?: string;
}

export const MarkerIconLabel = ({
  icon = "Bookmark",
  x,
  y,
  color = "#333",
}: MarkerIconLabelProps) => {
  const Icon = Icons[icon] || Icons.Bookmark;

  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-default">
      <foreignObject width={20} height={20}>
        <Icon size={18} color={color} />
      </foreignObject>
    </g>
  );
};
