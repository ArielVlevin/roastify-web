import React, { createContext, useContext, useState, useEffect } from "react";
import { getActiveRoast } from "@/lib/localStorageService";
import * as api from "@/lib/api";

type RoastContextType = {
  hasActiveRoast: boolean;
  lastUpdated: number | null;
  profileName: string | null;
  checkForActiveRoast: () => Promise<void>;
};

const RoastContext = createContext<RoastContextType>({
  hasActiveRoast: false,
  lastUpdated: null,
  profileName: null,
  checkForActiveRoast: async () => {},
});

export const useRoastContext = () => useContext(RoastContext);

export const RoastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasActiveRoast, setHasActiveRoast] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);

  const checkForActiveRoast = async () => {
    try {
      // בדוק באחסון המקומי
      const localRoast = getActiveRoast();

      // בדוק בשרת
      const serverState = await api.checkActiveRoast();

      if (
        (localRoast && !localRoast.completed) ||
        (serverState && serverState.is_roasting)
      ) {
        setHasActiveRoast(true);
        setLastUpdated(localRoast?.lastUpdated || Date.now());
        setProfileName(localRoast?.selectedProfileName || "Unknown");
      } else {
        setHasActiveRoast(false);
        setLastUpdated(null);
        setProfileName(null);
      }
    } catch (error) {
      console.error("Error checking for active roast:", error);
    }
  };

  // check in first load
  useEffect(() => {
    checkForActiveRoast();

    // check every 10 seconds
    const interval = setInterval(checkForActiveRoast, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <RoastContext.Provider
      value={{
        hasActiveRoast,
        lastUpdated,
        profileName,
        checkForActiveRoast,
      }}
    >
      {children}
    </RoastContext.Provider>
  );
};
