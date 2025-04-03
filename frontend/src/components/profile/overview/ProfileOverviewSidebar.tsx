"use client";

import React, { RefObject } from "react";
import "../../../styles/profile/overview/profile-overview-sidebar.css";
import { ProfileSongsColHandle } from "./common/ProfileSongsCol";

interface ProfileSidebarProps {
  trackingRef: RefObject<ProfileSongsColHandle | null>;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ trackingRef }) => {
  const handleAddTrackClick = () => {
    if (trackingRef.current) {
      trackingRef.current.openAddMenu();
    }
  };

  return (
    <div className="profile-sidebar">
      <div className="profile-sidebar-content">
        This is a sample bio. The user will be able to edit this
      </div>
      <hr className="profile-sidebar-divider" />
      <button
        className="profile-sidebar-add-track-button"
        onClick={handleAddTrackClick}
      >
        Add Track
      </button>
    </div>
  );
};

export default ProfileSidebar;