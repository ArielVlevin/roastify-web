"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sun,
  Moon,
  Thermometer,
  Palette,
  Save,
  RotateCw,
  Coffee,
  Leaf,
  Cherry,
  Monitor,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ColorTheme, useColorTheme } from "@/components/theme-provider";
import { useTemperatureHandling } from "@/hooks/useTemperatureHandling";
import { getTemperatureUnit } from "@/lib/localStorageService";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Temperature settings
  const [temperatureUnit, setTempUnit] = useState<"F" | "C">(
    getTemperatureUnit() || "F"
  );
  const { toggleTemperatureUnit } = useTemperatureHandling(
    temperatureUnit,
    setTempUnit
  );

  // State tracking
  const [mounted, setMounted] = useState(false);
  const [initialSettings, setInitialSettings] = useState({
    theme: "",
    tempUnit: "F",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Load initial settings
  useEffect(() => {
    setMounted(true);
    setInitialSettings({
      theme: theme || "system",
      tempUnit: temperatureUnit,
    });
  }, [theme, temperatureUnit]);

  // Track changes
  useEffect(() => {
    if (!mounted) return;

    const themeChanged = initialSettings.theme !== theme;
    const tempUnitChanged = initialSettings.tempUnit !== temperatureUnit;

    setHasChanges(themeChanged || tempUnitChanged);
  }, [initialSettings, theme, temperatureUnit, mounted]);

  // Save settings
  const saveSettings = () => {
    // Update initial settings to current values
    setInitialSettings({
      theme: theme || "system",
      tempUnit: temperatureUnit,
    });

    // Show success message
    setSaveStatus("Settings saved successfully!");
    setHasChanges(false);

    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  // Reset settings
  const resetSettings = () => {
    // Reset to defaults
    setTheme("system");
    if (temperatureUnit !== "F") {
      toggleTemperatureUnit();
    }

    setSaveStatus("Settings reset to defaults");
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  // Loading state
  if (!mounted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </Button>

        <h1 className="text-2xl font-bold">Settings</h1>

        <Button
          onClick={saveSettings}
          //disabled={!hasChanges}
          variant={hasChanges ? "default" : "outline"}
          className="flex items-center gap-1"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </Button>
      </div>

      {saveStatus && (
        <Alert className="bg-green-100 dark:bg-green-900/30 border-green-500">
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription>{saveStatus}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Temperature Unit Setting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Temperature Unit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Current Unit</p>
                <p className="text-sm text-muted-foreground">
                  Change how temperatures are displayed throughout the app
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    {temperatureUnit === "F"
                      ? "Fahrenheit (°F)"
                      : "Celsius (°C)"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Temperature Unit</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={temperatureUnit}
                    onValueChange={(v) => {
                      if (v !== temperatureUnit) {
                        toggleTemperatureUnit();
                      }
                    }}
                  >
                    <DropdownMenuRadioItem value="F">
                      Fahrenheit (°F)
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="C">
                      Celsius (°C)
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Display Mode Setting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Monitor className="h-5 w-5" />
              )}
              Display Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Current Mode</p>
                <p className="text-sm text-muted-foreground">
                  Choose between light, dark, or system preference
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto capitalize">
                    {theme || "System"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Display Mode</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value="light">
                      <Sun className="mr-2 h-4 w-4" /> Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <Moon className="mr-2 h-4 w-4" /> Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <Monitor className="mr-2 h-4 w-4" /> System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Color Theme Setting */}
        <ColorThemeCard />

        {/* Reset button */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={resetSettings}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}

// Separate component for color theme to handle error boundaries
function ColorThemeCard() {
  const [error, setError] = useState(false);

  // If there was an error rendering, return null
  if (error) return null;

  try {
    // Try to render the color theme card
    return <ColorThemeCardContent />;
  } catch (err) {
    // If it fails, set error and return nothing
    setError(true);
    console.error("Error rendering ColorThemeCard:", err);
    return null;
  }
}

function ColorThemeCardContent() {
  const { colorTheme, setColorTheme } = useColorTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to avoid hydration errors
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getColorThemeIcon()}
          Color Theme
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Current Theme</p>
            <p className="text-sm text-muted-foreground">
              Choose a color scheme for the application
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto capitalize">
                {colorTheme || "Default"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Color Themes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={colorTheme}
                onValueChange={(value) => setColorTheme(value as ColorTheme)}
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
      </CardContent>
    </Card>
  );
}
