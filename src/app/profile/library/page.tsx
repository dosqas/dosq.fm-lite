import ProfileHeader from "@/components/profile-components/Shared/ProfileHeader";
import ProfileContent from "@/components/ProfileContent";
import "../../../styles/profile.css";

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page">
        <ProfileHeader />
        <ProfileContent />
    </div>
  );
}

export default ProfilePage;