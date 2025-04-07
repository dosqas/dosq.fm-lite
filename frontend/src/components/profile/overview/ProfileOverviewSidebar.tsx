"use client";

import React, { useState, useEffect, useRef, RefObject } from "react";
import "../../../styles/profile/overview/profile-overview-sidebar.css";
import { ProfileSongsColHandle } from "./common/ProfileSongsCol";
import { useConnectionStatus } from "../../../context/ConnectionStatusContext";

interface ProfileSidebarProps {
  trackingRef: RefObject<ProfileSongsColHandle | null>;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ trackingRef }) => {
  const [video, setVideo] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);

  // Ref for the hidden file input
  const [videoLoaded, setVideoLoaded] = useState(false); // Track if the video has been loaded
  const { isOnline, isServerReachable } = useConnectionStatus(); // Use connection status

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch the video tied to the profile on component load
  const fetchUploadedVideo = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile/get-video");
      if (response.ok) {
        const data = await response.json();
        if (data.videoPath) {
          setUploadedVideoUrl(data.videoPath);
          setVideoLoaded(true); // Mark the video as loaded
        }
      } else {
      }
    } catch (error) {
    }
  };

  // Fetch the video on component load
  useEffect(() => {
    if (!videoLoaded) {
      fetchUploadedVideo();
    }
  }, [videoLoaded]);

  useEffect(() => {
    if (isOnline && isServerReachable && !videoLoaded) {
      console.log("Server is back online. Fetching uploaded video...");
      fetchUploadedVideo();
    }
  }, [isOnline, isServerReachable, videoLoaded]);


  const handleAddTrackClick = () => {
    if (trackingRef.current) {
      trackingRef.current.openAddMenu();
    }
  };

  const handleVideoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedVideo = event.target.files[0];
      setVideo(selectedVideo);
  
      const formData = new FormData();
      formData.append("video", selectedVideo);
  
      try {
        const response = await fetch("http://localhost:5000/api/profile/upload-video", {
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
    }
  };

  const handleUploadButtonClick = () => {
    // Trigger the file input dialog
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownloadVideo = () => {
    if (uploadedVideoUrl) {
      const link = document.createElement("a");
      link.href = `http://localhost:5000${uploadedVideoUrl}`;
      link.download = "favorite-concert-video.mp4"; // Default download name
      link.click();
    }
  };

  useEffect(() => {
    if (uploadStatus) {
      const timer = setTimeout(() => {
        setUploadStatus(null); // Clear the upload status after 1 second
      }, 1000);
  
      return () => clearTimeout(timer); // Cleanup the timer if the component unmounts or `uploadStatus` changes
    }
  }, [uploadStatus]);

  return (
    <div className="profile-sidebar">
      <div className="profile-sidebar-content">
        This is a sample bio. The user will be able to edit this
      </div>
      <hr className="profile-sidebar-divider" />

      <div className="video-upload-section">
        <h3>Favorite concert video</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          style={{ display: "none" }} // Hide the file input
        />
        <div className="video-buttons">
          <button onClick={handleUploadButtonClick}>Upload Video</button>
          {uploadedVideoUrl && (
            <button onClick={handleDownloadVideo}>Download Video</button>
          )}
        </div>
        {uploadStatus && <p>{uploadStatus}</p>}
        {uploadedVideoUrl && (
          <div className="uploaded-video">
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