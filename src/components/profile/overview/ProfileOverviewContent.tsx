"use client";

import React, { useRef } from "react";
import ProfileSongsCol, { ProfileSongsColHandle } from "./common/ProfileSongsCol";
import ProfileOverviewSidebar from "./ProfileOverviewSidebar";
import "../../../styles/profile/overview/profile-overview-content.css";

const ProfileContent: React.FC = () => {
  const profileSongsColRef = useRef<ProfileSongsColHandle>(null);

  return (
    <main className="profile-content">
      <p className="profile-content-title">Recent tracks</p>
      <div className="profile-content-grid">
        <ProfileSongsCol ref={profileSongsColRef}  />
        <ProfileOverviewSidebar trackingRef={profileSongsColRef} />
      </div>
    </main>
  );
};

export default ProfileContent;