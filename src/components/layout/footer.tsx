"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="w-full max-w-4xl mx-auto mt-6 sm:mt-8 text-center py-4">
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
  );
}
