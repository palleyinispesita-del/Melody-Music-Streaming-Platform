import React from 'react';

import {
  FaSearch,
  FaBell,
  FaUserCircle
} from 'react-icons/fa';

function Navbar({ user, searchQuery, onSearchChange, onNavigate }) {

  return (
    <header className="top-navbar">

      <div className="search-box">
        <FaSearch />

        <input
          type="text"
          placeholder="Search songs, artists..."
          value={searchQuery}
          onFocus={() => onNavigate('search')}
          onChange={(e) => {
            onSearchChange(e.target.value);
            onNavigate('search');
          }}
        />
      </div>

      <div className="user-section">

        <FaBell className="nav-icon" />

        <FaUserCircle className="profile-icon" />

        <span>{user?.email || 'Guest User'}</span>

      </div>

    </header>
  );
}

export default Navbar;