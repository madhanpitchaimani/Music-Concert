import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import axios from 'axios';

function UserDashboard() {
  const navigate = useNavigate();
  const [concerts, setConcerts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const posterImages = ['img-1.jpg', 'img-4.jpg', 'img-7.jpg', 'img-8.jpg'];
  const anirudhVideos = ['anirudh1.mp4', 'anirudh2.mp4'];
  const adhiVideos = ['adhi1.mp4', 'adhi2.mp4'];
  const yuvanVideos = ['yuvan1.mp4', 'yuvan2.mp4'];

  const user = JSON.parse(localStorage.getItem('user'));
  const userEmail = user?.email || '';

  useEffect(() => {
    axios.get('http://localhost:3000/concerts')
      .then((res) => setConcerts(res.data))
      .catch((err) => console.error("Failed to load concerts:", err));

    fetchBookings();
  }, [userEmail]);

  const fetchBookings = () => {
    axios.get(`http://localhost:3000/bookings?email=${userEmail}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Failed to load bookings:", err));
  };

  const handleDeleteBooking = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this booking?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3000/bookings/${id}`);
      setBookings(prev => prev.filter(booking => booking.id !== id));
      alert("Booking deleted successfully");
    } catch (err) {
      console.error("Failed to delete booking:", err);
      alert("Failed to delete booking");
    }
  };

  const renderVideoSection = (title, videoList) => (
    <div className="video-artist-section">
      <h2>{title}</h2>
      <div className="video-row">
        {videoList.map((video, index) => (
          <div className="video-card" key={index}>
            <video width="320" height="180" controls>
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h2>Concert {index + 1}</h2>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="user-dashboard">
      {/* 🎞️ Carousel */}
      <div className="scroll-carousel-wrapper">
        <div className="scroll-carousel">
          {posterImages.concat(posterImages).map((src, i) => (
            <div className="scroll-item" key={i}>
              <img src={src} alt={`Poster ${i}`} />
            </div>
          ))}
        </div>
      </div>

      {/* 🧾 My Bookings Button */}
      <div className="my-booking-button-container">
        <button className="my-booking-btn" onClick={() => setShowBookingModal(true)}>
          My Bookings
        </button>
      </div>

      {/* 🎟️ My Bookings Modal */}
      {showBookingModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <button className="close-btn" onClick={() => setShowBookingModal(false)}>×</button>
            <h2 style={{ color: 'red' }}>Your Concert Bookings</h2>
            {bookings.length > 0 ? (
              <ul className="booking-list">
                {bookings.map((booking, i) => (
                  <li key={i} className="booking-item">
                    <strong>{booking.artist}</strong><br />
                    Tickets: {booking.ticketCount} × {booking.seatType.toUpperCase()}<br />
                    Total: ₹{booking.totalAmount} | Method: {booking.paymentMethod}<br />
                    Date: {new Date(booking.bookingDate).toLocaleDateString()}
                    <br />
                    <button
                      className="delete-booking-btn"
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bookings found.</p>
            )}
          </div>
        </div>
      )}

      {/* 🎤 Artist Section */}
      <div className="Artist">
        <h1>Artist Concerts</h1>
        <div className="artist-row">
          {/* Static Artists */}
          <div className="artist-card">
            <img src="ani.jpg" alt="Anirudh" />
            <h1>Anirudh Ravichander</h1>
            <button onClick={() => navigate('/anirudh')}>View</button>
          </div>
          <div className="artist-card">
            <img src="aadhi.webp" alt="Hiphop Aadhi" />
            <h1>Hiphop Tamizha Adhi</h1>
            <button onClick={() => navigate('/adhi')}>View</button>
          </div>
          <div className="artist-card">
            <img src="yuvan.jpg" alt="Yuvan Shankar Raja" />
            <h1>Yuvan Shankar Raja</h1>
            <button onClick={() => navigate('/yuvan')}>View</button>
          </div>

          {/* Admin Added Artists */}
          {concerts.map((concert, index) => (
            <div className="artist-card" key={index}>
              <img src={concert.image} alt={concert.name} />
              <h1>{concert.name}</h1>
              <button onClick={() => navigate(`/book${concert.route}`)}>View</button>
            </div>
          ))}
        </div>
      </div>

      {/* 🎥 Previous Videos */}
      <div className="videos">
        <h1 style={{ color: "red" }}>Previous Concert Performances</h1>
        {renderVideoSection('🎤 Anirudh Ravichander', anirudhVideos)}
        {renderVideoSection('🎤 Hiphop Tamizha Adhi', adhiVideos)}
        {renderVideoSection('🎤 Yuvan Shankar Raja', yuvanVideos)}
      </div>
    </div>
  );
}

export default UserDashboard;
