import HomeActionGrid from "@/components/home/HomeActionGrid";
import { Coffee } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col text-center items-center justify-center h-screen">
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

        <HomeActionGrid />
      </div>

      <p className="text-sm sm:text-base text-muted-foreground mb-3">
        Select an option to get started with your coffee roasting journey
      </p>
    </div>
  );
}
