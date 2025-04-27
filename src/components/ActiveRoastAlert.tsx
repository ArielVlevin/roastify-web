import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, ArrowRight } from "lucide-react";
import { useRoastContext } from "@/context/RoastContext";
import { getTimeAgo } from "@/lib/converte";

export const ActiveRoastAlert: React.FC = () => {
  const { hasActiveRoast, profileName, lastUpdated } = useRoastContext();
  const router = useRouter();

  // check if we are on the roast page
  const pathname = usePathname();
  const isRoastPage = pathname?.includes("/roast");

  // if there is no active roast or we are on the roast page, don't show the alert
  if (!hasActiveRoast || isRoastPage) return null;

  // if there is an active roast, show the alert
  const timeAgo = lastUpdated ? getTimeAgo(lastUpdated) : "";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-amber-600 text-white p-4 rounded-lg shadow-lg flex items-center max-w-sm">
        <div className="mr-3">
          <Coffee className="h-8 w-8 animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold">Roast In Progress</h3>
          <p className="text-sm">
            {profileName} profile {timeAgo && `(${timeAgo})`}
          </p>
        </div>
        <button
          onClick={() => router.push("/roast")}
          className="ml-3 bg-white text-amber-600 px-3 py-1 rounded-md flex items-center font-medium hover:bg-amber-50 transition-colors duration-300 ease-in-ou cursor-pointer"
        >
          Go to Roast <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
