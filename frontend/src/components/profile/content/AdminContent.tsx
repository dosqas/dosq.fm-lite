"use client";

import React, { useRef } from "react";
import MonitoredUsersList from "@lists/MonitoredUsersList";
import ProfileOverviewSidebar from "../Sidebar";
import "@styles/profile/overview/profile-overview-content.css";

const AdminContent: React.FC = () => {
  return (
    <main className="profile-content">
      <p className="profile-content-title">Monitored Users</p>
      <div className="profile-content-grid">
        <MonitoredUsersList/>
      </div>
    </main>
  );
};

export default AdminContent;