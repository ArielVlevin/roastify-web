// hooks/useRoasterMonitoring.ts
import { useEffect, useCallback } from "react";
import * as api from "@/lib/api";
import {
  NotificationType,
  TemperatureData,
  CrackStatus,
  RoastProfile,
  FIRST_CRACK,
  SECOND_CRACK,
} from "@/lib/types";
import { updateActiveRoast } from "@/lib/localStorageService";

type MonitoringProps = {
  isRoasting: boolean;
  temperature: number;
  setTemperature: (temp: number) => void;
  time: number;
  setTime: (time: number) => void;
  roastStage: string;
  setRoastStage: (stage: string) => void;
  crackStatus: CrackStatus;
  setCrackStatus: (status: CrackStatus) => void;
  firstCrackTime: number | null;
  setFirstCrackTime: (time: number | null) => void;
  secondCrackTime: number | null;
  setSecondCrackTime: (time: number | null) => void;
  completed: boolean;
  setCompleted: (completed: boolean) => void;
  temperatureData: TemperatureData[];
  setTemperatureData: (
    data: TemperatureData[] | ((prev: TemperatureData[]) => TemperatureData[])
  ) => void;
  notification: NotificationType | null;
  setNotification: (notification: NotificationType | null) => void;
  fetchingRef: React.MutableRefObject<boolean>;
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
  startTimeRef: React.MutableRefObject<number>;
  selectedProfile: RoastProfile;
  pauseRoast: () => Promise<void>;
  MAX_DURATION: number;
};

export function useRoasterMonitoring({
  isRoasting,
  temperature,
  setTemperature,
  time,
  setTime,
  setRoastStage,
  crackStatus,
  setCrackStatus,
  firstCrackTime,
  setFirstCrackTime,
  secondCrackTime,
  setSecondCrackTime,
  completed,
  setCompleted,
  setTemperatureData,
  notification,
  setNotification,
  fetchingRef,
  intervalRef,
  startTimeRef,
  selectedProfile,
  pauseRoast,
  MAX_DURATION,
}: MonitoringProps) {
  // Setup temperature fetch interval
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
  }, [
    isRoasting,
    fetchingRef,
    intervalRef,
    MAX_DURATION,
    firstCrackTime,
    pauseRoast,
    setCrackStatus,
    setFirstCrackTime,
    setNotification,
    setSecondCrackTime,
    setTemperature,
    setTemperatureData,
    setTime,
    startTimeRef,
    secondCrackTime,
  ]);

  // Monitor roast stages and cracks
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
      setCrackStatus({ ...crackStatus, first: true }); // העבר אובייקט ישירות
      setFirstCrackTime(time);
      setNotification({ type: "info", message: "First crack detected!" });
    }

    // Local second crack detection - only if not already detected by server

    if (
      !crackStatus.second &&
      temperature >= SECOND_CRACK.min &&
      temperature <= SECOND_CRACK.max
    ) {
      setCrackStatus({ ...crackStatus, first: true }); // העבר אובייקט ישירות
      setSecondCrackTime(time);
      setNotification({ type: "info", message: "Second crack detected!" });
    }

    // Check if target profile is reached - but don't pause
    if (
      isRoasting &&
      temperature >= selectedProfile.targetTemp &&
      time >= selectedProfile.duration * 60 && // Convert profile duration from minutes to seconds
      !completed // Only show notification once
    ) {
      // Don't call pauseRoast() here
      setCompleted(true);
      setNotification({
        type: "success",
        message: `${selectedProfile.name} roast profile reached! Roasting continues.`,
      });

      // Save this state
      updateActiveRoast({ completed: true });
    }
  }, [
    temperature,
    isRoasting,
    time,
    crackStatus,
    selectedProfile,
    completed,
    setCrackStatus,
    setFirstCrackTime,
    setSecondCrackTime,
    setNotification,
    setRoastStage,
    setCompleted,
  ]);

  // Auto clear notifications after 3 seconds
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification, setNotification]);

  // Calculate optimal heat level
  const calculateOptimalHeatLevel = useCallback(
    (temperature: number, selectedProfile: RoastProfile) => {
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
    },
    []
  );

  return {
    calculateOptimalHeatLevel,
  };
}
