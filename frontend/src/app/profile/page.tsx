import ProfileHeader from "@/components/profile/shared/ProfileHeader";
import ProfileOverviewContent from "@/components/profile/overview/ProfileOverviewContent";
import "../../styles/profile/profile.css";
import { ConnectionStatusProvider } from "@/context/ConnectionStatusContext";

const ProfileOverviewPage: React.FC = () => {
  return (
    <div className="profile-page">
      <ConnectionStatusProvider>
        <ProfileHeader />
        <ProfileOverviewContent />
      </ConnectionStatusProvider>
    </div>
  );
}

export default ProfileOverviewPage;