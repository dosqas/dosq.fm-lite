"use client";

import React, { useState, RefObject } from "react";
import "../../../styles/profile/overview/profile-overview-sidebar.css";
import { ProfileSongsColHandle } from "./common/ProfileSongsCol";

interface ProfileSidebarProps {
  trackingRef: RefObject<ProfileSongsColHandle | null>;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ trackingRef }) => {
  const [video, setVideo] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);

  const handleAddTrackClick = () => {
    if (trackingRef.current) {
      trackingRef.current.openAddMenu();
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setVideo(event.target.files[0]);
    }
  };

  const handleVideoUpload = async () => {
    if (!video) {
      setUploadStatus("Please select a video to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);

    try {
      const response = await fetch("http://localhost:5000/api/songs/upload-video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedVideoUrl(data.videoPath);
        setUploadStatus("Video uploaded successfully!");
      } else {
        setUploadStatus("Failed to upload video.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus("Error uploading video.");
    }
  };

  return (
    <div className="profile-sidebar">
      <div className="profile-sidebar-content">
        This is a sample bio. The user will be able to edit this
      </div>
      <hr className="profile-sidebar-divider" />

      <div className="video-upload-section">
        <h3>Upload a Video</h3>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        <button onClick={handleVideoUpload}>Upload Video</button>
        {uploadStatus && <p>{uploadStatus}</p>}
        {uploadedVideoUrl && (
          <div className="uploaded-video">
            <h4>Uploaded Video:</h4>
            <video controls width="100%">
              <source src={`http://localhost:5000${uploadedVideoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
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