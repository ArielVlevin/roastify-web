import { Coffee, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();

  return (
    <header className="w-full">
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

      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <Coffee size={32} className="text-primary" />
          <span>Coffee Roast</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Professional Coffee Roasting Simulator
        </p>
      </div>
    </header>
  );
}
