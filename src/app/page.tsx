'use client';

import { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [songs, setSongs] = useState<{ id: number; title: string; album: string; artist: string; genre: string }[]>([]);

  useEffect(() => {
    fetch('/api/songs')
      .then((response) => response.json())
      .then((data) => setSongs(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1 className="p-8">J Dilla - Donuts (Tracklist)</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <strong>{song.title}</strong> | <em>{song.album}</em> | <em>{song.artist}</em> | {song.genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
