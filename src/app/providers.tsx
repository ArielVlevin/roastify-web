"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { RoastProvider } from "@/context/RoastContext";
import { ActiveRoastAlert } from "@/components/ActiveRoastAlert";
import Layout from "@/components/layout/Layout";

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
        <ActiveRoastAlert />

        <Layout>{children}</Layout>
      </RoastProvider>
    </ThemeProvider>
  );
}
