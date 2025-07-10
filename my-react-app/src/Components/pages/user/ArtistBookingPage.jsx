import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import './ArtistBookingPage.css';

function ArtistBookingPage() {
  const { artistName } = useParams();
  const [artistData, setArtistData] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [seatType, setSeatType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const ticketRef = useRef(null);

  const GST = 50;
  const prices = { standard: 1000, vip: 3000 };
  const totalAmount = ticketCount * prices[seatType] + ticketCount * GST;

  useEffect(() => {
    fetch(`http://localhost:3000/concerts?route=/${artistName}`)
      .then((res) => res.json())
      .then((data) => setArtistData(data[0]))
      .catch((err) => console.error('Failed to load artist data:', err));
  }, [artistName]);

  const handleContinue = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email || 'unknown';

    const bookingData = {
      artist: artistData?.name || 'Unknown Artist',
      email,
      seatType,
      ticketCount,
      totalAmount,
      paymentMethod,
      bookingDate: new Date().toISOString()
    };

    try {
      await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
    } catch (err) {
      console.error('Failed to save booking:', err);
    }

    setTimeout(() => {
      html2canvas(ticketRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${artistData?.name}_Concert_Ticket.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }, 300);
  };

  if (!artistData) return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>;

  return (
    <div className="artist-page">
      <div className="concert-image-container">
        <img src={artistData.image} alt={`${artistData.name} Concert`} className="concert-image" />
        <button className="book-btn" onClick={() => setShowBooking(true)}>Book Now</button>
      </div>

      <h2 style={{ color: 'white', textAlign: 'center', margin: '20px 0' }}>{artistData.name} Live Concert</h2>

      {/* === Red Card Section === */}
      <div className="anirudh-card-section">

        {/* Venue */}
        <h2>Venue</h2>
        <div className="anirudh-card">
          <div className="anirudh-card-text">
            <strong>{artistData.venueName}</strong><br />
            {artistData.venueAddress}
               <p style={{ marginTop: '10px', fontStyle: 'popins', fontSize: '20px', color: '#fff' }}>
      📍 Tap the button to get directions
    </p>
          </div>
          <a href={artistData.venueMap} target="_blank" rel="noopener noreferrer">
            <button className="anirudh-direction-btn">Get Directions</button>
          </a>
        </div>

        {/* Event Details */}
        <h2>Event Details</h2>
        <div className="anirudh-card">
          <div className="anirudh-card-text">
            Full details about the event schedule and access
          </div>
          <button className="anirudh-view-btn" onClick={() => setShowDetails(true)}>View</button>
        </div>

        {/* Rules */}
        <h2>Concert Rules</h2>
        <div className="anirudh-card">
          <div className="anirudh-card-text">
            Important rules and guidelines
          </div>
          <button className="anirudh-view-btn" onClick={() => setShowRules(true)}>View</button>
        </div>
      </div>

      {/* 🎫 Booking Modal */}
      {showBooking && (
        <div className="anirudh-modal-overlay">
          <div className="anirudh-modal-content">
            <h2>Confirm Booking</h2>

            <label>Tickets:</label>
            <input
              type="number"
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
              min="1"
              className="anirudh-input"
            />

            <label>Seat Type:</label>
            <select
              value={seatType}
              onChange={(e) => setSeatType(e.target.value)}
              className="anirudh-input"
            >
              <option value="standard">Standard - ₹1000</option>
              <option value="vip">VIP - ₹3000</option>
            </select>

            <label>Payment Method:</label>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="gpay"
                  checked={paymentMethod === 'gpay'}
                  onChange={() => setPaymentMethod('gpay')}
                /> GPay
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="phonepe"
                  checked={paymentMethod === 'phonepe'}
                  onChange={() => setPaymentMethod('phonepe')}
                /> PhonePe
              </label>
            </div>

            <div className="total-price-display">Total: ₹{totalAmount}</div>

            <button
              className="anirudh-confirm-btn"
              onClick={() => {
                setShowBooking(false);
                handleContinue();
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* 📋 Event Details Modal */}
      {showDetails && (
        <div className="anirudh-modal-overlay">
          <div className="anirudh-modal-content">
            <h2>Event Details</h2>
            <ul>
              <li><strong>Language:</strong> {artistData.eventDetails?.language}</li>
              <li><strong>Duration:</strong> {artistData.eventDetails?.duration}</li>
              <li><strong>Entry:</strong> {artistData.eventDetails?.entry}</li>
              <li><strong>Layout:</strong> {artistData.eventDetails?.layout}</li>
              <li><strong>Seating:</strong> {artistData.eventDetails?.seating}</li>
              <li><strong>Kid Friendly:</strong> {artistData.eventDetails?.kidFriendly}</li>
            </ul>
            <button className="anirudh-close-btn" onClick={() => setShowDetails(false)}>×</button>
          </div>
        </div>
      )}

      {/* 🧾 Rules Modal */}
      {showRules && (
        <div className="anirudh-modal-overlay">
          <div className="anirudh-modal-content">
            <h2>Concert Rules</h2>
            <ul>
              {artistData.rules?.split('.').map((rule, index) => rule.trim() && (
                <li key={index}>{rule.trim()}</li>
              ))}
            </ul>
            <button className="anirudh-close-btn" onClick={() => setShowRules(false)}>×</button>
          </div>
        </div>
      )}

      {/* 🎟️ Hidden Ticket Snapshot */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={ticketRef} className="anirudh-ticket">
          <div className="ticket-left">
            <div className="barcode">
              <div className="barcode-number">#{Math.floor(Math.random() * 999999)}</div>
              <div className="barcode-line"></div>
            </div>
            <div className="ticket-left-text">Thanks for booking with ConcertX</div>
          </div>
          <div className="ticket-right">
            <img src={artistData.image} alt="Poster" className="ticket-poster" />
            <h1 className="ticket-title">{artistData.name}</h1>
            <div className="ticket-event">Live Concert</div>
            <div className="ticket-date">Booking: {new Date().toLocaleDateString()}</div>
            <div className="ticket-venue">{artistData.venueName}</div>
            <div className="ticket-details">
              {ticketCount} × {seatType.toUpperCase()} Tickets + ₹{GST} GST
            </div>
            <div className="ticket-price">Total: ₹{totalAmount}</div>
            <div className="ticket-qr">
              <QRCode value={`Artist: ${artistData.name} | Total: ₹${totalAmount}`} size={80} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistBookingPage;
