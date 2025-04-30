import type React from "react";

interface StatBoxProps {
  label: string;
  value: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value }) => (
  <div className="bg-muted/30 p-3 rounded-lg border border-border">
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="text-lg sm:text-xl font-bold text-foreground">{value}</div>
  </div>
);

// Helper component for crack status
interface CrackStatusBoxProps {
  first: boolean;
  second: boolean;
}

export const CrackStatusBox: React.FC<CrackStatusBoxProps> = ({
  first,
  second,
}) => (
  <div className="bg-muted/30 p-3 rounded-lg border border-border">
    <div className="text-sm text-muted-foreground">Crack Status</div>
    <div className="text-base font-bold">
      <span className={first ? "text-accent" : "text-muted-foreground/60"}>
        1st
      </span>
      <span
        className={second ? "text-destructive" : "text-muted-foreground/60"}
      >
        2nd
      </span>
    </div>
  </div>
);
