import { SubPanel } from "@/components/ui/app-ui/panel";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/converte";

interface TimeDisplayProps {
  time: number;
  isRoasting: boolean;
}
const TimeDisplay: React.FC<TimeDisplayProps> = ({ time, isRoasting }) => {
  const formattedTime = formatTime(time);
  return (
    <SubPanel className="text-center p-4">
      <div className="text-sm text-muted-foreground mb-1">Elapsed Time</div>
      <div className="text-2xl sm:text-3xl font-mono text-foreground">
        {formattedTime}
      </div>
      {isRoasting && (
        <Badge
          variant="outline"
          className="mt-2 bg-primary/10 text-primary animate-pulse"
        >
          Roasting in progress
        </Badge>
      )}
    </SubPanel>
  );
};

export default TimeDisplay;
