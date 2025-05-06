"use client";

import React, { useRef, useState } from "react";
import SongList, { SongListHandle } from "@lists/SongList";
import ArtistList, { ArtistListHandle } from "@lists/ArtistList"; // Import ArtistList and its handle
import UserContentHeader from "@components/profile/UserContentHeader";
import ProfileOverviewSidebar from "../Sidebar";
import "@styles/profile/overview/profile-overview-content.css";

const ProfileContent: React.FC = () => {
  const profileSongsColRef = useRef<SongListHandle>(null); // Ref for SongList
  const profileArtistsColRef = useRef<ArtistListHandle>(null); // Ref for ArtistList
  const [activeTab, setActiveTab] = useState<"songs" | "artists">("songs");

  return (
    <main className="profile-content" style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem" }}>
      {/* Main Content */}
      <div className="profile-main-content" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <UserContentHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "songs" && <SongList ref={profileSongsColRef} />}
        {activeTab === "artists" && <ArtistList ref={profileArtistsColRef} />}
      </div>

      {/* Sidebar */}
      <ProfileOverviewSidebar
        trackingRef={activeTab === "songs" ? profileSongsColRef : profileArtistsColRef} // Dynamically pass the correct ref
        activeTab={activeTab} // Pass the active tab to the sidebar
      />
    </main>
  );
};

export default ProfileContent;