import ProfileHeader from "@/components/ProfileHeader";
import ProfileContent from "@/components/ProfileContent";
import "../../styles/profile.css";

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page">
        <ProfileHeader />
        <ProfileContent />
    </div>
  );
}

export default ProfilePage;