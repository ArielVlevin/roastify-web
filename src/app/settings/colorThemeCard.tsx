import { ColorTheme } from "@/components/theme/theme-provider";
import { Cherry, Coffee, Leaf, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { SubPanel } from "@/components/ui/app-ui/panel";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Title from "@/components/ui/app-ui/title";

export default function ColorThemeCard({
  colorTheme,
  setColorTheme,
}: {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const getColorThemeIcon = () => {
    switch (colorTheme) {
      case "coffee":
        return <Coffee className="h-5 w-5" />;
      case "mint":
        return <Leaf className="h-5 w-5" />;
      case "berry":
        return <Cherry className="h-5 w-5" />;
      default:
        return <Palette className="h-5 w-5" />;
    }
  };

  return (
    <div>
      <Title className="flex items-center gap-2">
        {getColorThemeIcon()} Color Theme
      </Title>
      <SubPanel className="p-8 flex flex-col bg-gradient-to-l from-muted-light via-muted to-background/80 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Current Theme</p>
            <p className="text-sm text-muted-foreground">
              Choose a color scheme for the application
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto capitalize cursor-pointer data-[state=open]:bg-primary data-[state=open]:text-white dark:data-[state=open]:border-muted-foreground data-[state=open]:border-2"
              >
                {colorTheme || "Default"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-primary-dark/10  backdrop-blur-sm"
            >
              <DropdownMenuLabel>Color Themes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={colorTheme}
                onValueChange={(v) => setColorTheme(v as ColorTheme)}
              >
                <DropdownMenuRadioItem value="default">
                  <Palette className="mr-2 h-4 w-4" /> Default
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="coffee">
                  <Coffee className="mr-2 h-4 w-4" /> Coffee
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="mint">
                  <Leaf className="mr-2 h-4 w-4" /> Mint
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="berry">
                  <Cherry className="mr-2 h-4 w-4" /> Berry
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SubPanel>
    </div>
  );
}
