"use client";

import React, { useState } from "react";
import LibraryHeader from "./ProfileLibraryHeader";
import ProfileSongsCol from "../overview/common/ProfileSongsCol";
import LibrarySidebar from "./ProfileLibrarySidebar";
import "../../../styles/profile/library/profile-library-content.css";

interface GroupedData {
  [key: string]: number; // e.g., { "2023": 10, "2024": 15 }
}

const ProfileLibraryContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dosqs" | "artists" | "albums" | "tracks">("dosqs");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [groupedData, setGroupedData] = useState<GroupedData>({});

  // Callback to handle grouped data from ProfileSongsCol
  const handleGroupedData = (data: GroupedData) => {
    setGroupedData(data);
  };

  return (
    <div className="profile-library-content">
      <div className="profile-library-title">Library</div>
      <div className="profile-library-content-header">
        <LibraryHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <hr className="profile-library-content-hr" />

      <div className="profile-library-content-grid">
        <ProfileSongsCol
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
          onGroupedData={handleGroupedData} 
        />
        <LibrarySidebar
          groupedData={groupedData}
          onYearSelect={setSelectedYear}
          onMonthSelect={setSelectedMonth}
          onDaySelect={setSelectedDay}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      </div>
    </div>
  );
};

export default ProfileLibraryContent;