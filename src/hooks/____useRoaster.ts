// hooks/useRoaster.ts
import { useState, useEffect, useCallback, useRef } from "react";
import {
  RoastProfile,
  TemperatureData,
  NotificationType,
  CrackStatus,
  PROFILES,
  FIRST_CRACK,
  SECOND_CRACK,
} from "@/lib/types";
import * as api from "@/lib/api";
import {
  saveActiveRoast,
  getActiveRoast,
  clearActiveRoast,
  updateActiveRoast,
  getTemperatureUnit,
  setTemperatureUnit,
} from "@/lib/localStorageService";

// Maximum roast duration in seconds (15 minutes = 900 seconds)
const MAX_DURATION = 15 * 60;

export default function useRoaster() {
  // State
  const [isRoasting, setIsRoasting] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [heatLevel, setHeatLevel] = useState<number>(5);
  const [selectedProfile, setSelectedProfile] = useState<RoastProfile>(
    PROFILES[1]
  ); // Default to Full City
  const [temperature, setTemperature] = useState<number>(70); // Starting room temperature
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([]);
  const [roastStage, setRoastStage] = useState<string>("Green");
  const [crackStatus, setCrackStatus] = useState<CrackStatus>({
    first: false,
    second: false,
  });
  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );
  const [completed, setCompleted] = useState<boolean>(false);
  const [firstCrackTime, setFirstCrackTime] = useState<number | null>(null);
  const [secondCrackTime, setSecondCrackTime] = useState<number | null>(null);
  const [hasRestoredSession, setHasRestoredSession] = useState<boolean>(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState<boolean>(false);
  const [temperatureUnit, setTempUnit] = useState<"F" | "C">(
    getTemperatureUnit() || "F"
  );

  // Refs
  const fetchingRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Temperature conversion functions
  const fahrenheitToCelsius = useCallback((tempF: number): number => {
    return Math.round((((tempF - 32) * 5) / 9) * 10) / 10;
  }, []);

  const celsiusToFahrenheit = useCallback((tempC: number): number => {
    return Math.round(((tempC * 9) / 5 + 32) * 10) / 10;
  }, []);

  // Toggle temperature unit
  const toggleTemperatureUnit = useCallback(() => {
    const newUnit = temperatureUnit === "F" ? "C" : "F";
    setTempUnit(newUnit);
    setTemperatureUnit(newUnit);
  }, [temperatureUnit]);

  // Get the displayed temperature
  const getDisplayTemperature = useCallback(
    (tempF: number): number => {
      return temperatureUnit === "F" ? tempF : fahrenheitToCelsius(tempF);
    },
    [temperatureUnit, fahrenheitToCelsius]
  );

  // Format temperature with unit
  const formatTemperature = useCallback(
    (tempF: number): string => {
      const displayTemp = getDisplayTemperature(tempF);
      return `${displayTemp} °${temperatureUnit}`;
    },
    [getDisplayTemperature, temperatureUnit]
  );

  const syncStateWithServer = useCallback(async () => {
    try {
      // קבל את המצב מהשרת
      const serverState = await api.syncState({
        is_roasting: isRoasting,
        data: temperatureData,
        start_time: startTimeRef.current,
        crack_status: crackStatus,
      });

      console.log("State synchronized with server:", serverState);

      // אם יש הבדל משמעותי בין מצב הלקוח למצב השרת, עדכן את מצב הלקוח
      if (serverState && !isRoasting && serverState.is_roasting) {
        // השרת חושב שאנחנו עדיין בקלייה פעילה אבל הלקוח לא
        console.log("Server thinks roasting is active but client doesn't");
      }

      return serverState;
    } catch (error) {
      console.error("Failed to sync state with server:", error);
      return null;
    }
  }, [isRoasting, temperatureData, crackStatus]);

  // Load session from localStorage on initial mount
  useEffect(() => {
    if (hasRestoredSession) return;

    const activeRoast = getActiveRoast();
    if (activeRoast) {
      setShowRestorePrompt(true);
    }

    setHasRestoredSession(true);
  }, [hasRestoredSession]);

  // Check for active roast on the server
  const checkForActiveRoast = useCallback(async () => {
    try {
      const activeRoast = getActiveRoast();
      const serverState = await api.checkActiveRoast();

      console.log("Checking for active roast:", {
        localActive: !!activeRoast,
        serverActive: serverState.is_roasting,
      });

      // אם יש קלייה פעילה בשרת, אבל לא בדפדפן המקומי
      if (serverState.is_roasting && !activeRoast && !showRestorePrompt) {
        console.log("Active roast found on server but not in local storage");

        // יצירת רשומה מקומית חדשה על סמך המידע מהשרת
        const newActiveRoast = {
          startTime: serverState.start_time * 1000, // המרה משניות למילישניות
          lastUpdated: Date.now(),
          temperatureData: serverState.data_points || [],
          selectedProfileName: selectedProfile.name,
          crackStatus: serverState.crack_status || {
            first: false,
            second: false,
          },
          firstCrackTime: null, // אין לנו מידע מדויק, צריך לחשב מהנתונים
          secondCrackTime: null,
          completed: false,
        };

        // שמירת הרשומה החדשה באחסון המקומי
        saveActiveRoast(newActiveRoast);

        // הצגת הודעת שחזור
        setShowRestorePrompt(true);
      }
    } catch (error) {
      console.error("Error checking for active roast:", error);
    }
  }, [selectedProfile, showRestorePrompt]);

  // Check for active roast on the server after initial load
  useEffect(() => {
    if (hasRestoredSession) {
      checkForActiveRoast();
    }
  }, [hasRestoredSession, checkForActiveRoast]);

  // Restore previous session

  const restoreSession = useCallback(async () => {
    const activeRoast = getActiveRoast();
    if (!activeRoast) return false;

    try {
      // First sync with server to resolve any conflicts
      const serverState = await syncStateWithServer();

      // חשוב - נקבל את כל נקודות הנתונים מהשרת
      let updatedTemperatureData = [...activeRoast.temperatureData];

      // בדוק אם יש נתונים בשרת
      if (
        serverState &&
        serverState.data_points &&
        serverState.data_points.length > 0
      ) {
        // מצא את הנקודה האחרונה שיש לנו באחסון המקומי
        const lastLocalPointTime =
          updatedTemperatureData.length > 0
            ? updatedTemperatureData[updatedTemperatureData.length - 1].time
            : -1;

        console.log(`Last local data point time: ${lastLocalPointTime}`);
        console.log(`Server has ${serverState.data_points.length} data points`);

        // הוסף רק נקודות חדשות מהשרת (שלא קיימות באחסון המקומי)
        const newServerPoints = serverState.data_points.filter(
          (serverPoint: { time: number }) =>
            serverPoint.time > lastLocalPointTime
        );

        if (newServerPoints.length > 0) {
          console.log(
            `Adding ${newServerPoints.length} new data points from server`
          );

          // מזג את הנתונים בסדר נכון של זמן
          updatedTemperatureData = [
            ...updatedTemperatureData,
            ...newServerPoints,
          ];

          // מיין לפי זמן למקרה שיש נקודות שלא בסדר כרונולוגי
          updatedTemperatureData.sort((a, b) => a.time - b.time);

          // עדכן את האחסון המקומי עם הנתונים המעודכנים
          saveActiveRoast({
            ...activeRoast,
            temperatureData: updatedTemperatureData,
            lastUpdated: Date.now(),
          });
        }
      }

      // Restore data from merged data
      setTemperatureData(updatedTemperatureData);

      // Find and set the selected profile
      const profile =
        PROFILES.find((p) => p.name === activeRoast.selectedProfileName) ||
        PROFILES[1];
      setSelectedProfile(profile);

      // קבל גם מצב crack מעודכן מהשרת אם יש
      let updatedCrackStatus = activeRoast.crackStatus;
      if (serverState && serverState.crack_status) {
        updatedCrackStatus = {
          first:
            activeRoast.crackStatus.first || serverState.crack_status.first,
          second:
            activeRoast.crackStatus.second || serverState.crack_status.second,
        };
      }

      // Restore other state
      setCrackStatus(updatedCrackStatus);
      setFirstCrackTime(activeRoast.firstCrackTime);
      setSecondCrackTime(activeRoast.secondCrackTime);

      // בדוק אם הקלייה הושלמה בשרת
      let isCompleted = activeRoast.completed;
      if (
        serverState &&
        serverState.elapsed_time >= selectedProfile.duration * 60 &&
        serverState.temperature >= selectedProfile.targetTemp
      ) {
        isCompleted = true;
      }
      setCompleted(isCompleted);

      // Calculate elapsed time from the server if available, otherwise from local storage
      const elapsedTime =
        serverState && serverState.elapsed_time
          ? serverState.elapsed_time
          : Math.floor((Date.now() - activeRoast.startTime) / 1000);

      setTime(Math.min(elapsedTime, MAX_DURATION));

      // Set current temperature - prefer server data if available
      if (serverState && serverState.temperature) {
        setTemperature(serverState.temperature);
      } else if (updatedTemperatureData.length > 0) {
        const lastPoint =
          updatedTemperatureData[updatedTemperatureData.length - 1];
        setTemperature(lastPoint.temperature);
      }

      // שמור את זמן ההתחלה המקורי
      startTimeRef.current = activeRoast.startTime;

      // כאן השינוי המרכזי - אוטומטית מתחילים את הקלייה מחדש
      if (!isCompleted && serverState && serverState.is_roasting) {
        // אם השרת כבר בקלייה פעילה, עדכן רק את המצב המקומי
        setIsRoasting(true);
        setNotification({
          type: "info",
          message: "Previous roast session restored and automatically resumed.",
        });
      } else if (!isCompleted) {
        try {
          // התחל את תהליך הקלייה בשרת
          await api.startRoast();
          // עדכן את המצב המקומי
          setIsRoasting(true);
          setNotification({
            type: "info",
            message:
              "Previous roast session restored and automatically resumed.",
          });
        } catch (error) {
          console.error("Failed to auto-start restored roast:", error);
          setNotification({
            type: "warning",
            message:
              "Roast restored but could not be started automatically. Please start manually.",
          });
          setIsRoasting(false);
        }
      } else {
        // אם הקלייה הושלמה, אל תפעיל אותה מחדש
        setIsRoasting(false);
        setNotification({
          type: "info",
          message: "Completed roast session restored.",
        });
      }

      setShowRestorePrompt(false);
      return true;
    } catch (error) {
      console.error("Failed to restore session:", error);
      clearActiveRoast();
      return false;
    }
  }, [syncStateWithServer, selectedProfile]);

  // Decline restoring previous session
  const declineRestore = useCallback(() => {
    clearActiveRoast();
    resetRoast();
    setShowRestorePrompt(false);
  }, []);

  const pauseRoast = useCallback(async () => {
    try {
      await api.pauseRoast();
      setIsRoasting(false);
    } catch (error) {
      console.error("Failed to pause roast process:", error);
      setNotification({
        type: "warning",
        message: "Failed to pause roast process!",
      });
    }
  }, []);

  // Periodically save session data to localStorage when roasting
  useEffect(() => {
    if (!isRoasting) return;

    const saveInterval = setInterval(() => {
      saveActiveRoast({
        startTime: startTimeRef.current,
        lastUpdated: Date.now(),
        temperatureData,
        selectedProfileName: selectedProfile.name,
        crackStatus,
        firstCrackTime,
        secondCrackTime,
        completed,
      });
    }, 5000); // Save every 5 seconds

    return () => clearInterval(saveInterval);
  }, [
    isRoasting,
    temperatureData,
    selectedProfile,
    crackStatus,
    firstCrackTime,
    secondCrackTime,
    completed,
  ]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isRoasting || temperatureData.length > 0) {
        saveActiveRoast({
          startTime: startTimeRef.current,
          lastUpdated: Date.now(),
          temperatureData,
          selectedProfileName: selectedProfile.name,
          crackStatus,
          firstCrackTime,
          secondCrackTime,
          completed,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [
    isRoasting,
    temperatureData,
    selectedProfile,
    crackStatus,
    firstCrackTime,
    secondCrackTime,
    completed,
  ]);

  // Fetch temperature data from backend
  useEffect(() => {
    if (!isRoasting) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const fetchTemperatureData = async () => {
      if (fetchingRef.current) return; // Prevent multiple simultaneous requests

      fetchingRef.current = true;

      try {
        // Get temperature and status from backend
        const tempData = await api.getTemperature();
        setTemperature(tempData.temperature);

        // Use the server's elapsed_time if available, otherwise calculate from startTime
        const elapsedTime =
          tempData.elapsed_time !== undefined
            ? tempData.elapsed_time
            : Math.floor((Date.now() - startTimeRef.current) / 1000);

        setTime(elapsedTime);

        // Add data point to chart
        setTemperatureData((prevData) => [
          ...prevData,
          {
            time: elapsedTime,
            temperature: tempData.temperature,
          },
        ]);

        // Update crack status if available from server
        if (tempData.crack_status) {
          setCrackStatus(tempData.crack_status);

          // Update crack times if needed
          if (tempData.crack_status.first && firstCrackTime === null) {
            setFirstCrackTime(elapsedTime);
            setNotification({ type: "info", message: "First crack detected!" });
          }

          if (tempData.crack_status.second && secondCrackTime === null) {
            setSecondCrackTime(elapsedTime);
            setNotification({
              type: "info",
              message: "Second crack detected!",
            });
          }
        }

        // Check if maximum time reached
        if (elapsedTime >= MAX_DURATION) {
          await pauseRoast();
          setNotification({
            type: "warning",
            message: "Maximum roast time reached!",
          });
        }
      } catch (error) {
        console.error("Failed to fetch temperature data:", error);
        setNotification({
          type: "warning",
          message: "Failed to fetch temperature data!",
        });
      } finally {
        fetchingRef.current = false;
      }
    };

    // Initial fetch
    fetchTemperatureData();

    // Setup interval for regular updates - changed to 1 second
    intervalRef.current = setInterval(fetchTemperatureData, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRoasting, firstCrackTime, secondCrackTime, pauseRoast]);

  // Monitor roast stages - note all temperatures here are in Fahrenheit regardless of display setting
  useEffect(() => {
    // Update roast stage based on temperature
    if (temperature < 200) {
      setRoastStage("Green");
    } else if (temperature < 300) {
      setRoastStage("Yellow");
    } else if (temperature < 350) {
      setRoastStage("Light Brown");
    } else if (temperature < 400) {
      setRoastStage("Medium Brown");
    } else if (temperature < 435) {
      setRoastStage("Dark Brown");
    } else {
      setRoastStage("Nearly Black");
    }

    // Local first crack detection - only if not already detected by server
    if (
      !crackStatus.first &&
      temperature >= FIRST_CRACK.min &&
      temperature <= FIRST_CRACK.max
    ) {
      setCrackStatus((prev) => ({ ...prev, first: true }));
      setFirstCrackTime(time);
      setNotification({ type: "info", message: "First crack detected!" });
    }

    // Local second crack detection - only if not already detected by server
    if (
      !crackStatus.second &&
      temperature >= SECOND_CRACK.min &&
      temperature <= SECOND_CRACK.max
    ) {
      setCrackStatus((prev) => ({ ...prev, second: true }));
      setSecondCrackTime(time);
      setNotification({ type: "info", message: "Second crack detected!" });
    }

    // Check if target profile is reached
    // Convert profile.duration from minutes to seconds for comparison
    if (
      isRoasting &&
      temperature >= selectedProfile.targetTemp &&
      time >= selectedProfile.duration * 60 // Convert profile duration from minutes to seconds
    ) {
      pauseRoast();
      setCompleted(true);
      setNotification({
        type: "success",
        message: `${selectedProfile.name} roast completed successfully!`,
      });

      // Also save this state
      updateActiveRoast({ completed: true });
    }
  }, [temperature, isRoasting, time, crackStatus, selectedProfile, pauseRoast]);

  // Calculate and send optimal heat level based on temperature and profile
  useEffect(() => {
    if (!isRoasting) return;

    // Determine heat level based on temperature and profile
    const calculateOptimalHeatLevel = () => {
      const targetTemp = selectedProfile.targetTemp;
      const tempDifference = targetTemp - temperature;

      // Linear scale: higher heat when far from target, lower when close
      if (tempDifference > 150) return 10;
      if (tempDifference > 100) return 8;
      if (tempDifference > 50) return 6;
      if (tempDifference > 20) return 5;
      if (tempDifference > 0) return 4;

      // Maintain temperature when at target
      return 3;
    };

    const optimalHeatLevel = calculateOptimalHeatLevel();

    // Only update if heat level needs to change
    if (optimalHeatLevel !== heatLevel) {
      setHeatLevel(optimalHeatLevel);

      // Send to API
      const updateHeatLevel = async () => {
        try {
          await api.setHeatLevel(optimalHeatLevel);
        } catch (error) {
          console.error("Failed to update heat level:", error);
        }
      };

      updateHeatLevel();
    }
  }, [isRoasting, temperature, selectedProfile, heatLevel]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification]);

  const resetRoast = useCallback(async () => {
    try {
      await api.resetRoast();

      // בדוק האם השרת באמת התאפס
      const serverState = await api.getRoastStatus();

      // אם השרת עדיין במצב קלייה או שהזמן לא התאפס, נסה איפוס כפוי
      if (serverState.is_roasting || serverState.elapsed_time > 0) {
        console.log("Server not properly reset, trying force reset");
        await api.forceResetRoast();
      }

      setIsRoasting(false);
      setTime(0);
      setTemperature(70);
      setTemperatureData([]);
      setRoastStage("Green");
      setCrackStatus({ first: false, second: false });
      setFirstCrackTime(null);
      setSecondCrackTime(null);
      setCompleted(false);
      setNotification(null);
      clearActiveRoast();

      // איפוס זמן ההתחלה
      startTimeRef.current = 0;
    } catch (error) {
      console.error("Failed to reset roast process:", error);
      setNotification({
        type: "warning",
        message: "Failed to reset roast process!",
      });
    }
  }, []);

  // Starting a fresh roast session
  const startRoast = useCallback(async () => {
    try {
      // בדוק את מצב השרת לפני ניסיון להתחיל קלייה
      const serverState = await api.getRoastStatus();

      // אם הזמן שחלף כבר מקסימלי, יש לאפס לפני שממשיכים
      if (serverState.elapsed_time >= MAX_DURATION) {
        console.log(
          "Maximum roast time detected before starting, resetting first"
        );
        await resetRoast();
      }

      // First try to sync with server
      await syncStateWithServer();

      // If continuing a previous session, use the existing startTime
      if (temperatureData.length > 0 && !completed) {
        // We are continuing a paused session
        try {
          await api.startRoast();
          setIsRoasting(true);
          return;
        } catch (resumeError) {
          // If we get an error (400) trying to resume, we'll try resetting and starting fresh
          console.log(
            "Error trying to resume, attempting reset and restart..."
          );
          await resetRoast();
          await api.startRoast();
          setIsRoasting(true);
          return;
        }
      }

      // Starting a fresh roast session
      await api.startRoast();
      setIsRoasting(true);
      setCompleted(false);
      setCrackStatus({ first: false, second: false });
      setFirstCrackTime(null);
      setSecondCrackTime(null);
      setTemperatureData([]);

      // Store the start time
      startTimeRef.current = Date.now();
      setTime(0);

      // Clear any previous roast data
      clearActiveRoast();
    } catch (error) {
      console.error("Failed to start roast process:", error);

      // Check if error is due to roast already in progress
      if (error instanceof Error && error.message.includes("400")) {
        // Try to force reset and start again
        try {
          await resetRoast();
          // Try starting again after reset
          await api.startRoast();
          setIsRoasting(true);
          setNotification({
            type: "info",
            message: "Restart successful after reset",
          });
        } catch (resetError) {
          setNotification({
            type: "warning",
            message: "Could not start roast. Try refreshing the page.",
          });
        }
      } else {
        setNotification({
          type: "warning",
          message: "Failed to start roast process!",
        });
      }
    }
  }, [syncStateWithServer, completed, temperatureData.length, resetRoast]);

  // Sync with server on initial mount
  useEffect(() => {
    const initialSync = async () => {
      try {
        await syncStateWithServer();
      } catch (error) {
        console.error("Initial sync failed:", error);
      }
    };

    // Only run once after first render
    if (hasRestoredSession) {
      initialSync();
    }
  }, [syncStateWithServer, hasRestoredSession]);

  const selectProfile = useCallback((profileName: string) => {
    const profile = PROFILES.find((p) => p.name === profileName);
    if (profile) {
      setSelectedProfile(profile);
    }
  }, []);

  const saveRoastData = useCallback(
    async (name: string, notes: string = "") => {
      try {
        await api.saveRoast({
          name,
          profile: selectedProfile.name,
          notes,
        });
        setNotification({
          type: "success",
          message: "Roast saved successfully!",
        });

        // Clear active roast after successful save
        clearActiveRoast();
        return true;
      } catch (error) {
        console.error("Failed to save roast:", error);
        setNotification({ type: "warning", message: "Failed to save roast!" });
        return false;
      }
    },
    [selectedProfile.name]
  );

  // Format time display - convert seconds to mm:ss format
  const formatTime = useCallback((timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  return {
    // State
    isRoasting,
    time,
    heatLevel,
    selectedProfile,
    temperature, // Always in Fahrenheit internally
    temperatureData, // Always in Fahrenheit internally
    roastStage,
    crackStatus,
    notification,
    completed,
    firstCrackTime,
    secondCrackTime,
    showRestorePrompt,
    temperatureUnit,

    // Temperature handling
    getDisplayTemperature,
    formatTemperature,
    toggleTemperatureUnit,

    // Actions
    startRoast,
    pauseRoast,
    resetRoast,
    selectProfile,
    saveRoastData,
    restoreSession,
    declineRestore,
    syncStateWithServer,
    formatTime,

    // Constants
    profiles: PROFILES,
    maxDuration: MAX_DURATION,
  };
}
