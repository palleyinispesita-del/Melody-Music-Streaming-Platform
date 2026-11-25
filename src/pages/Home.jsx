import React from 'react';

import SongCard from '../components/SongCard';
import YouTubeSearch from '../components/YouTubeSearch';

function Home({
  songs,
  favorites,
  onPlaySong,
  onToggleFavorite,
  onNavigate,
  onPlayYouTube
}) {

  return (
    <div className="home-content">

      <section className="welcome-section">

        <p>WELCOME TO MELODY</p>

        <h1>Feel the Music.</h1>
        <h1>Live the Moment.</h1>

        <p>
          Discover your favourite music and explore new sounds.
        </p>

        <button
          className="explore-btn"
          onClick={() => onNavigate('explore')}
        >
          Explore Music
        </button>

      </section>

      {/* YOUTUBE MUSIC */}

      <YouTubeSearch
        onPlayYouTube={onPlayYouTube}
      />

      {/* TRENDING SONGS */}

      <section className="songs-section">

        <div className="section-heading">
          <h2>Trending Songs</h2>

          <button onClick={() => onNavigate('explore')}>
            See All
          </button>
        </div>

        <div className="songs-grid">

          {songs.slice(0, 5).map((song) => (

            <SongCard
              key={song.id}
              song={song}
              onPlay={onPlaySong}
              isFavorite={favorites.includes(song.id)}
              onToggleFavorite={onToggleFavorite}
            />

          ))}

        </div>

      </section>

      {/* POPULAR SONGS */}

      <section className="songs-section">

        <div className="section-heading">
          <h2>Popular Songs</h2>
        </div>

        <div className="songs-grid">

          {songs.slice(5).map((song) => (

            <SongCard
              key={song.id}
              song={song}
              onPlay={onPlaySong}
              isFavorite={favorites.includes(song.id)}
              onToggleFavorite={onToggleFavorite}
            />

          ))}

        </div>

      </section>

    </div>
  );
}

export default Home;