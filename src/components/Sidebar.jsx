import React from 'react';

import {
  FaHome,
  FaCompass,
  FaSearch,
  FaBook,
  FaHeart,
  FaPlus
} from 'react-icons/fa';

function Sidebar({ activeTab, onNavigate }) {

  const menuItems = [
    { id: 'home', label: 'Home', icon: <FaHome /> },
    { id: 'explore', label: 'Explore', icon: <FaCompass /> },
    { id: 'search', label: 'Search', icon: <FaSearch /> }
  ];

  const libraryItems = [
    { id: 'library', label: 'My Library', icon: <FaBook /> },
    { id: 'favorites', label: 'Favourites', icon: <FaHeart /> },
    { id: 'playlists', label: 'Create Playlist', icon: <FaPlus /> }
  ];

  return (
    <aside className="sidebar">

      <h2 className="logo">
        <span>♫</span> Melody
      </h2>

      <p className="menu-title">MENU</p>

      {menuItems.map((item) => (
        <button
          key={item.id}
          className={`menu-item ${
            activeTab === item.id ? 'active' : ''
          }`}
          onClick={() => onNavigate(item.id)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}

      <p className="menu-title library-title">YOUR LIBRARY</p>

      {libraryItems.map((item) => (
        <button
          key={item.id}
          className={`menu-item ${
            activeTab === item.id ? 'active' : ''
          }`}
          onClick={() => onNavigate(item.id)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}

    </aside>
  );
}

export default Sidebar;