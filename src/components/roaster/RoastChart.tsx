// components/roaster/RoastChart.tsx
import React from "react";
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
}

const RoastChart: React.FC<RoastChartProps> = ({
  data,
  targetTemperature,
  time,
}) => {
  // Custom tooltip formatter to add °F to temperature values
  const formatTooltip = (value: number) => [`${value}°F`, "Temperature"];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time (minutes)",
              position: "insideBottomRight",
              offset: -5,
            }}
          />
          <YAxis
            domain={[0, 500]}
            label={{
              value: "Temperature (°F)",
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
            name="Temperature"
          />

          {/* Target temperature reference line */}
          {time > 0 && targetTemperature && (
            <Line
              type="monotone"
              dataKey={() => targetTemperature}
              stroke="#888888"
              strokeDasharray="3 3"
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
