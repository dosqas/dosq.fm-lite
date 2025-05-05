"use client";

import React, { useRef } from "react";
import SongList, { SongListHandle } from "./lists/SongList";
import ProfileOverviewSidebar from "./Sidebar";
import "@styles/profile/overview/profile-overview-content.css";

const ProfileContent: React.FC = () => {
  const profileSongsColRef = useRef<SongListHandle>(null);

  return (
    <main className="profile-content">
      <p className="profile-content-title">Recent tracks</p>
      <div className="profile-content-grid">
        <SongList ref={profileSongsColRef}  />
        <ProfileOverviewSidebar trackingRef={profileSongsColRef} />
      </div>
    </main>
  );
};

export default ProfileContent;