"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Coffee, PlusCircle, FolderOpen, ClipboardList } from "lucide-react";
import ActionCard from "../ui/ActionCard";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-stone-800 flex items-center justify-center gap-3 mb-4">
          <Coffee size={40} className="text-amber-700" />
          <span>Artisan Coffee Roaster</span>
        </h1>
        <p className="text-stone-600 text-lg">
          Professional Coffee Roasting Simulator
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <ActionCard
          title="New Roast"
          description="Start a fresh roasting session"
          icon={<PlusCircle size={40} className="text-green-600" />}
          iconBgColor="bg-green-100"
          onClick={() => router.push("/roast")}
        />

        <ActionCard
          title="Load Roast"
          description="View and load previous roasts"
          icon={<FolderOpen size={40} className="text-blue-600" />}
          iconBgColor="bg-blue-100"
          onClick={() => router.push("/logs")}
        />

        <ActionCard
          title="Roast Logs"
          description="Review your roast history"
          icon={<ClipboardList size={40} className="text-amber-600" />}
          iconBgColor="bg-amber-100"
          onClick={() => router.push("/logs")}
        />
      </div>

      <footer className="mt-12 text-center text-stone-500">
        <p>Select an option to get started with your coffee roasting journey</p>
      </footer>
    </div>
  );
}
