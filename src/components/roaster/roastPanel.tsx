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
  Marker,
  NotificationType,
  RoastMarker,
  RoastProfile,
  TemperaturePoint,
} from "@/lib/types";
import RoastNotifications from "@/components/roaster/roastPanel/roastNotifications";
import { Button } from "../ui/button";

interface RoastPanelProps {
  time: number;
  temperature: number;
  selectedProfile: RoastProfile;
  markers: RoastMarker[];
  temperatureData: TemperaturePoint[];
  referenceData?: TemperaturePoint[];
  isRoasting: boolean;
  roastStage: string;
  crackStatus: CrackStatus;
  notification: NotificationType | null;
  completed: boolean;
  addMarker: (marker: Marker) => void;
  formatTime: (time: number) => string;
  removeMarker: (markerId: string) => void;
  setCrackStatus: (status: CrackStatus) => void;
  setFirstCrackTime: (time: number) => void;
  setSecondCrackTime: (time: number) => void;
}

const RoastPanel = ({
  time,
  temperature,
  selectedProfile,
  markers,
  temperatureData,
  referenceData,
  isRoasting,
  roastStage,
  crackStatus,
  notification,
  completed,
  addMarker,
  formatTime,
  removeMarker,
  setCrackStatus,
  setFirstCrackTime,
  setSecondCrackTime,
}: RoastPanelProps) => {
  return (
    <Panel className="lg:col-span-2 col-span-1">
      <div>
        <Title>Target Profile</Title>
        <TargetProfileInfo
          selectedProfile={selectedProfile}
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
          markers={markers}
          referenceData={referenceData}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={crackStatus.first ? "default" : "outline"}
          onClick={() => {
            if (!crackStatus.first) {
              setCrackStatus({ ...crackStatus, first: true });
              setFirstCrackTime(time);
              addMarker({
                label: "First Crack",
                color: "#FF5733",
                icon: "Zap",
              });
            }
          }}
        >
          1st Crack
        </Button>

        <Button
          variant={crackStatus.second ? "default" : "outline"}
          onClick={() => {
            if (!crackStatus.second) {
              setCrackStatus({ ...crackStatus, second: true });
              setSecondCrackTime(time);
              addMarker({
                label: "Second Crack",
                color: "#C70039",
                icon: "Zap",
              });
            }
          }}
        >
          2nd Crack
        </Button>
      </div>
      <div>
        <MarkerButtons
          className="flex justify-center mb-4"
          onAddMarker={addMarker}
          disabled={!isRoasting && temperatureData.length === 0}
        />
        <MarkerList markers={markers} removeMarker={removeMarker} />
      </div>
    </Panel>
  );
};

export default RoastPanel;
