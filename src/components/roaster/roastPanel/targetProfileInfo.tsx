import { usePreferencesStore } from "@/lib/store/preferencesStore";
import { RoastProfile } from "@/lib/types";

interface TargetProfileInfoProps {
  selectedProfile: RoastProfile;
  formatTime: (time: number) => string;
}

const TargetProfileInfo = ({
  selectedProfile,
  formatTime,
}: TargetProfileInfoProps) => {
  const formatTemperature = usePreferencesStore(
    (state) => state.formatTemperature
  );
  return (
    <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border mb-4">
      <div className="flex flex-col sm:flex-row justify-between text-sm">
        <div className="mb-2 sm:mb-0">
          <span className="text-muted-foreground">Target Temperature:</span>
          <span className="ml-2 font-medium text-foreground">
            {formatTemperature(selectedProfile.targetTemp)}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Target Time:</span>
          <span className="ml-2 font-medium text-foreground">
            {formatTime(selectedProfile.duration * 60)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TargetProfileInfo;
