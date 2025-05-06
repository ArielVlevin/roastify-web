import type React from "react";
import { SubPanel } from "@/components/ui/app-ui/panel";

interface GenericStatBoxProps {
  label: string;
  children: React.ReactNode;
}

const StatPanel = ({ label, children }: GenericStatBoxProps) => (
  <SubPanel>
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="text-lg sm:text-xl font-bold text-foreground">
      {children}
    </div>
  </SubPanel>
);

export default StatPanel;
