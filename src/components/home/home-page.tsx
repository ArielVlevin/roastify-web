"use client";
import { useRouter } from "next/navigation";
import {
  Coffee,
  PlusCircle,
  FolderOpen,
  ClipboardList,
  Settings,
} from "lucide-react";
import ActionCard from "../ui/ActionCard";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-background p-4 sm:p-6">
      <div className="fixed top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-sm"
          onClick={() => router.push("/settings")}
        >
          <Settings className="h-[1.2rem] w-[1.2rem] text-primary" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>

      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <Coffee size={32} className="text-primary" />
            <span>Coffee Roast</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Professional Coffee Roasting Simulator
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl">
          {/* Primary Card */}
          <ActionCard
            title="New Roast"
            description="Start a fresh roasting session"
            icon={<PlusCircle size={28} className="text-primary" />}
            iconBgColor="bg-primary/20"
            onClick={() => router.push("/roast")}
            className="border-primary/20 hover:border-primary/40 transition-all"
            textColor="text-primary-foreground"
            descriptionColor="text-muted-foreground"
          />

          {/* Secondary Card */}
          <ActionCard
            title="Load Roast"
            description="View and load previous roasts"
            icon={<FolderOpen size={28} className="text-secondary" />}
            iconBgColor="bg-secondary/20"
            onClick={() => router.push("/logs")}
            className="border-secondary/20 hover:border-secondary/40 transition-all"
            textColor="text-secondary-foreground"
            descriptionColor="text-muted-foreground"
          />

          {/* Accent Card */}
          <ActionCard
            title="Roast Logs"
            description="Review your roast history"
            icon={<ClipboardList size={28} className="text-accent" />}
            iconBgColor="bg-accent/20"
            onClick={() => router.push("/logs")}
            className="border-accent/20 hover:border-accent/40 transition-all sm:col-span-2 md:col-span-1 sm:mx-auto md:mx-0 sm:w-1/2 md:w-full"
            textColor="text-accent-foreground"
            descriptionColor="text-muted-foreground"
          />
        </div>
      </div>

      <footer className="w-full max-w-4xl mx-auto mt-6 sm:mt-8 text-center py-4">
        <p className="text-sm sm:text-base text-muted-foreground mb-3">
          Select an option to get started with your coffee roasting journey
        </p>
        <div className="flex justify-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-primary/10 text-xs sm:text-sm"
            onClick={() => router.push("/about")}
          >
            About
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-secondary hover:bg-secondary/10 text-xs sm:text-sm"
            onClick={() => router.push("/help")}
          >
            Help
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-accent hover:bg-accent/10 text-xs sm:text-sm"
            onClick={() => router.push("/contact")}
          >
            Contact
          </Button>
        </div>
      </footer>
    </div>
  );
}
