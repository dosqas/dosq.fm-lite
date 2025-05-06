"use client";

import React, { useEffect, useState } from "react";
import UserHeader from "@components/profile/UserHeader";
import UserContent from "@content/UserContent";
import AdminContent from "@content/AdminContent";
import "@styles/profile/profile.css";
import { useRouter } from "next/navigation";
import { isLoggedIn, clearToken } from "@utils/authUtils";
import { ConnectionStatusProvider } from "@context/ConnectionStatusContext";

const ProfilePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Admin status (null initially)
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
            Authorization: `Bearer ${token}`,
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
        console.log("Response data:", data); // Log the entire response
        setUsername(data.username);
        setIsAdmin(data.isAdmin); // Update the admin status
        console.log("User is admin:", data.isAdmin); // Log the admin status
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false); // Mark loading as complete
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
  if (isLoading || isAdmin === null) {
    return <div className="profile-loading">Loading your profile...</div>;
  }

  // Render the profile page if authenticated
  return (
    <ConnectionStatusProvider>
      <div className="profile-page">
        <div
          className="auth-controls"
          style={{
            background: "#313131",
            width: "100%",
            textAlign: "right",
            paddingRight: "0.65rem",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
          }}
        >
          <button
            onClick={handleLogout}
            className="logout-button"
            style={{ background: "#f1f1f1", width: "5%" }}
          >
            Logout
          </button>
        </div>
        <UserHeader username={username} error={error} />
        {isAdmin ? <AdminContent /> : <UserContent />} {/* Conditionally render content */}
      </div>
    </ConnectionStatusProvider>
  );
};

export default ProfilePage;