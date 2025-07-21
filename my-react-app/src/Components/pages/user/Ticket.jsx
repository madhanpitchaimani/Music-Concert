import React from 'react';
import QRCode from 'react-qr-code';
import './ArtistBookingPage.css';

function Ticket({ artist, artistImage, venue, ticketCount, seatType, totalAmount, bookingDate }) {
  const GST = 50;

  return (
    <div className="anirudh-ticket">
      {/* Left side strip */}
      <div className="ticket-left">
        <div className="barcode">
          <div className="barcode-number">#{Math.floor(Math.random() * 999999)}</div>
          <div className="barcode-line"></div>
        </div>
        <div className="ticket-left-text">Thanks for booking with ConcertX</div>
      </div>

      {/* Right side main content */}
      <div className="ticket-right">
        <img
          src={artistImage || 'default.png'}
          alt="Poster"
          className="ticket-poster"
          crossOrigin="anonymous" // ✅ Required for html2canvas
        />
        <h1 className="ticket-title">{artist || 'Unknown Artist'}</h1>
        <div className="ticket-event">Live Concert</div>
        <div className="ticket-date">
          Booking: {new Date(bookingDate).toLocaleDateString()}
        </div>
        <div className="ticket-venue">
          🎤 Venue: {venue || 'Venue not provided'}
        </div>
        <div className="ticket-details">
          {ticketCount} × {seatType?.toUpperCase()} Tickets + ₹{GST} GST
        </div>
        <div className="ticket-price">
          Total: ₹{totalAmount}
        </div>
        <div className="ticket-qr">
          <QRCode
            value={`Artist: ${artist} | Total: ₹${totalAmount}`}
            size={80}
          />
        </div>
      </div>
    </div>
  );
}

export default Ticket;
