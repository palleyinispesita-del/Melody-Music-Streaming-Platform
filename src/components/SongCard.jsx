import React from 'react';

import {
  FaPlay,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';

function SongCard({
  song,
  onPlay,
  isFavorite,
  onToggleFavorite
}) {

  return (

    <div className="song-card">

      <div className="song-image">

        <img
          src={song.image}
          alt={song.title}
        />

        <button
          className="play-button"
          onClick={() => onPlay(song)}
          title="Play song"
        >
          <FaPlay />
        </button>

        <button
          className={`favorite-button ${
            isFavorite ? 'favorited' : ''
          }`}
          onClick={() => onToggleFavorite(song.id)}
          title="Add to favourites"
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>

      </div>

      <h5>{song.title}</h5>

      <p>{song.artist}</p>

      <small>{song.album}</small>

    </div>

  );
}

export default SongCard;