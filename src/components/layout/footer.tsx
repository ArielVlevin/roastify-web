"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Renders a footer component with navigation buttons for "About", "Help", and "Contact" pages.
 * Each button navigates to its respective page when clicked.
 * The footer is styled to be centered and responsive, adjusting its layout based on screen size.
 */

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
      <p className="text-xs text-muted-foreground mt-2">© 2023 Roastify</p>
    </footer>
  );
}
