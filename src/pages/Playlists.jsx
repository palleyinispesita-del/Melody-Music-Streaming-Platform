import React, { useState } from 'react';
import SongCard from '../components/SongCard';

function Playlists({
  playlists,
  songs,
  favorites,
  onCreatePlaylist,
  onAddSong,
  onRemoveSong,
  onPlaySong,
  onToggleFavorite
}) {

  const [playlistName, setPlaylistName] = useState('');

  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const selectedPlaylist = playlists.find(
    (playlist) => playlist.id === selectedPlaylistId
  );

  const playlistSongs = selectedPlaylist
    ? songs.filter((song) =>
        selectedPlaylist.songIds.includes(song.id)
      )
    : [];

  const availableSongs = selectedPlaylist
    ? songs.filter((song) =>
        !selectedPlaylist.songIds.includes(song.id)
      )
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!playlistName.trim()) {
      return;
    }

    const newId = onCreatePlaylist(playlistName.trim());

    setSelectedPlaylistId(newId);
    setPlaylistName('');
  };

  return (

    <div className="page-section">

      <h1>My Playlists</h1>

      <p className="page-subtitle">
        Create your own music collections.
      </p>

      <form
        className="playlist-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          placeholder="Enter playlist name..."
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          maxLength={40}
          required
        />

        <button type="submit">
          + Create Playlist
        </button>

      </form>

      <h2 className="content-heading">
        Your Playlists
      </h2>

      {playlists.length === 0 ? (

        <div className="empty-state">
          <h3>No Playlists Created</h3>
          <p>Create your first playlist above.</p>
        </div>

      ) : (

        <div className="playlist-list">

          {playlists.map((playlist) => (

            <button
              key={playlist.id}
              className={`playlist-item ${
                selectedPlaylistId === playlist.id
                  ? 'selected-playlist'
                  : ''
              }`}
              onClick={() => setSelectedPlaylistId(playlist.id)}
            >

              <span>♫ {playlist.name}</span>

              <small>
                {playlist.songIds.length} songs
              </small>

            </button>

          ))}

        </div>

      )}

      {selectedPlaylist && (

        <>

          <h2 className="content-heading">
            {selectedPlaylist.name}
          </h2>

          <h3 className="sub-heading">
            Songs in this Playlist
          </h3>

          {playlistSongs.length > 0 ? (

            <div className="songs-grid">

              {playlistSongs.map((song) => (

                <div key={song.id}>

                  <SongCard
                    song={song}
                    onPlay={onPlaySong}
                    isFavorite={favorites.includes(song.id)}
                    onToggleFavorite={onToggleFavorite}
                  />

                  <button
                    className="remove-song-btn"
                    onClick={() =>
                      onRemoveSong(selectedPlaylist.id, song.id)
                    }
                  >
                    Remove from Playlist
                  </button>

                </div>

              ))}

            </div>

          ) : (

            <p className="empty-state">
              This playlist is empty. Add some songs below!
            </p>

          )}

          <h3 className="sub-heading">
            Add Songs
          </h3>

          <div className="songs-grid">

            {availableSongs.map((song) => (

              <div key={song.id}>

                <SongCard
                  song={song}
                  onPlay={onPlaySong}
                  isFavorite={favorites.includes(song.id)}
                  onToggleFavorite={onToggleFavorite}
                />

                <button
                  className="add-song-btn"
                  onClick={() =>
                    onAddSong(selectedPlaylist.id, song.id)
                  }
                >
                  + Add to Playlist
                </button>

              </div>

            ))}

          </div>

        </>

      )}

    </div>

  );

}

export default Playlists;