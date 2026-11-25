import React, { useState } from 'react';

function YouTubeSearch() {

  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const searchYouTube = async (e) => {

    e.preventDefault();

    if (!query.trim()) return;

    if (!API_KEY) {
      setError('YouTube API key is missing. Check your .env.local file.');
      return;
    }

    setLoading(true);
    setError('');
    setVideos([]);
    setSelectedVideo(null);

    try {

      const url = new URL(
        'https://www.googleapis.com/youtube/v3/search'
      );

      url.search = new URLSearchParams({
        part: 'snippet',
        q: `${query} official music`,
        type: 'video',
        maxResults: '10',
        videoEmbeddable: 'true',
        regionCode: 'IN',
        key: API_KEY
      });

      const response = await fetch(url);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || 'YouTube search failed.'
        );
      }

      setVideos(data.items || []);

      if (!data.items?.length) {
        setError('No music videos found.');
      }

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="youtube-section">

      <h2>♫ Discover Music on YouTube</h2>

      <p className="page-subtitle">
        Search millions of music videos and discover new songs.
      </p>

      <form
        className="youtube-search-box"
        onSubmit={searchYouTube}
      >

        <input
          type="text"
          placeholder="Search your favourite song or artist..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>

      </form>

      {error && (
        <p className="youtube-error">{error}</p>
      )}

      {selectedVideo && (

        <div className="youtube-player-section">

          <h3>Now Playing</h3>

          <iframe
            className="youtube-player-frame"
            src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?playsinline=1&rel=0`}
            title={selectedVideo.snippet.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />

          <h4>{selectedVideo.snippet.title}</h4>

          <p>{selectedVideo.snippet.channelTitle}</p>

        </div>

      )}

      <div className="youtube-results">

        {videos.map((video) => (

          <div
            className="youtube-video-card"
            key={video.id.videoId}
            onClick={() => setSelectedVideo(video)}
          >

            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
            />

            <h5>{video.snippet.title}</h5>

            <p>{video.snippet.channelTitle}</p>

            <button type="button">
              ▶ Play
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default YouTubeSearch;