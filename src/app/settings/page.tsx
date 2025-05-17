"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Thermometer,
  Monitor,
  Sun,
  Moon,
  Save,
  RotateCw,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";

// ייבוא של ה-store במקום ה-hooks הישנים
import { usePreferencesStore } from "@/lib/store/preferencesStore";

import { Button } from "@/components/ui/button";
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
import { Panel, SubPanel } from "@/components/ui/app-ui/panel";
import { useColorTheme } from "@/components/theme/theme-provider";
import ColorThemeCard from "./colorThemeCard";
import Title from "@/components/ui/app-ui/title";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();

  // שימוש ב-Zustand במקום ב-hooks הישנים
  const temperatureUnit = usePreferencesStore((state) => state.temperatureUnit);
  const toggleTemperatureUnit = usePreferencesStore(
    (state) => state.toggleTemperatureUnit
  );

  const [mounted, setMounted] = useState(false);
  const [initialSettings, setInitialSettings] = useState({
    theme: "",
    tempUnit: "F",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setInitialSettings({
      theme: theme || "system",
      tempUnit: temperatureUnit,
    });
  }, [theme, temperatureUnit]);

  useEffect(() => {
    if (!mounted) return;
    const themeChanged = initialSettings.theme !== theme;
    const tempUnitChanged = initialSettings.tempUnit !== temperatureUnit;
    setHasChanges(themeChanged || tempUnitChanged);
  }, [initialSettings, theme, temperatureUnit, mounted]);

  const saveSettings = () => {
    setInitialSettings({
      theme: theme || "system",
      tempUnit: temperatureUnit,
    });
    setSaveStatus("Settings saved successfully!");
    setHasChanges(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const resetSettings = () => {
    setTheme("system");
    if (temperatureUnit !== "F") toggleTemperatureUnit();
    setSaveStatus("Settings reset to defaults");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  if (!mounted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-lg animate-pulse">Loading settings...</p>
      </div>
    );
  }

  const settings = [
    {
      key: "temperatureUnit",
      icon: <Thermometer className="h-5 w-5" />,
      title: "Temperature Unit",
      description: "Change how temperatures are displayed throughout the app",
      value: temperatureUnit === "F" ? "Fahrenheit (°F)" : "Celsius (°C)",
      options: [
        { value: "F", label: "Fahrenheit (°F)" },
        { value: "C", label: "Celsius (°C)" },
      ],
      currentValue: temperatureUnit,
      onChange: (v: string) => {
        if (v !== temperatureUnit) toggleTemperatureUnit();
      },
    },
    {
      key: "theme",
      icon:
        theme === "light" ? (
          <Sun className="h-5 w-5" />
        ) : theme === "dark" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Monitor className="h-5 w-5" />
        ),
      title: "Display Mode",
      description: "Choose between light, dark, or system preference",
      value: theme,
      options: [
        {
          value: "light",
          label: "Light",
          icon: <Sun className="mr-2 h-4 w-4" />,
        },
        {
          value: "dark",
          label: "Dark",
          icon: <Moon className="mr-2 h-4 w-4" />,
        },
        {
          value: "system",
          label: "System",
          icon: <Monitor className="mr-2 h-4 w-4" />,
        },
      ],
      currentValue: theme,
      onChange: setTheme,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen  justify-center">
      <Panel className=" max-w-4xl mx-auto p-4 space-y-6 ">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={18} /> <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
          <Button
            onClick={saveSettings}
            variant={hasChanges ? "default" : "outline"}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Save size={18} /> <span>Save Changes</span>
          </Button>
        </div>

        {saveStatus && (
          <Alert className="bg-green-100 dark:bg-green-900/30 border-green-500">
            <Check className="h-4 w-4 text-green-500" />
            <AlertDescription>{saveStatus}</AlertDescription>
          </Alert>
        )}

        {settings.map((setting) => (
          <div key={setting.key}>
            <Title className="flex items-center gap-2">
              {setting.icon} {setting.title}
            </Title>
            <SubPanel className="p-8 flex flex-col ">
              <div className="flex items-center justify-between gap-16">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Current</p>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="ml-auto capitalize cursor-pointer data-[state=open]:bg-primary data-[state=open]:text-white dark:data-[state=open]:border-muted-foreground data-[state=open]:border-2"
                    >
                      {setting.value}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-background/40 backdrop-blur-sm"
                  >
                    <DropdownMenuLabel>{setting.title}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={setting.currentValue}
                      onValueChange={setting.onChange}
                    >
                      {setting.options.map((opt) => (
                        <DropdownMenuRadioItem
                          key={opt.value}
                          value={opt.value}
                        >
                          {opt.icon} {opt.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SubPanel>
          </div>
        ))}

        <ColorThemeCard colorTheme={colorTheme} setColorTheme={setColorTheme} />

        <div className="flex justify-center mt-4">
          <Button
            onClick={resetSettings}
            variant="outline"
            className="cursor-pointer flex items-center gap-2"
          >
            <RotateCw className="h-4 w-4" /> Reset to Defaults
          </Button>
        </div>
      </Panel>
    </div>
  );
}
