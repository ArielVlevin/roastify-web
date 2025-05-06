"use client";

import type React from "react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  onClick: () => void;
  className?: string;
  textColor?: string;
  descriptionColor?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  iconBgColor,
  onClick,
  className = "",
  textColor = "text-foreground",
  descriptionColor = "text-muted-foreground",
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border w-full h-full ${className}`}
  >
    <div className={`${iconBgColor} p-3 sm:p-4 rounded-full mb-3 sm:mb-4`}>
      {icon}
    </div>
    <h2
      className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 ${textColor}`}
    >
      {title}
    </h2>
    <p className={`text-center text-sm sm:text-base ${descriptionColor}`}>
      {description}
    </p>
  </button>
);

export default ActionCard;
