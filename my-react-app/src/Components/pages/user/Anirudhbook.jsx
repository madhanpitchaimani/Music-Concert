import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Anirudhbook.css';

function Anirudhbook() {
  const [showEvent, setShowEvent] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [seatType, setSeatType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const ticketRef = useRef(null);
  const navigate = useNavigate();

  const GST = 50;
  const prices = { standard: 1000, vip: 3000 };
  const totalAmount = ticketCount * prices[seatType] + ticketCount * GST;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.email === 'admin@gmail.com';
    if (isAdmin) {
      alert("Admins are not allowed to book tickets.");
      navigate('/admin');
    }
  }, [navigate]);

  const handleContinue = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email || 'unknown';

  const bookingData = {
  artist: "Anirudh",
  email,
  seatType,
  ticketCount,
  totalAmount,
  paymentMethod,
  bookingDate: new Date().toISOString(),
  venueName: "Nithya Kalyana Perumal Temple Grounds, ECR, Chennai",
  artistImage: "/anicon.jpeg"
};


    try {
      await axios.post('http://localhost:5000/api/bookings', bookingData);
      alert("Booking Successful! Ticket will now be downloaded.");

      setTimeout(() => {
        html2canvas(ticketRef.current).then((canvas) => {
          const link = document.createElement('a');
          link.download = 'Anirudh_Concert_Ticket.png';
          link.href = canvas.toDataURL();
          link.click();
        });
      }, 300);
    } catch (err) {
      console.error("Failed to save booking:", err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="anirudh-page">
      <div className="anirudh-concert-image-container">
        <img src="/anicon.jpeg" alt="Anirudh Concert" className="anirudh-concert-image" />
        <button className="anirudh-book-btn" onClick={() => setShowBooking(true)}>Book Now</button>
      </div>

      <div className="anirudh-card-section">
        <h2>Venue</h2>
        <div className="anirudh-card">
          <div className="anirudh-card-text">
            <strong>Chennai Trade Centre</strong><br />
            Mount Poonamallee Rd, Nandambakkam, Chennai
          </div>
          <button className="anirudh-direction-btn" onClick={() => window.open('https://www.google.com/maps/place/Chennai+Trade+Centre', '_blank')}>Get Directions</button>
        </div>
      </div>

      <div className="anirudh-card-section">
        <h2>Event Details</h2>
        <div className="anirudh-card">
          <div className="anirudh-card-text">Full details about the event schedule and access</div>
          <button className="anirudh-view-btn" onClick={() => setShowEvent(true)}>View</button>
        </div>
      </div>

      <div className="anirudh-card-section">
        <h2>Concert Rules</h2>
        <div className="anirudh-card">
          <div className="anirudh-card-text">Important rules and guidelines</div>
          <button className="anirudh-view-btn" onClick={() => setShowRules(true)}>View</button>
        </div>
      </div>

      {/* Modal: Event Details */}
      {showEvent && (
        <div className="anirudh-modal-overlay">
          <div className="anirudh-modal-content">
            <button className="anirudh-close-btn" onClick={() => setShowEvent(false)}>×</button>
            <h2>Event Details</h2>
            <ul>
              <li><strong>Language:</strong> Tamil</li>
              <li><strong>Duration:</strong> 3.5 Hours</li>
              <li><strong>Entry:</strong> 5 yrs & above</li>
              <li><strong>Layout:</strong> Indoor Hall</li>
              <li><strong>Seating:</strong> Seated Only</li>
              <li><strong>Kid Friendly:</strong> Yes</li>
            </ul>
          </div>
        </div>
      )}

      {/* Modal: Rules */}
      {showRules && (
        <div className="anirudh-modal-overlay">
          <div className="anirudh-modal-content">
            <button className="anirudh-close-btn" onClick={() => setShowRules(false)}>×</button>
            <h2>Prohibited Items</h2>
            <ul>
              <li>Outside food and drinks</li>
              <li>Alcohol / Drugs</li>
              <li>Weapons</li>
              <li>Camera gear</li>
              <li>Flammable items</li>
              <li>Laser lights</li>
            </ul>
          </div>
        </div>
      )}

      {/* Modal: Booking */}
      {showBooking && (
        <div className="anirudh-modal-overlay">
          <div className="anirudh-modal-content">
            <h2>Confirm Booking</h2>

            <label>Tickets:</label>
            <input
              type="number"
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
              style={{ width: '427px' }}
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
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="gpay"
                  checked={paymentMethod === 'gpay'}
                  onChange={() => setPaymentMethod('gpay')}
                />
                <img src="/gpay.png" alt="GPay" className="payment-icon" />
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="phonepe"
                  checked={paymentMethod === 'phonepe'}
                  onChange={() => setPaymentMethod('phonepe')}
                />
                <img src="/phonepe.png" alt="PhonePe" className="payment-icon" />
              </label>
            </div>

            <h3>Total: ₹{totalAmount}</h3>

            <button
              className="anirudh-proceed-btn"
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

      {/* Hidden Ticket for Download */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={ticketRef} className="anirudh-ticket">
          <div className="ticket-left">
            <div className="barcode">
              <p className="barcode-number">123 456 7890</p>
              <div className="barcode-line" />
            </div>
            <p className="ticket-left-text">
              Entry Pass for Anirudh Live | Hukum Tour <br />
              Valid only on 25 Aug 2025 - 7:00 PM
            </p>
          </div>

          <div className="ticket-right">
            <img src="/anicon.jpeg" alt="Concert" className="ticket-poster" />
            <h1 className="ticket-title">ANIRUDH</h1>
            <p className="ticket-event">Hukum Tour</p>
            <p className="ticket-date">25 Aug 2025 | 7:00 PM</p>
            <p className="ticket-venue">
              Nithya Kalyana Perumal Temple Grounds, ECR, Chennai
            </p>
            <p className="ticket-details">
              Seat: {seatType.toUpperCase()} | Tickets: {ticketCount}
            </p>
            <p className="ticket-price">Total: ₹{totalAmount}</p>
            <div className="ticket-qr">
              <QRCode value={`Anirudh | ${ticketCount} Ticket(s) | ₹${totalAmount}`} size={80} />
            </div>
          </div>
        </div>
      </div>
        <footer className="concert-footer">
        <p>&copy; 2025 Vibe Vault. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Anirudhbook;
