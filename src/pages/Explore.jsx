import React, { useState } from 'react';
import SongCard from '../components/SongCard';

function Explore({
  songs,
  favorites,
  onPlaySong,
  onToggleFavorite
}) {

  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = [
    'All',
    ...new Set(songs.map((song) => song.genre))
  ];

  const filteredSongs = songs.filter((song) => {

    return (
      selectedGenre === 'All' ||
      song.genre === selectedGenre
    );

  });

  return (

    <div className="page-section">

      <h1>Explore Music</h1>

      <p className="page-subtitle">
        Discover music from different genres and artists.
      </p>

      <div className="genre-list">

        {genres.map((genre) => (

          <button
            key={genre}
            className={
              selectedGenre === genre ? 'genre-active' : ''
            }
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>

        ))}

      </div>

      <h2 className="content-heading">
        {selectedGenre === 'All'
          ? 'All Music'
          : selectedGenre + ' Music'}
      </h2>

      <div className="songs-grid">

        {filteredSongs.map((song) => (

          <SongCard
            key={song.id}
            song={song}
            onPlay={onPlaySong}
            isFavorite={favorites.includes(song.id)}
            onToggleFavorite={onToggleFavorite}
          />

        ))}

      </div>

      {filteredSongs.length === 0 && (
        <p>No songs found in this genre.</p>
      )}

    </div>

  );

}

export default Explore;