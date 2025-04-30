"use client";

import { useEffect, useState } from "react";
import { Coffee, Save, X } from "lucide-react";
import useRoaster from "@/hooks/useRoaster";
import RoastControls from "@/components/roaster/RoastControls";
import RoastChart from "@/components/roaster/RoastChart";
import SaveRoastForm from "@/components/roaster/SaveRoastForm";
import RoastStats from "@/components/roaster/RoastStats";
import { useRouter } from "next/navigation";
import RestoreSessionPrompt from "@/components/roaster/RestoreSessionPrompt";
import TemperatureUnitToggle from "@/components/ui/TemperatureUnitToggle";
import { Button } from "@/components/ui/button";
import MarkerButtons from "@/components/roaster/MarkerButtons";

export default function RoastPage() {
  const router = useRouter();

  const [showSaveForm, setShowSaveForm] = useState<boolean>(false);

  const {
    isRoasting,
    time,
    selectedProfile,
    temperature,
    temperatureData,
    roastStage,
    crackStatus,
    notification,
    completed,
    markers,
    addMarker,
    removeMarker,
    startRoast,
    pauseRoast,
    resetRoast,
    selectProfile,
    saveRoastData,
    profiles,
    showRestorePrompt,
    restoreSession,
    declineRestore,
    temperatureUnit,
    toggleTemperatureUnit,
    getDisplayTemperature,
    formatTemperature,
    formatTime,
  } = useRoaster();

  const handleSaveClick = () => {
    if (temperatureData.length === 0) {
      return;
    }
    setShowSaveForm(true);
  };

  const handleGoHome = () => {
    // If roasting is in progress, confirm before leaving
    if (isRoasting) {
      if (
        window.confirm(
          "Roasting is in progress. Are you sure you want to leave?"
        )
      )
        router.push("/");
    } else router.push("/");
  };

  // Add a warning when user tries to leave the page during roasting
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRoasting) {
        // Show a confirmation dialog
        e.preventDefault();
        e.returnValue = ""; // Required for some browsers
        return ""; // Required for some browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isRoasting]);

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 sm:p-6">
      <header className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Coffee size={28} className="text-primary" /> Coffee Roaster
        </h1>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            onClick={handleSaveClick}
            disabled={temperatureData.length === 0}
            className="flex items-center gap-1 bg-primary hover:bg-primary-dark text-primary-foreground py-2 px-3 sm:px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <Save size={16} /> Save Roast
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Panel: Controls */}
        <RoastControls
          isRoasting={isRoasting}
          profiles={profiles}
          selectedProfile={selectedProfile}
          onStartRoast={startRoast}
          onPauseRoast={pauseRoast}
          onResetRoast={resetRoast}
          onSelectProfile={selectProfile}
          onGoHome={handleGoHome}
          time={time}
        />

        {/* Right Panel: Real-time Data */}
        <div className="bg-card p-4 rounded-lg shadow-sm lg:col-span-2 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Target Profile
            </h2>
            <TemperatureUnitToggle
              temperatureUnit={temperatureUnit}
              toggleTemperatureUnit={toggleTemperatureUnit}
              className="ml-2"
            />
          </div>

          {/* Target Info */}
          <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border mb-4">
            <div className="flex flex-col sm:flex-row justify-between text-sm">
              <div className="mb-2 sm:mb-0">
                <span className="text-muted-foreground">
                  Target Temperature:
                </span>
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

          {/* Temperature Chart */}
          <div className="mb-4 mt-6">
            <RoastChart
              data={temperatureData}
              targetTemperature={selectedProfile.targetTemp}
              time={time}
              temperatureUnit={temperatureUnit}
              getDisplayTemperature={getDisplayTemperature}
              markers={markers}
            />
          </div>

          <MarkerButtons
            className="flex justify-center mb-4"
            onAddMarker={addMarker}
            disabled={!isRoasting && temperatureData.length === 0}
          />
          {markers.length > 0 && (
            <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-border">
              <h3 className="text-sm font-medium mb-2">Markings added</h3>
              <div className="text-xs space-y-1">
                {markers.map((marker) => (
                  <div
                    key={marker.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: marker.color || "#333" }}
                      />
                      <span>{marker.label}</span>
                      <span className="text-muted-foreground">
                        {Math.floor(marker.time / 60)}:
                        {(marker.time % 60).toString().padStart(2, "0")},{" "}
                        {getDisplayTemperature(marker.temperature)}°
                        {temperatureUnit}
                      </span>
                    </div>
                    <button
                      onClick={() => removeMarker(marker.id)}
                      className="text-muted-foreground hover:text-destructive size-8"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-6 sm:mt-8 text-center text-muted-foreground text-xs sm:text-sm">
        <p>
          Connected to Raspberry Pi with Phidget sensors: hub0000_0, tmp1101_0
        </p>
      </footer>

      {/* Restore Session Prompt */}
      {showRestorePrompt && (
        <RestoreSessionPrompt
          onRestore={restoreSession}
          onDecline={declineRestore}
        />
      )}

      {/* Save Roast Form Modal */}
      {showSaveForm && (
        <SaveRoastForm
          profileName={selectedProfile.name}
          onSave={saveRoastData}
          onCancel={() => setShowSaveForm(false)}
        />
      )}
    </div>
  );
}
