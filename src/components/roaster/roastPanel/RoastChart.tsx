"use client";

import type React from "react";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import type { RoastMarker, TemperatureData } from "@/lib/types";

interface RoastChartProps {
  data: TemperatureData[];
  targetTemperature?: number;
  time: number;
  temperatureUnit: "F" | "C";
  getDisplayTemperature: (tempF: number) => number;
  markers?: RoastMarker[];
}

const RoastChart: React.FC<RoastChartProps> = ({
  data,
  targetTemperature,
  time,
  temperatureUnit,
  getDisplayTemperature,
  markers = [],
}) => {
  // Convert the temperature data based on the selected unit
  const convertedData = useMemo(() => {
    return data.map((point) => ({
      ...point,
      temperature: getDisplayTemperature(point.temperature),
    }));
  }, [data, getDisplayTemperature]);

  // Convert target temperature if it exists
  const displayTargetTemperature = targetTemperature
    ? getDisplayTemperature(targetTemperature)
    : undefined;

  // Custom tooltip formatter to add proper unit to temperature values
  const formatTooltip = (value: number) => [
    `${value}°${temperatureUnit}`,
    "Temperature",
  ];

  // Determine Y-axis domain based on temperature unit
  const yAxisDomain = temperatureUnit === "F" ? [0, 500] : [0, 260];

  return (
    <div className="h-64 sm:h-72 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={convertedData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time",
              position: "insideBottomRight",
              offset: -5,
              fill: "var(--muted-foreground)",
            }}
            tick={{ fill: "var(--muted-foreground)" }}
          />
          <YAxis
            domain={yAxisDomain}
            label={{
              value: `Temperature (°${temperatureUnit})`,
              angle: -90,
              position: "insideLeft",
              fill: "var(--muted-foreground)",
            }}
            tick={{ fill: "var(--muted-foreground)" }}
          />
          <Tooltip
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 8 }}
            name="Current Temp"
          />

          {/* Target temperature reference line */}
          {time > 0 && displayTargetTemperature && (
            <Line
              type="monotone"
              dataKey={() => displayTargetTemperature}
              stroke="var(--primary)"
              strokeDasharray="5 3"
              name="Target Temp"
              strokeWidth={1}
              dot={false}
            />
          )}

          {markers.map((marker) => {
            const matchingDataPoint = convertedData.find(
              (point) => point.time === marker.time
            ) || {
              time: marker.time,
              temp: getDisplayTemperature(marker.temperature),
            };

            return (
              <ReferenceDot
                key={marker.id}
                x={matchingDataPoint.time}
                y={matchingDataPoint.temperature}
                r={6}
                fill={marker.color || "#333"}
                stroke="white"
                strokeWidth={2}
                label={{ value: marker.label, position: "top" }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoastChart;
