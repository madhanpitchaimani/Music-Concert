import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom/client';
import Ticket from './Ticket';
import './UserDashboard.css';

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
    axios.get('http://localhost:5000/api/concerts')
      .then(res => setConcerts(res.data))
      .catch(err => console.error("Failed to load concerts:", err));

    fetchBookings();
  }, [userEmail]);

  const fetchBookings = () => {
    axios.get('http://localhost:5000/api/bookings')
      .then(res => {
        const filtered = res.data.filter(b => b.email === userEmail);
        setBookings(filtered);
      })
      .catch(err => console.error("Failed to load bookings:", err));
  };

  const downloadTicket = (booking) => {
    const concert = concerts.find(c => c.name === booking.artist);

    const enrichedBooking = {
      ...booking,
      artistImage: booking.artistImage || concert?.image || 'default.png',
      venueName: booking.venueName || concert?.venue || 'Venue not provided'
    };

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    root.render(
      <Ticket
        artist={enrichedBooking.artist}
        artistImage={enrichedBooking.artistImage}
        venue={enrichedBooking.venueName}
        ticketCount={enrichedBooking.ticketCount}
        seatType={enrichedBooking.seatType}
        totalAmount={enrichedBooking.totalAmount}
        bookingDate={enrichedBooking.bookingDate}
      />
    );

    setTimeout(() => {
      html2canvas(container).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${enrichedBooking.artist}_Concert_Ticket.png`;
        link.href = canvas.toDataURL();
        link.click();
        document.body.removeChild(container);
      });
    }, 500);
  };

 const deleteBooking = async (booking) => {
  const bookingId = booking._id;

  if (!bookingId) {
    alert("Booking ID missing.");
    return;
  }

  try {
    await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
    fetchBookings(); // Refresh booking list
  } catch (err) {
    console.error("Error deleting booking:", err);
    alert("Error deleting booking. Try again.");
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
            </video>
            <h2>Concert {index + 1}</h2>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="user-dashboard">
      <div className="scroll-carousel-wrapper">
        <div className="scroll-carousel">
          {posterImages.concat(posterImages).map((src, i) => (
            <div className="scroll-item" key={i}>
              <img src={src} alt={`Poster ${i}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="my-booking-button-container">
        <button className="my-booking-btn" onClick={() => setShowBookingModal(true)}>
          My Bookings
        </button>
      </div>

      {showBookingModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <button className="close-btn" onClick={() => setShowBookingModal(false)}>×</button>
            <h2 style={{ color: 'red' }}>Your Concert Bookings</h2>
            {bookings.length > 0 ? (
              <ul className="booking-list">
             {bookings.map((booking, i) => (
  <li key={i} className="booking-item">
    <button
      onClick={() => deleteBooking(booking)}
      style={{
        float: 'right',
        background: 'transparent',
        border: 'none',
        fontSize: '20px',
        color: 'red',
        cursor: 'pointer'
      }}
      title="Delete booking"
    >
      ×
    </button>

    <strong>{booking.artist}</strong><br />
    Tickets: {booking.ticketCount} × {booking.seatType.toUpperCase()}<br />
    Total: ₹{booking.totalAmount} | Method: {booking.paymentMethod}<br />
    Date: {new Date(booking.bookingDate).toLocaleDateString()}<br />

    <button
      className="download-ticket-btn"
      onClick={() => downloadTicket(booking)}
      style={{ backgroundColor: 'red', color: 'white', border: 'red solid 2px', marginTop: '10px' }}
    >Download Ticket</button>
  </li>
))}

              </ul>
            ) : (
              <p>No bookings found.</p>
            )}
          </div>
        </div>
      )}

      <div className="Artist">
        <h1>Artist Concerts</h1>
        <div className="artist-row">
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

          {concerts.map((concert, index) => (
            <div className="artist-card" key={index}>
              <img src={concert.image} alt={concert.name} />
              <h1>{concert.name}</h1>
              {concert.route ? (
                <button onClick={() => navigate(`/book/${concert.route}`)}>View</button>
              ) : (
                <button disabled title="Invalid route">Unavailable</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="videos">
        <h1 style={{ color: "red" }}>Previous Concert Performances</h1>
        {renderVideoSection('🎤 Anirudh Ravichander', anirudhVideos)}
        {renderVideoSection('🎤 Hiphop Tamizha Adhi', adhiVideos)}
        {renderVideoSection('🎤 Yuvan Shankar Raja', yuvanVideos)}
      </div>

      <footer className="concert-footer">
        <p>&copy; 2025 Vibe Vault. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default UserDashboard;
