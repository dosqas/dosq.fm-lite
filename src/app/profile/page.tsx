import ProfileHeader from "@/components/profile/shared/ProfileHeader";
import ProfileOverviewContent from "@/components/profile/overview/ProfileOverviewContent";
import "../../styles/profile/profile.css";

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page">
        <ProfileHeader />
        <ProfileOverviewContent />
    </div>
  );
}

export default ProfilePage;