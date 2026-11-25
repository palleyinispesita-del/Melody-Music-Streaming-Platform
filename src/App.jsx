import React, { useState } from 'react';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Search from './pages/Search';
import Library from './pages/Library';
import Favorites from './pages/Favorites';
import Playlists from './pages/Playlists';
import Login from './pages/Login';

// Music Data
import songs from './data/songs';


// ==========================================
// LOCAL STORAGE HELPER
// ==========================================

function getStoredData(key, fallback) {

  try {

    const saved = localStorage.getItem(key);

    return saved ? JSON.parse(saved) : fallback;

  } catch (error) {

    console.error(`Error reading ${key}:`, error);

    return fallback;

  }

}


// ==========================================
// MAIN APPLICATION
// ==========================================

function App() {


  // ========================================
  // LOGIN STATE
  // ========================================

  const [user, setUser] = useState(() => {

    const savedUser = getStoredData('melodyUser', null);

    if (
      savedUser &&
      typeof savedUser.email === 'string' &&
      ['admin', 'user'].includes(savedUser.role)
    ) {

      return savedUser;

    }

    localStorage.removeItem('melodyUser');

    return null;

  });


  // ========================================
  // NAVIGATION STATE
  // ========================================

  const [activeTab, setActiveTab] = useState('home');


  // ========================================
  // SEARCH STATE
  // ========================================

  const [searchQuery, setSearchQuery] = useState('');


  // ========================================
  // FAVOURITES STATE
  // ========================================

  const [favorites, setFavorites] = useState(() => {

    const saved = getStoredData('melodyFavorites', []);

    return Array.isArray(saved) ? saved : [];

  });


  // ========================================
  // PLAYLIST STATE
  // ========================================

  const [playlists, setPlaylists] = useState(() => {

    const saved = getStoredData('melodyPlaylists', []);

    return Array.isArray(saved) ? saved : [];

  });


  // ========================================
  // MUSIC PLAYER STATE
  // ========================================

  const [currentSong, setCurrentSong] = useState(null);

  const [youtubeVideo, setYoutubeVideo] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);


  // ========================================
  // LOGIN FUNCTION
  // ========================================

  const handleLogin = (userData) => {

    localStorage.setItem(
      'melodyUser',
      JSON.stringify(userData)
    );

    setUser(userData);

    setActiveTab('home');

  };


  // ========================================
  // LOGOUT FUNCTION
  // ========================================

  const handleLogout = () => {

    localStorage.removeItem('melodyUser');

    setUser(null);

    setCurrentSong(null);

    setYoutubeVideo(null);

    setIsPlaying(false);

    setActiveTab('home');

    setSearchQuery('');

  };


  // ========================================
  // SAVE FAVOURITES
  // ========================================

  React.useEffect(() => {

    localStorage.setItem(
      'melodyFavorites',
      JSON.stringify(favorites)
    );

  }, [favorites]);


  // ========================================
  // SAVE PLAYLISTS
  // ========================================

  React.useEffect(() => {

    localStorage.setItem(
      'melodyPlaylists',
      JSON.stringify(playlists)
    );

  }, [playlists]);


  // ========================================
  // LOCAL MUSIC PLAYBACK
  // ========================================

  const handlePlaySong = (song) => {

    // Stop YouTube playback
    setYoutubeVideo(null);

    // Play or pause the selected local song
    if (currentSong?.id === song.id) {

      setIsPlaying((previous) => !previous);

    } else {

      setCurrentSong(song);

      setIsPlaying(true);

    }

  };


  // ========================================
  // YOUTUBE MUSIC PLAYBACK
  // ========================================

  const handlePlayYouTube = (video) => {

    // Stop local MP3 playback
    setCurrentSong(null);

    // Select YouTube video
    setYoutubeVideo(video);

    // Start playback
    setIsPlaying(true);

  };


  // ========================================
  // NEXT LOCAL SONG
  // ========================================

  const handleNextSong = () => {

    if (!currentSong) return;

    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % songs.length;

    setCurrentSong(songs[nextIndex]);

    setIsPlaying(true);

  };


  // ========================================
  // PREVIOUS LOCAL SONG
  // ========================================

  const handlePreviousSong = () => {

    if (!currentSong) return;

    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    if (currentIndex === -1) return;

    const previousIndex =
      (currentIndex - 1 + songs.length) % songs.length;

    setCurrentSong(songs[previousIndex]);

    setIsPlaying(true);

  };


  // ========================================
  // TOGGLE FAVOURITES
  // ========================================

  const handleToggleFavorite = (songId) => {

    setFavorites((previous) => {

      if (previous.includes(songId)) {

        return previous.filter(
          (id) => id !== songId
        );

      }

      return [...previous, songId];

    });

  };


  // ========================================
  // CREATE PLAYLIST
  // ========================================

  const handleCreatePlaylist = (name) => {

    const newPlaylist = {

      id: Date.now(),

      name: name,

      songIds: []

    };

    setPlaylists((previous) => [

      ...previous,

      newPlaylist

    ]);

    return newPlaylist.id;

  };


  // ========================================
  // ADD SONG TO PLAYLIST
  // ========================================

  const handleAddSong = (playlistId, songId) => {

    setPlaylists((previous) =>

      previous.map((playlist) => {

        if (playlist.id === playlistId) {

          if (playlist.songIds.includes(songId)) {

            return playlist;

          }

          return {

            ...playlist,

            songIds: [

              ...playlist.songIds,

              songId

            ]

          };

        }

        return playlist;

      })

    );

  };


  // ========================================
  // REMOVE SONG FROM PLAYLIST
  // ========================================

  const handleRemoveSong = (playlistId, songId) => {

    setPlaylists((previous) =>

      previous.map((playlist) => {

        if (playlist.id === playlistId) {

          return {

            ...playlist,

            songIds: playlist.songIds.filter(

              (id) => id !== songId

            )

          };

        }

        return playlist;

      })

    );

  };


  // ========================================
  // LOGIN PAGE
  // ========================================

  if (!user) {

    return (

      <Login

        onLogin={handleLogin}

      />

    );

  }


  // ========================================
  // ADMIN DASHBOARD
  // ========================================

  if (user.role === 'admin') {

    return (

      <div className="admin-dashboard">

        <h1>♫ Melody Admin</h1>

        <h2>Welcome, Administrator!</h2>

        <p>{user.email}</p>

        <p>
          You have successfully logged in as Admin.
        </p>

        <button onClick={handleLogout}>

          Logout

        </button>

      </div>

    );

  }


  // ========================================
  // COMMON PROPS
  // ========================================

  const commonProps = {

    songs,

    favorites,

    onPlaySong: handlePlaySong,

    onToggleFavorite: handleToggleFavorite,

    onPlayYouTube: handlePlayYouTube

  };


  // ========================================
  // PAGE NAVIGATION
  // ========================================

  const renderPage = () => {

    switch (activeTab) {


      // HOME PAGE

      case 'home':

        return (

          <Home

            {...commonProps}

            onNavigate={setActiveTab}

          />

        );


      // EXPLORE PAGE

      case 'explore':

        return (

          <Explore

            {...commonProps}

          />

        );


      // SEARCH PAGE

      case 'search':

        return (

          <Search

            {...commonProps}

            searchQuery={searchQuery}

            onSearchChange={setSearchQuery}

          />

        );


      // MY LIBRARY

      case 'library':

        return (

          <Library

            {...commonProps}

          />

        );


      // FAVOURITES

      case 'favorites':

        return (

          <Favorites

            {...commonProps}

          />

        );


      // PLAYLISTS

      case 'playlists':

        return (

          <Playlists

            {...commonProps}

            playlists={playlists}

            onCreatePlaylist={handleCreatePlaylist}

            onAddSong={handleAddSong}

            onRemoveSong={handleRemoveSong}

          />

        );


      default:

        return (

          <Home

            {...commonProps}

            onNavigate={setActiveTab}

          />

        );

    }

  };


  // ========================================
  // USER APPLICATION
  // ========================================

  return (

    <div

      className={`app-container ${
        youtubeVideo ? 'youtube-playing' : ''
      }`}

    >

      {/* SIDEBAR */}

      <Sidebar

        activeTab={activeTab}

        onNavigate={setActiveTab}

      />


      {/* MAIN CONTENT */}

      <div className="main-container">


        {/* NAVBAR */}

        <Navbar

          user={user}

          searchQuery={searchQuery}

          onSearchChange={setSearchQuery}

          onNavigate={setActiveTab}

        />


        {/* USER SESSION */}

        <div className="session-bar">

          <span>

            Welcome, {user.email}!

          </span>

          <button onClick={handleLogout}>

            Logout

          </button>

        </div>


        {/* CURRENT PAGE */}

        <main className="page-content">

          {renderPage()}

        </main>


      </div>


      {/* BOTTOM MUSIC PLAYER */}

      <MusicPlayer

        song={currentSong}

        youtubeVideo={youtubeVideo}

        isPlaying={isPlaying}

        setIsPlaying={setIsPlaying}

        onNext={handleNextSong}

        onPrevious={handlePreviousSong}

      />


    </div>

  );

}

export default App;