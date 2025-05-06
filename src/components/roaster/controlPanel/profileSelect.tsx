import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoastProfile } from "@/lib/types";

interface ProfileSelectProps {
  className?: string;
  profiles: RoastProfile[];
  selectedProfile: RoastProfile;
  onSelectProfile: (profileName: string) => void;
  isRoasting: boolean;
}

const ProfileSelect = ({
  className = "w-full",
  profiles,
  selectedProfile,
  onSelectProfile,
  isRoasting,
}: ProfileSelectProps) => {
  return (
    <Select
      value={selectedProfile.name}
      onValueChange={onSelectProfile}
      disabled={isRoasting}
    >
      <SelectTrigger id="profile-select" className={className}>
        <SelectValue placeholder="Select a profile" />
      </SelectTrigger>
      <SelectContent>
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
