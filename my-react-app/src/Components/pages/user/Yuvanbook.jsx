import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import axios from 'axios';
import './Yuvanbook.css';

function Yuvanbook() {
  const [showEvent, setShowEvent] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [seatType, setSeatType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const ticketRef = useRef(null);

  const GST = 50;
  const prices = { standard: 1200, vip: 2800 };
  const totalAmount = ticketCount * prices[seatType] + ticketCount * GST;

  const openMap = () => {
    window.open(
      'https://www.google.com/maps/place/Nandambakkam+Trade+Centre,+Chennai',
      '_blank'
    );
  };

  const handleContinue = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios.post('http://localhost:3000/bookings', {
        artist: 'Yuvan',
        email: user.email,
        ticketCount,
        seatType,
        totalAmount,
        paymentMethod,
        bookingTime: new Date().toISOString()
      });
    }

    const image = new Image();
    image.src = '/yuvancon.jpg';
    image.onload = () => {
      setTimeout(() => {
        html2canvas(ticketRef.current).then((canvas) => {
          const link = document.createElement('a');
          link.download = 'Yuvan_Concert_Ticket.png';
          link.href = canvas.toDataURL();
          link.click();
        });
      }, 300);
    };
    image.onerror = () => {
      alert("Image failed to load. Please check your image path.");
    };
  };

  return (
    <div>
      {/* Navbar */}

      {/* Concert Image */}
      <div className="yuvan-concert-image-container">
        <img src="yuvancon.jpg" alt="Yuvan Concert" className="yuvan-concert-image" />
        <button className="yuvan-book-btn" onClick={() => setShowBooking(true)}>Book Now</button>
      </div>

      {/* Venue */}
      <div className="yuvan-card-section">
        <h2>Venue</h2>
        <div className="yuvan-card">
          <div className="yuvan-card-text">
            <strong>Nandambakkam Trade Centre</strong><br />
            Chennai, Tamil Nadu
          </div>
          <button className="yuvan-direction-btn" onClick={openMap}>Get Directions</button>
        </div>
      </div>

      {/* Event Details */}
      <div className="yuvan-card-section">
        <h2>Event Details</h2>
        <div className="yuvan-card">
          <div className="yuvan-card-text">
            Click below to view concert details like duration, age, and more.
          </div>
          <button className="yuvan-view-btn" onClick={() => setShowEvent(true)}>View</button>
        </div>
      </div>

      {/* Concert Rules */}
      <div className="yuvan-card-section">
        <h2>Concert Rules</h2>
        <div className="yuvan-card">
          <div className="yuvan-card-text">
            Important restrictions and allowed items.
          </div>
          <button className="yuvan-view-btn" onClick={() => setShowRules(true)}>View</button>
        </div>
      </div>

      {/* Event Modal */}
      {showEvent && (
        <div className="yuvan-modal-overlay">
          <div className="yuvan-modal-content">
            <button className="yuvan-close-btn" onClick={() => setShowEvent(false)}>×</button>
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

      {/* Rules Modal */}
      {showRules && (
        <div className="yuvan-modal-overlay">
          <div className="yuvan-modal-content">
            <button className="yuvan-close-btn" onClick={() => setShowRules(false)}>×</button>
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

      {/* Booking Modal */}
      {showBooking && (
        <div className="yuvan-modal-overlay">
          <div className="yuvan-modal-content">
            <button className="yuvan-close-btn" onClick={() => setShowBooking(false)}>×</button>
            <h2>Confirm Booking</h2>

            <label>Tickets:</label>
            <input
              type="number"
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
              min="1"
              className="yuvan-input"
            />

            <label>Seat Type:</label>
            <select
              value={seatType}
              onChange={(e) => setSeatType(e.target.value)}
              className="yuvan-input"
            >
              <option value="standard">Standard - ₹1200</option>
              <option value="vip">VIP - ₹2800</option>
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

            <button className="yuvan-proceed-btn" onClick={() => {
              setShowBooking(false);
              handleContinue();
            }}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Hidden Ticket for Download */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={ticketRef} className="yuvan-ticket">
          <div className="ticket-left">
            <div className="barcode">
              <p className="barcode-number">123 456 7890</p>
              <div className="barcode-line" />
            </div>
            <p className="ticket-left-text">
              Entry Pass for Yuvan Live | Mega Tour<br />
              Valid only on 30 Aug 2025 - 6:30 PM
            </p>
          </div>

          <div className="ticket-right">
            <img src="/yuvancon.jpg" alt="Concert" className="ticket-poster" />
            <h1 className="ticket-title">YUVAN</h1>
            <p className="ticket-event">Mega Tour</p>
            <p className="ticket-date">30 Aug 2025 | 6:30 PM</p>
            <p className="ticket-venue">
              Nandambakkam Trade Centre, Chennai
            </p>
            <p className="ticket-details">
              Seat: {seatType.toUpperCase()} | Tickets: {ticketCount}
            </p>
            <p className="ticket-price">Total: ₹{totalAmount}</p>
            <div className="ticket-qr">
              <QRCode value={`Yuvan | ${ticketCount} Ticket(s) | ₹${totalAmount}`} size={80} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="yuvan-footer">
        <div className="yuvan-footer-content">
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
          <span>© 2025 ConcertX. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default Yuvanbook;