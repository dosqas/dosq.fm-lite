import React from "react";
import "../../../styles/profile/library/profile-library-header.css";

interface LibraryHeaderProps {
  activeTab: "dosqs" | "artists" | "albums" | "tracks";
  setActiveTab: (tab: "dosqs" | "artists" | "albums" | "tracks") => void;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="library-header">
      <button
        className={`library-tab ${activeTab === "dosqs" ? "active" : ""}`}
        onClick={() => setActiveTab("dosqs")}
      >
        Dosqs
      </button>
      <button
        className={`library-tab ${activeTab === "artists" ? "active" : ""}`}
        onClick={() => setActiveTab("artists")}
      >
        Artists
      </button>
      <button
        className={`library-tab ${activeTab === "albums" ? "active" : ""}`}
        onClick={() => setActiveTab("albums")}
      >
        Albums
      </button>
      <button
        className={`library-tab ${activeTab === "tracks" ? "active" : ""}`}
        onClick={() => setActiveTab("tracks")}
      >
        Tracks
      </button>
    </div>
  );
};

export default LibraryHeader;