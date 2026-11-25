import React from 'react';
import SongCard from '../components/SongCard';

function Favorites({
  songs,
  favorites,
  onPlaySong,
  onToggleFavorite
}) {

  const favoriteSongs = songs.filter((song) =>
    favorites.includes(song.id)
  );

  return (

    <div className="page-section">

      <h1>❤️ Your Favourites</h1>

      <p className="page-subtitle">
        All the songs you love in one place.
      </p>

      {favoriteSongs.length > 0 ? (

        <div className="songs-grid">

          {favoriteSongs.map((song) => (

            <SongCard
              key={song.id}
              song={song}
              onPlay={onPlaySong}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />

          ))}

        </div>

      ) : (

        <div className="empty-state">

          <h2>No Favourite Songs Yet</h2>

          <p>
            Click the heart icon on any song to add it here.
          </p>

        </div>

      )}

    </div>

  );

}

export default Favorites;
