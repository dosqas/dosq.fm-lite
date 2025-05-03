"use client";

import React, { useEffect, useState } from "react";
import ProfileHeader from "@/components/profile/overview/ProfileHeader";
import ProfileOverviewContent from "@/components/profile/overview/ProfileOverviewContent";
import "../../styles/profile/profile.css";
import { useRouter } from "next/navigation";
import { isLoggedIn, clearToken } from "../../utils/authUtils";

const ProfilePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP;

  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      console.log("Profile page mounted, checking auth status");
  
      if (!isLoggedIn()) {
        console.log("No authentication token found, redirecting to login");
        router.replace("/login");
        return;
      }
  
      console.log("User is authenticated, fetching user data");
  
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
  
        const response = await fetch(`http://${SERVER_IP}/api/User/get-username`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const contentType = response.headers.get("Content-Type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch user data");
          } else {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to fetch user data");
          }
        }
  
        const data = await response.json();
        setUsername(data.username);
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
  
    checkAuthAndFetchUser();
  }, [router, SERVER_IP]);

  // Add a logout function
  const handleLogout = () => {
    console.log("Logging out");
    clearToken();
    router.replace("/login");
  };

  // Show a loading state while checking authentication
  if (isLoading) {
    return <div className="profile-loading">Loading your profile...</div>;
  }

  // Render the profile page if authenticated
  return (
    <div className="profile-page">
      <div className="auth-controls" style={{ background: "#313131", width: "100%", textAlign: "right", paddingRight: "0.65rem", paddingTop: "0.5rem" }}>
        <button onClick={handleLogout} className="logout-button" style={{ background: "#f1f1f1", width: "5%"}}>Logout</button>
      </div>
      <ProfileHeader username={username} error={error} />
      <ProfileOverviewContent />
    </div>
  );
};

export default ProfilePage;