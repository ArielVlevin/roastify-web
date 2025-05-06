import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

const Panel = ({ children, className = "" }: PanelProps) => {
  return (
    <div
      className={`bg-muted/70 p-4 rounded-lg shadow-sm border flex flex-col gap-8 ${className}`}
    >
      {children}
    </div>
  );
};

interface SubPanelProps {
  children: React.ReactNode;
  className?: string;
}

function SubPanel({ children, className = "" }: SubPanelProps) {
  return (
    <div
      className={cn(
        "bg-background dark:bg-background/40 p-3 rounded-lg border border-border hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Panel, SubPanel };
