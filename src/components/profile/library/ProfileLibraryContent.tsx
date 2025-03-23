"use client";

import React, { useState, useRef } from "react";
import LibraryHeader from "./ProfileLibraryHeader";
import ProfileSongsCol, { ProfileSongsColHandle } from "../overview/common/ProfileSongsCol";
import LibrarySidebar from "./ProfileLibrarySidebar";
import "../../../styles/profile/library/profile-library-content.css";

interface GroupedData {
  [key: string]: number;
}

const ProfileLibraryContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dosqs" | "artists" | "albums" | "tracks">("dosqs");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [groupedData, setGroupedData] = useState<GroupedData>({});
  const [currentPage, setCurrentPage] = useState(1);

  const handleGroupedData = (data: GroupedData) => {
    setGroupedData(data);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Create a ref for ProfileSongsCol
  const songsColRef = useRef<ProfileSongsColHandle>(null);

  return (
    <div className="profile-library-content">
      <div className="profile-library-title">Library</div>
      <div className="profile-library-content-header">
        <LibraryHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <hr className="profile-library-content-hr" />

      <div className="profile-library-content-grid">
        <ProfileSongsCol
          ref={songsColRef} 
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
          onGroupedData={handleGroupedData} 
          onPageChange={handlePageChange}
        />
        <LibrarySidebar
          groupedData={groupedData}
          onYearSelect={(year) => {
            setSelectedYear(year);
            handlePageChange(1);
            songsColRef.current?.resetPage();
          }}
          onMonthSelect={(month) => {
            setSelectedMonth(month);
            handlePageChange(1); 
            songsColRef.current?.resetPage();
          }}
          onDaySelect={(day) => {
            setSelectedDay(day);
            handlePageChange(1);
            songsColRef.current?.resetPage(); 
          }}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      </div>
    </div>
  );
};

export default ProfileLibraryContent;