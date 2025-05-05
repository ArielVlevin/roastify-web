import { ReactNode } from "react";

interface CardPanelProps {
  children: ReactNode;
  className?: string;
}

const CardPanel = ({ children, className = "" }: CardPanelProps) => {
  return (
    <div
      className={`bg-muted/70 p-4 rounded-lg shadow-sm border flex flex-col gap-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default CardPanel;
