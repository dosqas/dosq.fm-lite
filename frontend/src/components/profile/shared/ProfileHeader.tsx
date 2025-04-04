"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import "../../../styles/profile/shared/profile-header.css";
import { usePathname } from "next/navigation";
import { useConnectionStatus } from "../../../context/ConnectionStatusContext";

const ProfileHeader: React.FC = () => {
  const pathname = usePathname();
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
          <div className="profile-header-username">dosqas</div>
          <div className="profile-header-name-and-dosqing-since">
            <span className="profile-header-name">sebsop </span>
            <span className="profile-header-dosqing-since">• dosqing since 17 Mar 2025</span>
          </div>
          <div className="profile-header-tabs">
            <Link href="/profile/" legacyBehavior>
              <a className={pathname === "/profile" ? "active" : ""}>Overview</a>
            </Link>
            <Link href="/profile/reports" legacyBehavior>
              <a className={pathname === "/profile/reports" ? "active" : ""}>Reports</a>
            </Link>
            <Link href="/profile/library" legacyBehavior>
              <a className={pathname === "/profile/library" ? "active" : ""}>Library</a>
            </Link>
            <Link href="/profile/trends" legacyBehavior>
              <a className={pathname === "/profile/trends" ? "active" : ""}>Trends</a>
            </Link>
            <Link href="/profile/breakdown" legacyBehavior>
              <a className={pathname === "/profile/breakdown" ? "active" : ""}>Breakdown</a>
            </Link>
            <Link href="/profile/obscurity" legacyBehavior>
              <a className={pathname === "/profile/obscurity" ? "active" : ""}>Obscurity</a>
            </Link>
          </div>
          <div className="profile-header-stats">
            <div className="profile-header-stat">
              <span className="profile-header-stat-label">DOSQS</span>
              <span className="profile-header-stat-value">25</span>
            </div>
            <div className="profile-header-stat">
              <span className="profile-header-stat-label">ARTISTS</span>
              <span className="profile-header-stat-value">5</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;