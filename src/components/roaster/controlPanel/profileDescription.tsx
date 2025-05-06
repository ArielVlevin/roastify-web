import { SubPanel } from "@/components/ui/app-ui/panel";
import { RoastProfile } from "@/lib/types";

const ProfileDescription = ({
  selectedProfile,
}: {
  selectedProfile: RoastProfile;
}) => (
  <SubPanel>
    <p className="text-muted-foreground text-sm">
      {selectedProfile.description}
    </p>
  </SubPanel>
);

export default ProfileDescription;
