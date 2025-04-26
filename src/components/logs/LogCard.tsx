// components/logs/LogCard.tsx
import React from "react";
import { Calendar, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { RoastLog } from "@/lib/types";

interface LogCardProps {
  log: RoastLog;
  onClick: (log: RoastLog) => void;
}

const LogCard: React.FC<LogCardProps> = ({ log, onClick }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(log)}
    >
      <h3 className="text-lg font-semibold text-stone-800 mb-2">{log.name}</h3>
      <div className="flex justify-between text-sm text-stone-600 mb-3">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{formatDate(log.date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{log.duration.toFixed(1)} min</span>
        </div>
      </div>
      <div className="h-32 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={log.tempData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis dataKey="time" tick={false} />
            <YAxis domain={[0, 500]} tick={false} />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#e25c4b"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center">
        <span className="bg-stone-100 text-stone-700 text-xs font-medium px-2.5 py-0.5 rounded">
          {log.profile}
        </span>
        <div className="flex items-center gap-1 text-xs">
          {log.firstCrack && (
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
              1st Crack
            </span>
          )}
          {log.secondCrack && (
            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">
              2nd Crack
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogCard;
