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
import type { RoastMarker, TemperaturePoint } from "@/lib/types";
import { usePreferencesStore } from "@/lib/store/preferencesStore";

interface RoastChartProps {
  data: TemperaturePoint[];
  targetTemperature?: number;
  time: number;
  markers?: RoastMarker[];
}

const RoastChart: React.FC<RoastChartProps> = ({
  data,
  targetTemperature,
  time,
  markers = [],
}) => {
  const formatTemperature = usePreferencesStore(
    (state) => state.formatTemperature
  );
  const temperatureUnit = usePreferencesStore((state) => state.temperatureUnit);

  const convertedData = useMemo(() => {
    return data.map((point) => ({
      ...point,
      temperature: point.temperature,
    }));
  }, [data]);

  const formatTooltip = (value: number, name: string) => {
    if (name === "Current Temp") {
      return [formatTemperature(value), name];
    }
    return [value, name];
  };

  // הגדרת תחום ציר ה-Y בהתאם ליחידת הטמפרטורה
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

          {/* קו לטמפרטורת המטרה */}
          {time > 0 && targetTemperature && (
            <Line
              type="monotone"
              dataKey={() => targetTemperature}
              stroke="var(--primary)"
              strokeDasharray="5 3"
              name="Target Temp"
              strokeWidth={1}
              dot={false}
            />
          )}

          {/* נקודות סימון */}
          {markers.map((marker) => {
            const matchingDataPoint = convertedData.find(
              (point) => point.time === marker.time
            ) || {
              time: marker.time,
              temperature: marker.temperature,
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
