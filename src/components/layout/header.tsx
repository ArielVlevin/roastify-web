import { Settings } from "lucide-react";
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
          className="rounded-full shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer"
          onClick={() => router.push("/settings")}
        >
          <Settings className="h-[1.2rem] w-[1.2rem] text-primary" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
}
