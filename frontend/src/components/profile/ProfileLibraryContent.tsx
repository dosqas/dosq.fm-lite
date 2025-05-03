"use client";

import React, { useState, useRef } from "react";
import LibraryHeader from "./ProfileLibraryHeader";
import ProfileSongsCol, { ProfileSongsColHandle } from "./ProfileSongsCol";
import LibrarySidebar from "./ProfileLibrarySidebar";
import "@styles/profile/library/profile-library-content.css";

const ProfileLibraryContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dosqs" | "artists" | "albums" | "tracks">("dosqs");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
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
        />
        <LibrarySidebar
          onYearSelect={(year) => {
            setSelectedYear(year);
            setSelectedMonth(null);
            setSelectedDay(null);
            songsColRef.current?.resetPage();
          }}
          onMonthSelect={(month) => {
            setSelectedMonth(month);
            setSelectedDay(null);
            songsColRef.current?.resetPage();
          }}
          onDaySelect={(day) => {
            setSelectedDay(day);
            songsColRef.current?.resetPage();
          }}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
        />
      </div>
    </div>
  );
};

export default ProfileLibraryContent;