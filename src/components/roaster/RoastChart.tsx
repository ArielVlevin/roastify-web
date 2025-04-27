// components/roaster/RoastChart.tsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TemperatureData } from "@/lib/types";

interface RoastChartProps {
  data: TemperatureData[];
  targetTemperature?: number;
  time: number;
  temperatureUnit: "F" | "C";
  getDisplayTemperature: (tempF: number) => number;
}

const RoastChart: React.FC<RoastChartProps> = ({
  data,
  targetTemperature,
  time,
  temperatureUnit,
  getDisplayTemperature,
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
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={convertedData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time",
              position: "insideBottomRight",
              offset: -5,
            }}
          />
          <YAxis
            domain={yAxisDomain}
            label={{
              value: `Temperature (°${temperatureUnit})`,
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#e25c4b"
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
              stroke="#3C3FE3FF"
              strokeDasharray="5 3"
              name="Target Temp"
              strokeWidth={1}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoastChart;
