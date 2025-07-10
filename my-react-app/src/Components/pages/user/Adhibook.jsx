import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import './Adhibook.css';

function Adhibook() {
  const [showBooking, setShowBooking] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [seatType, setSeatType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const ticketRef = useRef(null);

  const GST = 50;
  const prices = { standard: 800, vip: 2000 };
  const totalAmount = ticketCount * prices[seatType] + ticketCount * GST;

  const handleContinue = () => {
    const image = new Image();
    image.src = '/adhicon.jpg';

    image.onload = async () => {
      // ✅ Save booking to JSON server
      const user = JSON.parse(localStorage.getItem('user'));
      const email = user?.email || 'unknown';

      const bookingData = {
        artist: "Adhi",
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
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        });
      } catch (err) {
        console.error("Failed to save booking:", err);
      }

      // ✅ Download ticket
      setTimeout(() => {
        html2canvas(ticketRef.current).then((canvas) => {
          const link = document.createElement('a');
          link.download = 'Adhi_Concert_Ticket.png';
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
    <div className="adhi-page">
      <div className="adhi-concert-image-container">
        <img src="/adhicon.jpg" alt="Adhi Concert" className="adhi-concert-image" />
        <button className="adhi-book-btn" onClick={() => setShowBooking(true)}>Book Now</button>
      </div>

      <div className="adhi-card-section">
        <h2>Venue</h2>
        <div className="adhi-card">
          <div className="adhi-card-text">
            <strong>Chennai Trade Centre</strong><br />
            Mount Poonamallee Rd, Nandambakkam, Chennai
          </div>
          <button className="adhi-direction-btn" onClick={() => window.open('https://www.google.com/maps/place/Chennai+Trade+Centre', '_blank')}>Get Directions</button>
        </div>
      </div>

      <div className="adhi-card-section">
        <h2>Event Details</h2>
        <div className="adhi-card">
          <div className="adhi-card-text">
            Full details about the event schedule and access
          </div>
          <button className="adhi-view-btn" onClick={() => setShowEvent(true)}>View</button>
        </div>
      </div>

      <div className="adhi-card-section">
        <h2>Concert Rules</h2>
        <div className="adhi-card">
          <div className="adhi-card-text">
            Important rules and guidelines
          </div>
          <button className="adhi-view-btn" onClick={() => setShowRules(true)}>View</button>
        </div>
      </div>

      {showEvent && (
        <div className="adhi-modal-overlay">
          <div className="adhi-modal-content">
            <button className="adhi-close-btn" onClick={() => setShowEvent(false)}>×</button>
            <h2>Event Details</h2>
            <ul>
              <li><strong>Language:</strong> Tamil</li>
              <li><strong>Duration:</strong> 3 Hours</li>
              <li><strong>Entry:</strong> 5 yrs & above</li>
              <li><strong>Layout:</strong> Indoor Stage</li>
              <li><strong>Seating:</strong> Seated</li>
              <li><strong>Kid Friendly:</strong> Yes</li>
            </ul>
          </div>
        </div>
      )}

      {showRules && (
        <div className="adhi-modal-overlay">
          <div className="adhi-modal-content">
            <button className="adhi-close-btn" onClick={() => setShowRules(false)}>×</button>
            <h2>Prohibited Items</h2>
            <ul>
              <li>Outside food or beverages</li>
              <li>Alcohol and tobacco</li>
              <li>Sharp objects</li>
              <li>Professional camera/video gear</li>
              <li>Fireworks or explosives</li>
              <li>Laser pointers</li>
            </ul>
          </div>
        </div>
      )}

      {showBooking && (
        <div className="adhi-modal-overlay">
          <div className="adhi-modal-content">
            <button className="adhi-close-btn" onClick={() => setShowBooking(false)}>×</button>

            <h2>Confirm Booking</h2>

            <label>Tickets:</label>
            <input
              type="number"
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
              min="1"
              className="adhi-input"
            />

            <label>Seat Type:</label>
            <select
              value={seatType}
              onChange={(e) => setSeatType(e.target.value)}
              className="adhi-input"
            >
              <option value="standard">Standard - ₹800</option>
              <option value="vip">VIP - ₹2000</option>
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
              className="adhi-proceed-btn"
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

      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={ticketRef} className="adhi-ticket">
          <div className="ticket-left">
            <div className="barcode">
              <p className="barcode-number">123 456 7890</p>
              <div className="barcode-line" />
            </div>
            <p className="ticket-left-text">
              Entry Pass for Adhi Live | Hiphop Tamizha Tour <br />
              Valid only on 27 Aug 2025 - 7:00 PM
            </p>
          </div>

          <div className="ticket-right">
            <img src="/adhicon.jpg" alt="Concert" className="ticket-poster" />
            <h1 className="ticket-title">ADHI</h1>
            <p className="ticket-event">Hiphop Tamizha Tour</p>
            <p className="ticket-date">27 Aug 2025 | 7:00 PM</p>
            <p className="ticket-venue">
              Chennai Trade Centre, Nandambakkam
            </p>
            <p className="ticket-details">
              Seat: {seatType.toUpperCase()} | Tickets: {ticketCount}
            </p>
            <p className="ticket-price">Total: ₹{totalAmount}</p>
            <div className="ticket-qr">
              <QRCode value={`Adhi | ${ticketCount} Ticket(s) | ₹${totalAmount}`} size={80} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adhibook;
