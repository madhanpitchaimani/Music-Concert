// ✅ Updated Navbar.jsx with Edit Profile functionality
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ username: '', email: '' });

  const [artists, setArtists] = useState([
    { name: 'Anirudh', path: '/anirudh' },
    { name: 'Adhi', path: '/adhi' },
    { name: 'Yuvan', path: '/yuvan' },
  ]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('http://localhost:3000/concerts')
      .then(res => res.json())
      .then(data => {
        const dynamicArtists = data.map(item => ({
          name: item.name,
          path: item.route
        }));
        setArtists(prev => [...prev.slice(0, 3), ...dynamicArtists]);
      })
      .catch(err => console.error('Error loading dynamic artists:', err));
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value.toLowerCase();
    setQuery(input);
    const filtered = artists.filter((artist) =>
      artist.name.toLowerCase().startsWith(input)
    );
    setSuggestions(input ? filtered : []);
  };

  const handleSearch = () => {
    const match = artists.find((artist) =>
      artist.name.toLowerCase() === query.toLowerCase()
    );
    if (match) {
      navigate(match.path);
      setQuery('');
      setSuggestions([]);
    } else {
      alert('Artist not found');
    }
  };

  const handleSuggestionClick = (artist) => {
    navigate(artist.path);
    setQuery('');
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ username: user.username, email: user.email });
  };

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify({ ...user, ...editedUser }));
    setIsEditing(false);
    window.location.reload();
  };

  return (
    <>
      <div className="navbar">
       <div className="logo">🎸 Vibe Vault</div>

        <div className="nav-links">
          <Link to="/" className="nav-item">Home</Link>
          <button
            className="nav-item"
            onClick={() => {
              if (user) navigate('/user-dashboard');
              else navigate('/login');
            }}
          >
            Browse Concerts
          </button>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search artist..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button className="search-btn" onClick={handleSearch}>Go</button>
          {suggestions.length > 0 && (
            <ul className="suggestion-box">
              {suggestions.map((artist, i) => (
                <li key={i} onClick={() => handleSuggestionClick(artist)}>
                  {artist.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="user-controls">
          <FaUser className="user-icon" />
          {user ? (
            <>
              <button className="account-btn" onClick={() => setShowModal(true)}>
                {user.username}
              </button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login"><button className="login-btn">Sign In / Register</button></Link>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="close-x" onClick={() => setShowModal(false)}>×</button>
            <h2 className="modal-title">👤 Account Details</h2>
            <div className="modal-info">
              {isEditing ? (
                <>
                  <p><strong>Username:</strong> <input value={editedUser.username} onChange={e => setEditedUser({ ...editedUser, username: e.target.value })} /></p>
                  <p><strong>Email:</strong> <input value={editedUser.email} onChange={e => setEditedUser({ ...editedUser, email: e.target.value })} /></p>
                </>
              ) : (
                <>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                 
                </>
              )}
            </div>
            {isEditing ? (
              <button className="edit-btn" onClick={handleSave}>Save</button>
            ) : (
              <button className="edit-btn" onClick={handleEdit}>Edit Profile</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;