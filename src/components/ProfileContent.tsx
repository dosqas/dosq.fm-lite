import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProfileSongsCol from './ProfileSongsCol';
import ProfileSidebar from './ProfileSidebar';
import "../styles/profile-content.css";

const ProfileContent: React.FC = () => {
  return (
    <main className="profile-content">
        <ProfileSongsCol />
        <ProfileSidebar />
    </main>
  );
};

export default ProfileContent;