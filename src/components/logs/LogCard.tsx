"use client";

import type React from "react";
import { Calendar, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card
      className="overflow-hidden hover:shadow-md transition-all cursor-pointer border-border h-full"
      onClick={() => onClick(log)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground line-clamp-1">
          {log.name}
        </CardTitle>
        <div className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(log.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{log.timestamp.toFixed(1)} min</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-32 bg-muted/10 px-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={log.data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis dataKey="time" tick={false} />
              <YAxis domain={[0, 500]} tick={false} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-3 pb-3">
        <Badge variant="outline" className="bg-muted/20 text-foreground">
          {log.profile.name}
        </Badge>
        <div className="flex items-center gap-1">
          {log.crack_status.first && (
            <Badge variant="outline" className="bg-accent/10 text-accent">
              1st Crack
            </Badge>
          )}
          {log.crack_status.second && (
            <Badge
              variant="outline"
              className="bg-destructive/10 text-destructive"
            >
              2nd Crack
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default LogCard;
