import MarkerButtons from "@/components/roaster/roastPanel/markerButtons";
import MarkerList from "@/components/roaster/roastPanel/markersList";
import RoastChart from "@/components/roaster/roastPanel/roastChart";
import RoastStats from "@/components/roaster/roastPanel/roastStats";
import StatusIndicator from "@/components/roaster/roastPanel/statusIndicator";
import TargetProfileInfo from "@/components/roaster/roastPanel/targetProfileInfo";
import { Panel } from "@/components/ui/app-ui/panel";
import Title from "@/components/ui/app-ui/title";
import {
  CrackStatus,
  NotificationType,
  RoastMarker,
  RoastProfile,
  TemperatureData,
} from "@/lib/types";
import RoastNotifications from "@/components/roaster/roastPanel/roastNotifications";

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
    <Panel className="lg:col-span-2 col-span-1">
      <div>
        <Title>Target Profile</Title>
        <TargetProfileInfo
          selectedProfile={selectedProfile}
          formatTemperature={formatTemperature}
          formatTime={formatTime}
        />
      </div>
      <div>
        <div className="flex justify-between items-center">
          <Title>Roast Progress</Title>
          <StatusIndicator isRoasting={isRoasting} completed={completed} />
        </div>
        <RoastStats
          time={time}
          temperature={temperature}
          roastStage={roastStage}
          crackStatus={crackStatus}
          temperatureUnit={temperatureUnit}
          formatTemperature={formatTemperature}
          formatTime={formatTime}
        />
        <RoastNotifications notification={notification} />
      </div>
      <div>
        <Title>Roasting Graph</Title>
        <RoastChart
          data={temperatureData}
          targetTemperature={selectedProfile.targetTemp}
          time={time}
          temperatureUnit={temperatureUnit}
          getDisplayTemperature={getDisplayTemperature}
          markers={markers}
        />
      </div>

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
    </Panel>
  );
};

export default RoastPanel;
