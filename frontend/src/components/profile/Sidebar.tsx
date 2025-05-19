"use client";

import React, { useState, useEffect, useRef, RefObject, useMemo } from "react";
import "@styles/profile/overview/profile-overview-sidebar.css";
import { SongListHandle } from "./lists/SongList";
import { ArtistListHandle } from "./lists/ArtistList";
import { useConnectionStatus } from "@context/ConnectionStatusContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchUploadedVideo } from "@service/userService";
import { SERVER_IP } from "@config/config";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProfileSidebarProps {
  trackingRef: RefObject<SongListHandle | ArtistListHandle | null>;
  activeTab: "songs" | "artists";
  onYearSelect?: (year: string | null) => void;
  onMonthSelect?: (month: string | null) => void;
  onDaySelect?: (day: string | null) => void;
  selectedYear?: string | null;
  selectedMonth?: string | null;
  selectedDay?: string | null;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  trackingRef,
  activeTab,
  onYearSelect,
  onMonthSelect,
  onDaySelect,
  selectedYear = null,
  selectedMonth = null,
  selectedDay = null,
}) => {
  // Video upload states
  const [video, setVideo] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Chart data state
  const [groupedData, setGroupedData] = useState<{ [key: string]: number }>({});
  const chartRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const { isOnline, isServerReachable } = useConnectionStatus();

  // Fetch the video tied to the profile on component load
  const loadUploadedVideo = async () => {
    const { videoPath } = await fetchUploadedVideo(SERVER_IP!);
    if (videoPath) {
      setUploadedVideoUrl(videoPath);
      setVideoLoaded(true);
    }
  };

  // Fetch the video on component load
  useEffect(() => {
    if (!videoLoaded) {
      loadUploadedVideo();
    }
  }, [videoLoaded]);

  useEffect(() => {
    if (isOnline && isServerReachable && !videoLoaded) {
      console.log("Server is back online. Fetching uploaded video...");
      loadUploadedVideo();
    }
  }, [isOnline, isServerReachable, videoLoaded]);

  // Chart data preparation
  const allMonths = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  }, []);

  const allDaysInMonth = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];
    const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, "0"));
  }, [selectedYear, selectedMonth]);

  const chartData = useMemo(() => {
    let completeData: { [key: string]: number };

    if (!selectedYear) {
      completeData = groupedData;
    } else if (!selectedMonth) {
      completeData = allMonths.reduce((acc, month) => {
        acc[month] = groupedData[month] || 0;
        return acc;
      }, {} as { [key: string]: number });
    } else {
      completeData = allDaysInMonth.reduce((acc, day) => {
        acc[day] = groupedData[day] || 0;
        return acc;
      }, {} as { [key: string]: number });
    }

    const sortedEntries = Object.entries(completeData).sort(([a], [b]) => parseInt(a) - parseInt(b));
    const labels = sortedEntries.map(([key]) => {
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      if (!selectedYear) {
        return key;
      } else if (!selectedMonth) {
        const monthIndex = parseInt(key, 10) - 1;
        return `${monthNames[monthIndex]} ${selectedYear}`;
      } else {
        return `${parseInt(key, 10)} ${monthNames[parseInt(selectedMonth, 10) - 1]}`;
      }
    });
    const data = sortedEntries.map(([, value]) => value);

    return {
      labels,
      datasets: [
        {
          label: "Number of Songs",
          data,
          backgroundColor: "#b9312a",
          hoverBackgroundColor: "#b54f49",
          borderColor: "#b9312a",
          borderWidth: 1,
        },
      ],
    };
  }, [groupedData, allMonths, allDaysInMonth, selectedYear, selectedMonth]);

  const chartHeight = useMemo(() => {
    const dataLength = Object.keys(chartData.labels).length;
    const minHeight = 250;
    const heightPerItem = 17.5;
    return Math.max(minHeight, dataLength * heightPerItem);
  }, [chartData.labels]);

  const chartOptions = useMemo(() => {
    return {
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      hover: {
        mode: "nearest" as const,
        intersect: true,
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false, 
          },
          ticks: {
            stepSize: 1,
            callback: (value: number | string) => `${value}`,
            color: "#ABA8A7",
            rotation: 0,
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false, 
          },
          ticks: {
            color: "#ABA8A7",
            stepSize: 1,
            font: {
              size: 10,
            }
          },
        },
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
      },
    };
  }, []);

  // Video upload handlers
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
      formData.append("file", selectedVideo);
  
      const token = localStorage.getItem("token");
  
      try {
        const response = await fetch(`https://${SERVER_IP}/api/user/upload-profile-video`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownloadVideo = () => {
    if (uploadedVideoUrl) {
      const link = document.createElement("a");
      link.href = `https://${SERVER_IP}${uploadedVideoUrl}`;
      link.download = "favorite-concert-video.mp4";
      link.click();
    }
  };

  // Chart interaction handlers
  const handleBarClick = (event: any) => {
    if (!chartRef.current || !onYearSelect || !onMonthSelect || !onDaySelect) return;

    const chart = chartRef.current;
    const elements = chart.getElementsAtEventForMode(
      event,
      "nearest",
      { intersect: true },
      false
    );

    if (elements.length > 0) {
      const index = elements[0].index;
      const label = chartData.labels[index];

      if (!selectedYear) {
        onYearSelect(label);
      } else if (!selectedMonth) {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        const [monthName] = label.split(" ");
        const monthIndex = monthNames.indexOf(monthName) + 1;
        const numericMonth = monthIndex.toString().padStart(2, "0");
        onMonthSelect(numericMonth);
      } else {
        const day = label.split(" ")[0]; 
        const numericDay = parseInt(day).toString().padStart(2, "0"); 
        onDaySelect(numericDay);
      }
    }
  };

  const handleBackClick = () => {
    if (!onYearSelect || !onMonthSelect || !onDaySelect) return;
    
    onDaySelect(null);
    if (selectedMonth) {
      onMonthSelect(null);
    } else if (selectedYear) {
      onYearSelect(null);
    }
  };

  useEffect(() => {
    if (uploadStatus) {
      const timer = setTimeout(() => {
        setUploadStatus(null);
      }, 1000);
  
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  return (
    <div className="profile-sidebar">
      <div className="video-upload-section">
        <h3>Favorite concert video</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          style={{ display: "none" }}
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
              <source src={`https://${SERVER_IP}${uploadedVideoUrl}`} type="video/mp4" />
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
        {activeTab === "songs" ? "Add Song" : "Add Artist"}
      </button>
      <hr className="profile-sidebar-divider" />

      {/* Chart Section */}
      <div className="chart-section">
        <h3>Date range</h3>
        <div className="chart-container" style={{ height: chartHeight }}>
          <Bar ref={chartRef} data={chartData} options={chartOptions} onClick={handleBarClick} />
        </div>
        {(selectedYear || selectedMonth) && onYearSelect && onMonthSelect && onDaySelect && (
          <button className="back-button" onClick={handleBackClick}>
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileSidebar;