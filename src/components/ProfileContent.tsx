import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProfileSongsCol from './ProfileSongsCol';
import ProfileSidebar from './ProfileSidebar';
import "../styles/profile-content.css";

const ProfileContent: React.FC = () => {
  const songs = [
    {
      id: 1,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 1',
      artist: 'Artist 1',
      album: 'Album 1',
      genre: 'Genre 1',
      dateListened: '2 hours ago',
    },
    {
      id: 2,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 2',
      artist: 'Artist 1',
      album: 'Album 1',
      genre: 'Genre 1',
      dateListened: '2 hours ago',
    },
    {
      id: 3,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 3',
      artist: 'Artist 1',
      album: 'Album 1',
      genre: 'Genre 1',
      dateListened: '2 hours ago',
    },
    {
      id: 4,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 4',
      artist: 'Artist 1',
      album: 'Album 1',
      genre: 'Genre 1',
      dateListened: '2 hours ago',
    },
    {
      id: 5,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 5',
      artist: 'Artist 1',
      album: 'Album 1',
      genre: 'Genre 1',
      dateListened: '2 hours ago',
    },
    {
      id: 6,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 6',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      dateListened: '2 hours ago',
    },
    {
      id: 7,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 7',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      dateListened: '2 hours ago',
    },
    {
      id: 8,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 8',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      dateListened: '2 hours ago',
    },
    {
      id: 9,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 9',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      dateListened: '2 hours ago',
    },
    {
      id: 10,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 10',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      dateListened: '2 hours ago',
    },
    {
      id: 11,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 11',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      dateListened: '2 hours ago',
    },
    {
      id: 12,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 12',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      dateListened: '2 hours ago',
    },
    {
      id: 13,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 13',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      dateListened: '2 hours ago',
    },
    {
      id: 14,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 14',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      dateListened: '2 hours ago',
    },
    {
      id: 15,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 15',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      dateListened: '2 hours ago',
    },
    {
      id: 16,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 16',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      dateListened: '2 hours ago',
    },
    {
      id: 17,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 17',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      dateListened: '2 hours ago',
    },
    {
      id: 18,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 18',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      dateListened: '2 hours ago',
    },
    {
      id: 19,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 19',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      dateListened: '2 hours ago',
    },
    {
      id: 20,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 20',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      dateListened: '2 hours ago',
    },
    {
      id: 21,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 21',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      dateListened: '2 hours ago',
    },
    {
      id: 22,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 22',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      dateListened: '2 hours ago',
    },
    {
      id: 23,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 23',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      dateListened: '2 hours ago',
    },
    {
      id: 24,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 24',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      dateListened: '2 hours ago',
    },
    {
      id: 25,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 25',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      dateListened: '2 hours ago',
    },
  ];

  return (
    <main className="profile-content">
      <p className="profile-content-title">
        Recent tracks
      </p>
      <div className="profile-content-grid">
        <ProfileSongsCol songs={songs} />
        <ProfileSidebar />
      </div>
    </main>
  );
};

export default ProfileContent;