// ✅ Updated Navbar.jsx with Edit Profile functionality    
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ Required for axios.put
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
    fetch('http://localhost:5000/api/concerts')
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

  const handleSave = async () => {
    try {
      const updatePayload = {
        username: editedUser.username,
        email: editedUser.email,
      };

      if (editedUser.password) {
        updatePayload.password = editedUser.password;
      }

      const res = await axios.put(`http://localhost:5000/api/auth/${user._id}`, updatePayload);

      if (res.status === 200) {
        const updatedUser = res.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        setShowModal(false);
        window.location.reload();
      }
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    }
  };


  return (
    <>
      <div className="navbar">
        <div className="logo">🎸  Vibe Vault</div>
            <div className="nav-top-row">
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
  <div className="search-bar-container">
       <div className="search-wrapper">
    <input
      type="text"
      className="search-input"
      placeholder="Search artist..."
      value={query}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
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
  <button className="search-btn" onClick={handleSearch}>Go</button>
</div>

      </div>
  
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="close-x" onClick={() => setShowModal(false)}>×</button>
            <h2 className="modal-title">👤 Account Details</h2>
            <div className="modal-info">
     {isEditing ? (
  <div className="modal-form">
    <label>
      <span>Username:</span>
      <input
        className="edit-input"
        value={editedUser.username}
        onChange={(e) =>
          setEditedUser({ ...editedUser, username: e.target.value })
        }
      />
    </label>

    <label>
      <span>Email:</span>
      <input
        className="edit-input"
        value={editedUser.email}
        onChange={(e) =>
          setEditedUser({ ...editedUser, email: e.target.value })
        }
      />
    </label>

    <label>
      <span>New Password:</span>
      <input
        className="edit-input"
        type="password"
        placeholder="Leave blank to keep current"
        value={editedUser.password || ''}
        onChange={(e) =>
          setEditedUser({ ...editedUser, password: e.target.value })
        }
      />
    </label>
  </div>
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