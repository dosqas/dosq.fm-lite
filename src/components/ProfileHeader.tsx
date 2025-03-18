"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/legacy/image';
import "../styles/profile-header.css";
import { usePathname } from 'next/navigation';

const ProfileHeader: React.FC = () => {
    const pathname = usePathname();

    return (
        <header className="profile-header">
          <div className="profile-header-content">
              <div className="profile-header-avatar">
                  <Image src="/images/user-circle.svg" alt="User Avatar" layout="fill" objectFit="contain" priority/>
              </div>
              <div className="profile-header-info">
                  <div className="profile-header-username">dosqas</div>
                  <div className="profile-header-name-and-dosqing-since">
                      <span className="profile-header-name">sebsop </span>
                      <span className="profile-header-dosqing-since">• dosqing since 17 Mar 2025</span>
                  </div>
                  <div className="profile-header-tabs">
                      <Link href="/profile/" legacyBehavior>
                        <a className={pathname === '/profile' ? 'active' : ''}>Overview</a>
                      </Link>
                      <Link href="/profile/reports" legacyBehavior>
                        <a className={pathname === '/profile/reports' ? 'active' : ''}>Reports</a>
                      </Link>
                      <Link href="/profile/library" legacyBehavior>
                        <a className={pathname === '/profile/library' ? 'active' : ''}>Library</a>
                      </Link>
                      <Link href="/profile/trends" legacyBehavior>
                        <a className={pathname === '/profile/trends' ? 'active' : ''}>Trends</a>
                      </Link>
                      <Link href="/profile/breakdown" legacyBehavior>
                        <a className={pathname === '/profile/breakdown' ? 'active' : ''}>Breakdown</a>
                      </Link>
                      <Link href="/profile/obscurity" legacyBehavior>
                        <a className={pathname === '/profile/obscurity' ? 'active' : ''}>Obscurity</a>
                      </Link>
                  </div>
                  <div className="profile-header-stats">
                      <div className='profile-header-stat'>
                          <span className='profile-header-stat-label'>DOSQS</span>
                          <span className='profile-header-stat-value'>25</span>
                      </div>
                      <div className='profile-header-stat'>
                          <span className='profile-header-stat-label'>ARTISTS</span>
                          <span className='profile-header-stat-value'>5</span>
                      </div>
                  </div>
              </div>
            </div>
        </header>
  );
};

export default ProfileHeader;