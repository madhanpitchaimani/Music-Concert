import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../ImageSlider';

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleExplore = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/user-dashboard');
    }
  };

  const handleComingSoon = () => {
    alert('🎉 Coming Soon!');
  };

  return (
    <div className="concert-home-container">
      <ImageSlider />

      <h1 className="concert-section-title">Recommended Concerts</h1>

      <div className="concert-image-row">
        <div className="concert-card">
          <div className="concert-image-wrapper">
            <img src="img-1.jpg" alt="Concert 1" className="concert-img" />
          </div>
          <button className="concert-book-btn" onClick={handleExplore}>Explore</button>
        </div>
        <div className="concert-card">
          <div className="concert-image-wrapper">
            <img src="img-2.jpg" alt="Concert 2" className="concert-img" />
          </div>
          <button className="concert-book-btn" onClick={handleComingSoon}>Upcoming Events</button>
        </div>
        <div className="concert-card">
          <div className="concert-image-wrapper">
            <img src="img-3.jpg" alt="Concert 3" className="concert-img" />
          </div>
          <button className="concert-book-btn" onClick={handleComingSoon}>Upcoming Events</button>
        </div>
      </div>

      <div className="concert-image-row">
        <div className="concert-card">
          <div className="concert-image-wrapper">
            <img src="img-4.jpg" alt="Concert 4" className="concert-img" />
          </div>
          <button className="concert-book-btn" onClick={handleExplore}>Book Now</button>
        </div>
        <div className="concert-card">
          <div className="concert-image-wrapper">
            <img src="img-5.jpg" alt="Concert 5" className="concert-img" />
          </div>
          <button className="concert-book-btn" onClick={handleExplore}>Explore</button>
        </div>
        <div className="concert-card">
          <div className="concert-image-wrapper">
            <img src="img-6.jpg" alt="Concert 6" className="concert-img" />
          </div>
          <button className="concert-book-btn" onClick={handleComingSoon}>Upcoming Events</button>
        </div>
      </div>

      <div className="concert-image-row">
        <div className="concert-card">
          <div className="concert-image-wrapper">
            <img src="img-7.jpg" alt="Concert 7" className="concert-img" />
          </div>
          <button className="concert-book-btn" onClick={handleExplore}>Explore</button>
        </div>
        <div className="concert-card">
          <div className="concert-image-wrapper">
            <img src="img-8.jpg" alt="Concert 8" className="concert-img" />
          </div>
          <button className="concert-book-btn" onClick={handleComingSoon}>Upcoming Events</button>
        </div>
        <div className="concert-card">
          <div className="concert-image-wrapper">
            <img src="img-9.jpg" alt="Concert 9" className="concert-img" />
          </div>
          <button className="concert-book-btn" onClick={handleComingSoon}>Upcoming Events</button>
        </div>
      </div>

      <footer className="concert-footer">
        <p>&copy; 2025 ConcertX. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
