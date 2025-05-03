"use client";

import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";
import "@styles/profile/shared/profile-header.css";
import { useConnectionStatus } from "@context/ConnectionStatusContext";

interface ProfileHeaderProps {
  username: string | null;
  error: string | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, error }) => {
  const { isOnline, isServerReachable, statusMessage } = useConnectionStatus();
  const [showStatusBar, setShowStatusBar] = useState(false);
  const [statusColor, setStatusColor] = useState("red");
  const [hasCheckedConnection, setHasCheckedConnection] = useState(false);

  useEffect(() => {
    if (!hasCheckedConnection) {
      setHasCheckedConnection(true);
      return;
    }

    if (!isOnline || !isServerReachable) {
      setStatusColor("red");
      setShowStatusBar(true);
    } else {
      setStatusColor("green");
      setTimeout(() => setShowStatusBar(false), 2000);
    }
  }, [isOnline, isServerReachable, hasCheckedConnection]);

  return (
    <header className="profile-header">
      {hasCheckedConnection && (
        <div
          className={`profile-header-connection-status ${showStatusBar ? "visible" : ""}`}
          style={{
            backgroundColor: statusColor,
          }}
        >
          <p style={{ color: "white", textAlign: "center", margin: 0, lineHeight: "2rem" }}>
            {statusMessage}
          </p>
        </div>
      )}
      <div className="profile-header-content">
        <div className="profile-header-avatar">
          <Image
            src="/images/user-circle.svg"
            alt="User Avatar"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
        <div className="profile-header-info">
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <div className="profile-header-username">{username}</div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;