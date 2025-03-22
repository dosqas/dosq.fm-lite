import ProfileHeader from "@/components/profile/shared/ProfileHeader";
import ProfileLibraryContent from "@/components/profile/library/ProfileLibraryContent";
import "../../../styles/profile/profile.css";

const ProfileLibraryPage: React.FC = () => {
  return (
    <div className="profile-page">
        <ProfileHeader />
        <ProfileLibraryContent />
    </div>
  );
}

export default ProfileLibraryPage;