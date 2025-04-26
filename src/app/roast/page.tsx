"use client";

import React, { useEffect, useState } from "react";
import { Coffee, Save } from "lucide-react";
import useRoaster from "@/hooks/useRoaster";
import RoastControls from "@/components/roaster/RoastControls";
import RoastChart from "@/components/roaster/RoastChart";
import SaveRoastForm from "@/components/roaster/SaveRoastForm";
import RoastStats from "@/components/roaster/RoastStats";
import { useRouter } from "next/navigation";
import RestoreSessionPrompt from "@/components/roaster/RestoreSessionPrompt";

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
    startRoast,
    pauseRoast,
    resetRoast,
    selectProfile,
    saveRoastData,
    profiles,
    firstCrackTime,
    secondCrackTime,
    showRestorePrompt,
    restoreSession,
    declineRestore,
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
      ) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
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
    <div className="flex flex-col min-h-screen bg-stone-100 p-4">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-stone-800 flex items-center gap-2">
          <Coffee size={32} /> Artisan Coffee Roaster
        </h1>

        <button
          onClick={handleSaveClick}
          disabled={temperatureData.length === 0}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} /> Save Roast
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="bg-white p-4 rounded-lg shadow-md md:col-span-2">
          {/* Target Info */}
          <h2 className="text-xl font-semibold text-stone-800">
            Target Profile
          </h2>
          <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200 mb-4  ">
            <div className="flex justify-between text-sm">
              <div>
                <span className="text-stone-500">Temperature:</span>
                <span className="ml-2 font-medium text-stone-800">
                  {selectedProfile.targetTemp}°F
                </span>
              </div>
              <div>
                <span className="text-stone-500">Duration:</span>
                <span className="ml-2 font-medium text-stone-800">
                  {selectedProfile.duration} min
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
          />

          {/* Temperature Chart */}
          <div className="mb-4 mt-6">
            <RoastChart
              data={temperatureData}
              targetTemperature={selectedProfile.targetTemp}
              time={time}
            />
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-stone-500 text-sm">
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
