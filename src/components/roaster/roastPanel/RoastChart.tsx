"use client";

import type React from "react";
import { useMemo } from "react";
import {
  Tooltip as ReactTooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
import type { MarkerIcon, RoastMarker, TemperaturePoint } from "@/lib/types";
import { usePreferencesStore } from "@/lib/store/preferencesStore";
import * as Icons from "lucide-react";

import { Customized } from "recharts";

interface RoastChartProps {
  data: TemperaturePoint[];
  targetTemperature?: number;
  time: number;
  markers?: RoastMarker[];

  referenceData?: TemperaturePoint[];
}

const RoastChart: React.FC<RoastChartProps> = ({
  data,
  targetTemperature,
  time,
  markers = [],

  referenceData,
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
    if (name === "Current Temp") return [formatTemperature(value), name];

    return [value, name];
  };

  const yAxisDomain = temperatureUnit === "F" ? [0, 500] : [0, 300];

  const MarkerIconsLayer: React.FC<any> = ({ xAxisMap, yAxisMap }) => {
    const xScale = Object.values(xAxisMap)[0]?.scale;
    const yScale = Object.values(yAxisMap)[0]?.scale;

    if (!xScale || !yScale) return null;

    return (
      <>
        {markers.map((marker) => {
          const Icon: MarkerIcon = marker.icon || "Bookmark";
          const IconComp = Icons[Icon];

          const x = xScale(marker.time);
          const y = yScale(marker.temperature);

          if (x === undefined || y === undefined) return null;

          return (
            <ReactTooltip key={marker.id}>
              <TooltipTrigger asChild>
                <g
                  key={marker.id}
                  transform={`translate(${x - 10}, ${y - 12})`}
                >
                  <IconComp
                    r={8}
                    fill={marker.color || "#333"}
                    className="stroke dark:stroke-white/70 stroke-gray-200 cursor-pointer"
                    strokeWidth={1}
                  />
                </g>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-white">
                {marker.label}
              </TooltipContent>
            </ReactTooltip>
          );
        })}
      </>
    );
  };

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

          {referenceData && referenceData.length > 0 && (
            <Line
              data={referenceData}
              dataKey="temperature"
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              name="Previous Roast"
              strokeWidth={1.5}
              dot={false}
            />
          )}

          <Line
            type="monotone"
            dataKey="temperature"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 8 }}
            name="Current Temp"
          />
          {/* target temperature line */}
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

          <Customized component={MarkerIconsLayer} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoastChart;
