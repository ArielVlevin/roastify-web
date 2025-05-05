import { Button } from "@/components/ui/button";
import { TemperatureData } from "@/lib/types";
import { Coffee, Save } from "lucide-react";

interface RoastLayoutProps {
  children: React.ReactNode;
  temperatureData: TemperatureData[];
  handleSaveClick: () => void;
  onGoHome: () => void;
}
interface HeaderProps {
  temperatureData: TemperatureData[];
  handleSaveClick: () => void;
  onGoHome: () => void;
}

const RoastLayout = ({
  children,
  temperatureData,
  handleSaveClick,
  onGoHome,
}: RoastLayoutProps) => {
  return (
    <div className="flex flex-col  p-4 sm:p-6  w-full">
      <Header
        temperatureData={temperatureData}
        handleSaveClick={handleSaveClick}
        onGoHome={onGoHome}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
};

const Header = ({
  temperatureData,
  handleSaveClick,
  onGoHome,
}: HeaderProps) => {
  return (
    <header className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1
        className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 cursor-pointer"
        onClick={onGoHome}
      >
        <Coffee size={28} className="text-primary" /> Coffee Roaster
      </h1>

      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <Button
          onClick={handleSaveClick}
          disabled={temperatureData && temperatureData.length === 0}
          className="flex items-center gap-1 bg-primary hover:bg-primary-dark text-primary-foreground py-2 px-3 sm:px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          <Save size={16} /> Save Roast
        </Button>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="mt-6 sm:mt-8 text-center text-muted-foreground text-xs sm:text-sm">
      <p>
        Connected to Raspberry Pi with Phidget sensors: hub0000_0, tmp1101_0
      </p>
    </footer>
  );
};
export default RoastLayout;
