"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { RoastProvider } from "@/context/RoastContext";
import { ActiveRoastAlert } from "@/components/ActiveRoastAlert";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <RoastProvider>
        {children}
        <ActiveRoastAlert />
      </RoastProvider>
    </ThemeProvider>
  );
}
