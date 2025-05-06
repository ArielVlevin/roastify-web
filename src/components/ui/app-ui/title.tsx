import { ReactNode } from "react";
import { Label } from "../label";

interface TitleProps {
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}

const Title = ({ children, className = "", htmlFor }: TitleProps) => {
  return (
    <Label
      htmlFor={htmlFor}
      className={`mb-4 text-xl font-semibold text-foreground ${className}`}
    >
      {children}
    </Label>
  );
};

export default Title;
