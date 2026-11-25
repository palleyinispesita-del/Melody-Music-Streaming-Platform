import React, { useEffect, useState } from 'react';

const DEFAULT_QUERY = 'trending music India official video';
const CACHE_TIME = 30 * 60 * 1000;

function YouTubeSearch() {

  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const fetchMusic = async (searchTerm) => {

    if (!API_KEY) {
      setError('YouTube API key is missing. Check .env.local');
      return;
    }

    setLoading(true);
    setError('');

    try {

      // Reuse recent results to reduce API requests
      const cacheKey = `melodyYT_${searchTerm}`;

      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {

        const parsed = JSON.parse(cached);

        if (Date.now() - parsed.timestamp < CACHE_TIME) {
          setVideos(parsed.items);
          setLoading(false);
          return;
        }

      }

      const url = new URL(
        'https://www.googleapis.com/youtube/v3/search'
      );

      url.search = new URLSearchParams({
        part: 'snippet',
        q: searchTerm,
        type: 'video',
        maxResults: '8',
        order: 'viewCount',
        videoEmbeddable: 'true',
        regionCode: 'IN',
        key: API_KEY
      });

      const response = await fetch(url);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || 'Unable to fetch music.'
        );
      }

      const results = data.items || [];

      setVideos(results);

      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({
          timestamp: Date.now(),
          items: results
        })
      );

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };

  // Automatically fetch music when Home loads
  useEffect(() => {

    fetchMusic(DEFAULT_QUERY);

  }, []);

  // Search music manually
  const handleSearch = (e) => {

    e.preventDefault();

    if (!query.trim()) return;

    setSelectedVideo(null);
    fetchMusic(`${query.trim()} official music video`);

  };

  return (

    <section className="youtube-home-section">

      <div className="youtube-home-heading">

        <div>
          <h2>♫ Discover Music</h2>

          <p>
            Explore popular music from YouTube.
          </p>
        </div>

      </div>

      {/* SEARCH BAR */}

      <form
        className="youtube-search-box"
        onSubmit={handleSearch}
      >

        <input
          type="text"
          placeholder="Search songs, artists and music..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          Search
        </button>

      </form>

      {loading && (
        <p className="youtube-status">
          Discovering music for you...
        </p>
      )}

      {error && (
        <p className="youtube-error">{error}</p>
      )}

      {/* YOUTUBE PLAYER */}

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

      {/* YOUTUBE MUSIC CARDS */}

      <div className="youtube-results">

        {videos.map((video) => (

          <div
            className="youtube-video-card"
            key={video.id.videoId}
          >

            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
            />

            <h5>{video.snippet.title}</h5>

            <p>{video.snippet.channelTitle}</p>

            <button
              type="button"
              onClick={() => setSelectedVideo(video)}
            >
              ▶ Play Music
            </button>

          </div>

        ))}

      </div>

    </section>

  );

}

export default YouTubeSearch;