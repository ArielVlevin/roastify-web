"use client";

import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useTheme } from "next-themes";
import { Pause, Play, Save, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useColorTheme } from "./theme-provider";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TemperatureChartProps {
  data: { time: string; temperature: number }[];
  title?: string;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onSave: () => void;
}

export default function TemperatureChart({
  data,
  title = "Live Temperature Monitor",
  isPaused,
  onPause,
  onResume,
  onSave,
}: TemperatureChartProps) {
  const { theme } = useTheme();
  const { colorTheme } = useColorTheme();
  const chartRef = useRef<ChartJS>(null);

  const getCssVar = (name: string) => {
    if (typeof window === "undefined") return "";
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [theme, colorTheme]);

  const getChartOptions = () => {
    const isDark = theme === "dark";
    const textColor = getCssVar("--foreground");
    const gridColor = getCssVar("--border");

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500 },
      scales: {
        x: {
          grid: { color: gridColor, borderColor: gridColor, display: false },
          ticks: {
            color: textColor,
            maxRotation: 45,
            minRotation: 45,
            font: { size: 10 },
          },
        },
        y: {
          grid: { color: gridColor, borderColor: gridColor },
          ticks: { color: textColor, font: { size: 12 } },
          suggestedMin: 175,
          suggestedMax: 205,
        },
      },
      plugins: {
        legend: {
          labels: { color: textColor, font: { size: 14 } },
        },
        tooltip: {
          backgroundColor: isDark
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          titleColor: isDark ? "white" : "black",
          bodyColor: isDark ? "white" : "black",
          borderColor: gridColor,
          borderWidth: 1,
          padding: 10,
          displayColors: true,
          callbacks: {
            label: (context: any) => `Temperature: ${context.parsed.y}°C`,
          },
        },
      },
    };
  };

  const getChartData = () => {
    let lineColor = getCssVar("--primary");
    if (
      !lineColor ||
      (!lineColor.includes("oklch") && !lineColor.includes("hsl"))
    ) {
      lineColor = theme === "dark" ? "#3b82f6" : "#2563eb";
    }

    return {
      labels: data.map((d) => d.time),
      datasets: [
        {
          label: "Temperature (°C)",
          data: data.map((d) => d.temperature),
          borderColor: lineColor,
          backgroundColor: `${lineColor}33`,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: lineColor,
          pointBorderColor: "rgba(255, 255, 255, 0.8)",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: lineColor,
          pointHoverBorderColor: "white",
          pointHoverBorderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-center text-2xl font-bold">
          <Thermometer className="mr-2 h-6 w-6 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <Line
            ref={chartRef}
            data={getChartData()}
            options={getChartOptions()}
          />
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <Button
            variant={isPaused ? "outline" : "default"}
            onClick={onPause}
            disabled={isPaused}
            className="flex items-center"
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>

          <Button
            variant={!isPaused ? "outline" : "default"}
            onClick={onResume}
            disabled={!isPaused}
            className="flex items-center"
          >
            <Play className="mr-2 h-4 w-4" />
            Resume
          </Button>

          <Button
            variant="secondary"
            onClick={onSave}
            className="flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
