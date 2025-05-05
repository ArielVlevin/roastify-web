import { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

const SectionTitle = ({ children, className = "" }: SectionTitleProps) => {
  return (
    <h2 className={`mb-4 text-xl font-semibold text-foreground ${className}`}>
      {children}
    </h2>
  );
};

export default SectionTitle;
