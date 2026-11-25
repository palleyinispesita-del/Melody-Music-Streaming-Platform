import React from 'react';
import SongCard from '../components/SongCard';

function Library({
  songs,
  favorites,
  onPlaySong,
  onToggleFavorite
}) {

  return (

    <div className="page-section">

      <h1>My Library</h1>

      <p className="page-subtitle">
        Your complete music collection.
      </p>

      <div className="library-stats">

        <div className="stat-card">
          <h2>{songs.length}</h2>
          <p>Total Songs</p>
        </div>

        <div className="stat-card">
          <h2>{favorites.length}</h2>
          <p>Favourite Songs</p>
        </div>

      </div>

      <h2 className="content-heading">
        All Songs
      </h2>

      <div className="songs-grid">

        {songs.map((song) => (

          <SongCard
            key={song.id}
            song={song}
            onPlay={onPlaySong}
            isFavorite={favorites.includes(song.id)}
            onToggleFavorite={onToggleFavorite}
          />

        ))}

      </div>

    </div>

  );

}

export default Library;