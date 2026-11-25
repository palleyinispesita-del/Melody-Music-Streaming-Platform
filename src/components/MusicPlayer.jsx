import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
  FaHeadphones
} from 'react-icons/fa';


// ==========================================
// YOUTUBE IFRAME API LOADER
// ==========================================

let youtubeApiPromise = null;

function loadYouTubeAPI() {

  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve, reject) => {

    const previousCallback =
      window.onYouTubeIframeAPIReady;

    const timeout = setTimeout(() => {
      youtubeApiPromise = null;
      reject(new Error('YouTube player loading timed out.'));
    }, 15000);

    window.onYouTubeIframeAPIReady = () => {

      if (typeof previousCallback === 'function') {
        previousCallback();
      }

      clearTimeout(timeout);

      if (window.YT && window.YT.Player) {
        resolve(window.YT);
      } else {
        youtubeApiPromise = null;
        reject(new Error('YouTube Player API is unavailable.'));
      }

    };

    let script = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    if (!script) {

      script = document.createElement('script');

      script.src = 'https://www.youtube.com/iframe_api';

      script.async = true;

      script.onerror = () => {
        clearTimeout(timeout);
        youtubeApiPromise = null;
        reject(new Error('Unable to load YouTube API.'));
      };

      document.head.appendChild(script);

    }

  });

  return youtubeApiPromise;

}


// ==========================================
// MAIN MUSIC PLAYER
// ==========================================

