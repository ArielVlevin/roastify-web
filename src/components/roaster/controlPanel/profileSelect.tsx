import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoastStore } from "@/lib/store/roastStore";
import { cn } from "@/lib/utils";

interface ProfileSelectProps {
  className?: string;
  onSelectProfile: (profileName: string) => void;
  isRoasting: boolean;
}

const ProfileSelect = ({
  className = "bg-primary-dark/10 dark:bg-primary-dark/10 hover:bg-primary-dark/20 dark:hover:bg-primary-dark/20 animate-fade-in",
  onSelectProfile,
  isRoasting,
}: ProfileSelectProps) => {
  const profiles = useRoastStore((state) => state.profiles);
  const selectedProfile = useRoastStore((state) => state.selectedProfile);
  return (
    <Select
      value={selectedProfile.name}
      onValueChange={onSelectProfile}
      disabled={isRoasting}
    >
      <SelectTrigger id="profile-select" className={cn("w-full", className)}>
        <SelectValue placeholder="Select a profile" />
      </SelectTrigger>
      <SelectContent className="bg-primary-dark/10 backdrop-blur-sm ">
        {profiles.map((profile) => (
          <SelectItem key={profile.name} value={profile.name}>
            {profile.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProfileSelect;
