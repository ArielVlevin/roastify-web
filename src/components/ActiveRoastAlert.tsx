import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, ArrowRight } from "lucide-react";
import { useRoastStore } from "@/lib/store/roastStore";
import { getTimeAgo } from "@/lib/converte";

export const ActiveRoastAlert: React.FC = () => {
  // שימוש בסלקטורים של Zustand במקום useRoastContext
  const isRoasting = useRoastStore((state) => state.isRoasting);
  const selectedProfile = useRoastStore((state) => state.selectedProfile);
  const startTime = useRoastStore((state) => state.startTime);

  const router = useRouter();

  // בדיקה אם אנחנו בדף הקלייה
  const pathname = usePathname();
  const isRoastPage = pathname?.includes("/roast");

  // אם אין קלייה פעילה או שאנחנו בדף הקלייה, לא להציג את ההתראה
  if (!isRoasting || isRoastPage) return null;

  // אם יש קלייה פעילה, הצג את ההתראה
  const timeAgo = startTime ? getTimeAgo(startTime) : "";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-amber-600 text-white p-4 rounded-lg shadow-lg flex items-center max-w-sm">
        <div className="mr-3">
          <Coffee className="h-8 w-8 animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold">Roast In Progress</h3>
          <p className="text-sm">
            {selectedProfile.name} profile {timeAgo && `(${timeAgo})`}
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