function MusicPlayer({
  song,
  youtubeVideo,
  isPlaying,
  setIsPlaying,
  onNext,
  onPrevious
}) {

  // Audio reference
  const audioRef = useRef(null);

  // YouTube player references
  const youtubePlayerRef = useRef(null);

  const youtubeContainerRef = useRef(null);

  const youtubeReadyRef = useRef(false);

  const videoIdRef = useRef(null);

  const isPlayingRef = useRef(isPlaying);

  const volumeRef = useRef(70);


  // Player states
  const [youtubeReady, setYoutubeReady] = useState(false);

  const [youtubeError, setYoutubeError] = useState('');

  const [localError, setLocalError] = useState('');

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(70);


  const videoId = youtubeVideo?.id?.videoId || null;

  // Keep refs synchronized with React state
  isPlayingRef.current = isPlaying;

  volumeRef.current = volume;


  // ========================================
  // FORMAT SONG TIME
  // ========================================

  const formatTime = (time) => {

    if (!Number.isFinite(time)) {
      return '0:00';
    }

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');

    return `${minutes}:${seconds}`;

  };


  // ========================================
  // LOAD AND CONTROL YOUTUBE PLAYER
  // ========================================

  useEffect(() => {

    videoIdRef.current = videoId;

    if (!videoId) {

      youtubeReadyRef.current = false;

      setYoutubeReady(false);

      setYoutubeError('');

      setCurrentTime(0);

      setDuration(0);

      if (youtubePlayerRef.current) {

        try {
          youtubePlayerRef.current.destroy();
        } catch (error) {
          console.warn('YouTube player cleanup:', error);
        }

        youtubePlayerRef.current = null;

      }

      return;

    }


    let cancelled = false;

    setYoutubeReady(false);

    youtubeReadyRef.current = false;

    setYoutubeError('');

    setCurrentTime(0);

    setDuration(0);


    const initializePlayer = async () => {

      try {

        const YT = await loadYouTubeAPI();

        if (cancelled) return;


        // If player already exists, load the new song

        if (youtubePlayerRef.current) {

          if (youtubeReadyRef.current) {

            if (isPlayingRef.current) {

              youtubePlayerRef.current.loadVideoById(videoId);

            } else {

              youtubePlayerRef.current.cueVideoById(videoId);

            }

          }

          return;

        }


        if (!youtubeContainerRef.current) {
          return;
        }


        // Create YouTube player

        youtubePlayerRef.current = new YT.Player(
          youtubeContainerRef.current,
          {

            width: 320,

            height: 200,

            videoId: videoId,

            playerVars: {

              autoplay: 0,

              controls: 1,

              playsinline: 1,

              rel: 0,

              origin: window.location.origin

            },


            events: {

              // PLAYER READY

              onReady: (event) => {

                if (cancelled) return;

                youtubeReadyRef.current = true;

                setYoutubeReady(true);

                event.target.setVolume(volumeRef.current);


                // Play or cue the latest selected video

                const latestVideoId = videoIdRef.current;

                if (latestVideoId) {

                  const loadedVideoId =
                    event.target.getVideoData()?.video_id;

                  if (loadedVideoId !== latestVideoId) {

                    if (isPlayingRef.current) {

                      event.target.loadVideoById(latestVideoId);

                    } else {

                      event.target.cueVideoById(latestVideoId);

                    }

                  } else if (isPlayingRef.current) {

                    event.target.playVideo();

                  }

                }

              },


              // PLAYER STATE CHANGE

              onStateChange: (event) => {

                const playerState = event.data;

                if (playerState === YT.PlayerState.PLAYING) {

                  setIsPlaying(true);

                }

                else if (
                  playerState === YT.PlayerState.PAUSED
                ) {

                  setIsPlaying(false);

                }

                else if (
                  playerState === YT.PlayerState.ENDED
                ) {

                  setIsPlaying(false);

                }

                if (
                  playerState === YT.PlayerState.PAUSED ||
                  playerState === YT.PlayerState.ENDED
                ) {

                  setCurrentTime(
                    event.target.getCurrentTime() || 0
                  );

                  setDuration(
                    event.target.getDuration() || 0
                  );

                }

              },


              // PLAYER ERROR

              onError: (event) => {

                const errorMessages = {

                  2: 'Invalid YouTube video ID.',

                  5: 'This video cannot be played in the HTML5 player.',

                  100: 'This video was removed or is private.',

                  101: 'The video owner does not allow embedded playback.',

                  150: 'The video owner does not allow embedded playback.',

                  153: 'YouTube could not verify the player origin.'

                };

                setYoutubeError(
                  errorMessages[event.data] ||
                  'Unable to play this YouTube video.'
                );

                setIsPlaying(false);

              },


              // AUTOPLAY BLOCKED

              onAutoplayBlocked: () => {

                setIsPlaying(false);

                setYoutubeError(
                  'Playback was blocked. Press the Play button.'
                );

              }

            }

          }

        );

      } catch (error) {

        setYoutubeError(error.message);

      }

    };


    initializePlayer();


    return () => {

      cancelled = true;

    };

  }, [videoId]);


  // ========================================
  // PLAY / PAUSE YOUTUBE
  // ========================================

  useEffect(() => {

    const player = youtubePlayerRef.current;

    if (!player || !youtubeReady || !videoId) {
      return;
    }

    try {

      if (isPlaying) {

        player.playVideo();

      } else {

        player.pauseVideo();

      }

    } catch (error) {

      console.error('YouTube playback error:', error);

    }

  }, [isPlaying, youtubeReady, videoId]);


  // ========================================
  // YOUTUBE PROGRESS TRACKER
  // ========================================

  useEffect(() => {

    if (!videoId || !youtubeReady) {
      return;
    }

    const timer = setInterval(() => {

      const player = youtubePlayerRef.current;

      if (player) {

        try {

          setCurrentTime(
            player.getCurrentTime() || 0
          );

          setDuration(
            player.getDuration() || 0
          );

        } catch (error) {

          // Player may be buffering

        }

      }

    }, 500);


    return () => {
      clearInterval(timer);
    };

  }, [videoId, youtubeReady]);


  // ========================================
  // VOLUME CONTROL
  // ========================================

  useEffect(() => {

    if (audioRef.current) {

      audioRef.current.volume = volume / 100;

    }

    if (
      youtubePlayerRef.current &&
      youtubeReady
    ) {

      youtubePlayerRef.current.setVolume(volume);

    }

  }, [volume, youtubeReady]);


  // ========================================
  // LOCAL MP3 LOAD
  // ========================================

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio) return;

    if (videoId || !song?.audio) {

      audio.pause();

      return;

    }

    setCurrentTime(0);

    setDuration(0);

    setLocalError('');

    audio.load();

  }, [song?.id, song?.audio, videoId]);


  // ========================================
  // LOCAL MP3 PLAY / PAUSE
  // ========================================

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio) return;

    if (videoId || !song?.audio) {

      audio.pause();

      return;

    }

    if (isPlaying) {

      audio.play().catch(() => {

        setIsPlaying(false);

        setLocalError(
          'Unable to play this audio file.'
        );

      });

    } else {

      audio.pause();

    }

  }, [isPlaying, song?.id, song?.audio, videoId]);


  // ========================================
  // LOCAL MUSIC SEEK
  // ========================================

  const handleLocalSeek = (e) => {

    const time = Number(e.target.value);

    if (audioRef.current) {

      audioRef.current.currentTime = time;

      setCurrentTime(time);

    }

  };


  // ========================================
  // YOUTUBE SEEK
  // ========================================

  const handleYouTubeSeek = (e) => {

    const time = Number(e.target.value);

    if (youtubePlayerRef.current && youtubeReady) {

      youtubePlayerRef.current.seekTo(time, true);

      setCurrentTime(time);

    }

  };


  // ========================================
  // PLAY / PAUSE BUTTON
  // ========================================

  const handlePlayPause = () => {

    if (videoId) {

      if (!youtubeReady) return;

      if (isPlaying) {

        youtubePlayerRef.current?.pauseVideo();

      } else {

        youtubePlayerRef.current?.playVideo();

      }

      return;

    }

    if (!song?.audio) {

      setLocalError('Please select a song with an audio file.');

      return;

    }

    setIsPlaying((previous) => !previous);

  };


  // ========================================
  // VOLUME CHANGE
  // ========================================

  const handleVolumeChange = (e) => {

    setVolume(Number(e.target.value));

  };


  // ========================================
  // YOUTUBE MUSIC PLAYER
  // ========================================

  if (videoId) {

    return (

      <div className="music-player youtube-active">

        {/* YOUTUBE VIDEO */}

        <div className="youtube-embed-wrap">

          <div
            ref={youtubeContainerRef}
            className="youtube-player-mount"
          />

        </div>


        {/* SONG INFORMATION */}

        <div className="youtube-track-details">

          <span className="youtube-playing-label">
            NOW PLAYING ON YOUTUBE
          </span>

          <h5>
            {youtubeVideo.snippet.title}
          </h5>

          <p>
            {youtubeVideo.snippet.channelTitle}
          </p>

          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch on YouTube
          </a>

          {youtubeError && (

            <p className="youtube-error">
              {youtubeError}
            </p>

          )}

        </div>


        {/* YOUTUBE CONTROLS */}

        <div className="youtube-custom-controls">

          <div className="youtube-control-buttons">

            <button
              onClick={handlePlayPause}
              disabled={!youtubeReady}
              title={isPlaying ? 'Pause' : 'Play'}
            >

              {isPlaying ? <FaPause /> : <FaPlay />}

            </button>

          </div>


          {/* PROGRESS BAR */}

          <div className="youtube-progress">

            <span>
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={Math.min(
                currentTime,
                duration || 0
              )}
              onChange={handleYouTubeSeek}
              disabled={!duration || !youtubeReady}
            />

            <span>
              {formatTime(duration)}
            </span>

          </div>


          {/* VOLUME */}

          <div className="youtube-volume">

            <FaVolumeUp />

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />

          </div>

        </div>

      </div>

    );

  }


  // ========================================
  // NORMAL LOCAL MUSIC PLAYER
  // ========================================

  return (

    <div className="music-player">

      {/* HIDDEN HTML AUDIO ELEMENT */}

      <audio
        ref={audioRef}
        src={song?.audio || undefined}
        onTimeUpdate={(e) => {

          setCurrentTime(
            e.currentTarget.currentTime
          );

        }}
        onLoadedMetadata={(e) => {

          setDuration(
            e.currentTarget.duration
          );

        }}
        onEnded={() => {

          if (onNext) {
            onNext();
          }

        }}
        onError={() => {

          if (song?.audio) {

            setLocalError(
              'Audio file not found. Check your music folder.'
            );

          }

        }}
      />


      {/* CURRENT SONG */}

      <div className="current-song">

        {song ? (

          <img
            src={song.image}
            alt={song.title}
          />

        ) : (

          <div className="player-placeholder">
            <FaHeadphones />
          </div>

        )}

        <div className="current-song-info">

          <h6>
            {song?.title || 'Choose a song'}
          </h6>

          <p>
            {song?.artist || 'Melody Player'}
          </p>

          {localError && (
            <small className="playback-message">
              {localError}
            </small>
          )}

        </div>

      </div>


      {/* PLAYER CONTROLS */}

      <div className="player-controls">

        <div className="control-buttons">

          <button
            onClick={onPrevious}
            disabled={!song}
            title="Previous song"
          >
            <FaStepBackward />
          </button>

          <button
            className="main-play"
            onClick={handlePlayPause}
            disabled={!song}
            title={isPlaying ? 'Pause' : 'Play'}
          >

            {isPlaying ? <FaPause /> : <FaPlay />}

          </button>

          <button
            onClick={onNext}
            disabled={!song}
            title="Next song"
          >
            <FaStepForward />
          </button>

        </div>


        {/* LOCAL PROGRESS */}

        <div className="progress-container">

          <span>
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={Math.min(
              currentTime,
              duration || 0
            )}
            onChange={handleLocalSeek}
            disabled={!duration}
            className="music-progress"
          />

          <span>
            {formatTime(duration)}
          </span>

        </div>

      </div>


      {/* LOCAL VOLUME */}

      <div className="volume-control">

        <FaVolumeUp />

        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
        />

      </div>

    </div>

  );

}


// ==========================================
// EXPORT
// ==========================================

export default MusicPlayer;