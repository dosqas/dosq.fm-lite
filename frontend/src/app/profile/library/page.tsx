import ProfileHeader from "@/components/profile/shared/ProfileHeader";
import ProfileLibraryContent from "@/components/profile/library/ProfileLibraryContent";
import "../../../styles/profile/profile.css";
import { ConnectionStatusProvider } from "@/context/ConnectionStatusContext";

const ProfileLibraryPage: React.FC = () => {
  return (
    <div className="profile-page">
      <ConnectionStatusProvider>
        <ProfileHeader />
        <ProfileLibraryContent />
      </ConnectionStatusProvider>
    </div>
  );
}

export default ProfileLibraryPage;