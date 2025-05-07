"use client";

import { useEffect, useState } from "react";
import useRoaster from "@/lib/hooks/useRoaster";
import SaveRoastForm from "@/components/roaster/handleSaveRoastForm";
import { useRouter } from "next/navigation";

import RoastPanel from "@/components/roaster/roastPanel";
import RoastLayout from "@/app/roast/RoastLayout";
import RoastControls from "@/components/roaster/roastControlPanel";
import RestoreSessionPrompt from "@/components/roaster/restoreSessionPrompt";

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
    formatTime,
  } = useRoaster();

  const handleSaveClick = () => {
    if (temperatureData.length === 0) return;
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
    <RoastLayout
      temperatureData={temperatureData}
      handleSaveClick={handleSaveClick}
      onGoHome={handleGoHome}
    >
      {/* Left Panel: Controls */}
      <RoastControls
        isRoasting={isRoasting}
        profiles={profiles}
        selectedProfile={selectedProfile}
        onStartRoast={startRoast}
        onPauseRoast={pauseRoast}
        onResetRoast={resetRoast}
        onSelectProfile={selectProfile}
        time={time}
      />

      {/* Right Panel: Real-time Data */}

      <RoastPanel
        time={time}
        temperature={temperature}
        selectedProfile={selectedProfile}
        markers={markers}
        temperatureData={temperatureData}
        isRoasting={isRoasting}
        roastStage={roastStage}
        crackStatus={crackStatus}
        notification={notification}
        completed={completed}
        addMarker={addMarker}
        formatTime={formatTime}
        removeMarker={removeMarker}
      />

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
    </RoastLayout>
  );
}
