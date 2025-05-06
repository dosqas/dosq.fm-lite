import React from "react";
import "@styles/profile/library/profile-library-header.css";

interface UserContentHeaderProps {
  activeTab: "songs" | "artists";
  setActiveTab: (tab: "songs" | "artists") => void;
}

const UserContentHeader: React.FC<UserContentHeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="library-header">
      <button
        className={`library-tab ${activeTab === "songs" ? "active" : ""}`}
        onClick={() => setActiveTab("songs")}
      >
        Songs
      </button>
      <button
        className={`library-tab ${activeTab === "artists" ? "active" : ""}`}
        onClick={() => setActiveTab("artists")}
      >
        Artists
      </button>
    </div>
  );
};

export default UserContentHeader;