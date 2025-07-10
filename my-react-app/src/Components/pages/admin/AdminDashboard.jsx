import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './AdminDashboard.css';

const defaultConcertRules = `Prohibited Items:
Outside food and drinks.
Alcohol / Drugs.
Weapons.
Camera gear.
Flammable items.
Laser lights.`;

function AdminDashboard() {
  const [bookingStats, setBookingStats] = useState({
    totalRevenue: 0,
    totalTickets: 0,
    byArtist: {},
  });

  const [allBookings, setAllBookings] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();

  const [newConcert, setNewConcert] = useState({
    name: '',
    image: '',
    route: '',
    venue: '',
    rules: defaultConcertRules,
    venueMap: '',
    eventDetails: {
      language: '',
      duration: '',
      entry: '',
      layout: '',
      seating: '',
      kidFriendly: ''
    }
  });

  useEffect(() => {
    fetchStats();
    fetchConcerts();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get('http://localhost:3000/bookings');
    const bookings = res.data;
    let revenue = 0;
    let tickets = 0;
    const artistData = {};

    bookings.forEach(booking => {
      revenue += booking.totalAmount;
      tickets += booking.ticketCount;
      if (!artistData[booking.artist]) {
        artistData[booking.artist] = { revenue: 0, tickets: 0 };
      }
      artistData[booking.artist].revenue += booking.totalAmount;
      artistData[booking.artist].tickets += booking.ticketCount;
    });

    setBookingStats({
      totalRevenue: revenue,
      totalTickets: tickets,
      byArtist: artistData,
    });
    setAllBookings(bookings);
  };

  const fetchConcerts = async () => {
    const res = await axios.get('http://localhost:3000/concerts');
    setConcerts(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/concerts/${id}`);
    fetchConcerts();
  };

  const handleAddOrEdit = async () => {
    const { name, image, route, venue, rules, venueMap, eventDetails } = newConcert;
    if (!name || !image || !route || !venue || !rules || !venueMap) return;

    if (editIndex !== null) {
      await axios.put(`http://localhost:3000/concerts/${editIndex}`, newConcert);
      setEditIndex(null);
    } else {
      await axios.post('http://localhost:3000/concerts', newConcert);
    }

    setNewConcert({
      name: '',
      image: '',
      route: '',
      venue: '',
      rules: defaultConcertRules,
      venueMap: '',
      eventDetails: {
        language: '',
        duration: '',
        entry: '',
        layout: '',
        seating: '',
        kidFriendly: ''
      }
    });

    fetchConcerts();
  };

  const handleEdit = (concert) => {
    setNewConcert(concert);
    setEditIndex(concert.id);
    setActiveTab('manage');
  };

  return (
    
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">🎛️ Admin Dashboard</h1>

      <div className="admin-tab-buttons">
        <button
          className={`admin-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📋 Booking History
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          🎤 Manage Artists
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="admin-booking-section">
          <div className="admin-stats">
            <h3>📈 Total Revenue: <span>₹{bookingStats.totalRevenue}</span></h3>
            <h3>🎟️ Total Tickets Sold: <span>{bookingStats.totalTickets}</span></h3>
          </div>

          <div className="admin-artist-stats">
            <h4>📊 Artist-wise Stats</h4>
            <ul>
              {Object.entries(bookingStats.byArtist).map(([artist, stats]) => (
                <li key={artist}>
                  <strong>{artist}:</strong> ₹{stats.revenue} from {stats.tickets} tickets
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-booking-table-container">
            <h4>🧾 User Bookings</h4>
            <table className="admin-booking-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Artist</th>
                  <th>Seat</th>
                  <th>Tickets</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Booked On</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking.email}</td>
                    <td>{booking.artist}</td>
                    <td>{booking.seatType}</td>
                    <td>{booking.ticketCount}</td>
                    <td>₹{booking.totalAmount}</td>
                    <td>{booking.paymentMethod}</td>
                    <td>{new Date(booking.bookingTime || booking.bookingDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="admin-manage-section">
          <h4>🎶 Manage Artist Concerts</h4>
          <div className="admin-form">
            <input placeholder="Artist Name" value={newConcert.name} onChange={(e) => setNewConcert({ ...newConcert, name: e.target.value })} />
            <input placeholder="Image URL" value={newConcert.image} onChange={(e) => setNewConcert({ ...newConcert, image: e.target.value })} />
            <input placeholder="Route" value={newConcert.route} onChange={(e) => setNewConcert({ ...newConcert, route: e.target.value })} />
            <input placeholder="Venue" value={newConcert.venue} onChange={(e) => setNewConcert({ ...newConcert, venue: e.target.value })} />
            <textarea placeholder="Rules" value={newConcert.rules} onChange={(e) => setNewConcert({ ...newConcert, rules: e.target.value })} />
            <input placeholder="Venue Map Link" value={newConcert.venueMap} onChange={(e) => setNewConcert({ ...newConcert, venueMap: e.target.value })} />
            <h5>Event Details</h5>
            <input placeholder="Language" value={newConcert.eventDetails.language} onChange={(e) => setNewConcert({ ...newConcert, eventDetails: { ...newConcert.eventDetails, language: e.target.value } })} />
            <input placeholder="Duration" value={newConcert.eventDetails.duration} onChange={(e) => setNewConcert({ ...newConcert, eventDetails: { ...newConcert.eventDetails, duration: e.target.value } })} />
            <input placeholder="Entry" value={newConcert.eventDetails.entry} onChange={(e) => setNewConcert({ ...newConcert, eventDetails: { ...newConcert.eventDetails, entry: e.target.value } })} />
            <input placeholder="Layout" value={newConcert.eventDetails.layout} onChange={(e) => setNewConcert({ ...newConcert, eventDetails: { ...newConcert.eventDetails, layout: e.target.value } })} />
            <input placeholder="Seating" value={newConcert.eventDetails.seating} onChange={(e) => setNewConcert({ ...newConcert, eventDetails: { ...newConcert.eventDetails, seating: e.target.value } })} />
            <input placeholder="Kid Friendly" value={newConcert.eventDetails.kidFriendly} onChange={(e) => setNewConcert({ ...newConcert, eventDetails: { ...newConcert.eventDetails, kidFriendly: e.target.value } })} />
            <button onClick={handleAddOrEdit}>{editIndex !== null ? 'Update Artist' : 'Add Artist'}</button>
          </div>

          <div className="admin-artist-list">
            {concerts.map((concert) => (
              <div key={concert.id} className="admin-artist-card">
                <img src={concert.image} alt={concert.name} />
                <h3>{concert.name}</h3>
                <button onClick={() => handleEdit(concert)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(concert.id)} className="delete-btn">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
