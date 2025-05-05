import MarkerButtons from "@/components/roaster/roastPanel/MarkerButtons";
import MarkerList from "@/components/roaster/roastPanel/markersList";
import RoastChart from "@/components/roaster/roastPanel/RoastChart";
import RoastStats from "@/components/roaster/roastPanel/RoastStats";
import StatusIndicator from "@/components/roaster/roastPanel/statusIndicator";
import TargetProfileInfo from "@/components/roaster/roastPanel/targetProfileInfo";
import CardPanel from "@/components/ui/cardPanel";
import SectionTitle from "@/components/ui/sectionTitle";
import {
  CrackStatus,
  NotificationType,
  RoastMarker,
  RoastProfile,
  TemperatureData,
} from "@/lib/types";

interface RoastPanelProps {
  time: number;
  temperature: number;
  selectedProfile: RoastProfile;
  temperatureUnit: "F" | "C";
  markers: RoastMarker[];
  temperatureData: TemperatureData[];
  isRoasting: boolean;
  roastStage: string;
  crackStatus: CrackStatus;
  notification: NotificationType | null;
  completed: boolean;
  addMarker: (label: string, color?: string, notes?: string) => void;
  getDisplayTemperature: (tempF: number) => number;
  toggleTemperatureUnit: () => void;
  formatTemperature: (temp: number) => string;
  formatTime: (time: number) => string;
  removeMarker: (markerId: string) => void;
}

const RoastPanel = ({
  time,
  temperature,
  selectedProfile,
  temperatureUnit,
  markers,
  temperatureData,
  isRoasting,
  roastStage,
  crackStatus,
  notification,
  completed,
  addMarker,
  getDisplayTemperature,
  formatTemperature,
  formatTime,
  removeMarker,
}: RoastPanelProps) => {
  return (
    <CardPanel className="lg:col-span-2 col-span-1">
      {/* Profile Header */}
      <div>
        <SectionTitle>Target Profile</SectionTitle>
        <TargetProfileInfo
          selectedProfile={selectedProfile}
          formatTemperature={formatTemperature}
          formatTime={formatTime}
        />
      </div>

      {/* Current Stats */}
      <div>
        <div className="flex justify-between items-center">
          <SectionTitle>Roast Progress</SectionTitle>
          <StatusIndicator isRoasting={isRoasting} completed={completed} />
        </div>
        <RoastStats
          time={time}
          temperature={temperature}
          roastStage={roastStage}
          crackStatus={crackStatus}
          isRoasting={isRoasting}
          completed={completed}
          notification={notification}
          temperatureUnit={temperatureUnit}
          formatTemperature={formatTemperature}
          formatTime={formatTime}
        />
      </div>
      {/* Temperature Chart */}
      <div>
        <SectionTitle>Roasting Graph</SectionTitle>
        <RoastChart
          data={temperatureData}
          targetTemperature={selectedProfile.targetTemp}
          time={time}
          temperatureUnit={temperatureUnit}
          getDisplayTemperature={getDisplayTemperature}
          markers={markers}
        />
      </div>

      {/* Markers */}
      <div>
        <MarkerButtons
          className="flex justify-center mb-4"
          onAddMarker={addMarker}
          disabled={!isRoasting && temperatureData.length === 0}
        />
        <MarkerList
          markers={markers}
          temperatureUnit={temperatureUnit}
          getDisplayTemperature={getDisplayTemperature}
          removeMarker={removeMarker}
        />
      </div>
    </CardPanel>
  );
};

export default RoastPanel;
