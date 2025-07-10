import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/Components/Navbar';
import Home from '../src/Components/pages/Home';
import Login from '../src/Components/pages/auth/Login';
import Register from '../src/Components/pages/auth/Register';
import UserDashboard from '../src/Components/pages/user/UserDashboard';
import AdminDashboard from '../src/Components/pages/admin/AdminDashboard';
import Anirudhbook from '../src/Components/pages/user/Anirudhbook';
import Adhibook from '../src/Components/pages/user/Adhibook';
import Yuvanbook from '../src/Components/pages/user/Yuvanbook';
import ArtistBookingPage from '../src/Components/pages/user/ArtistBookingPage'; // ✅ NEW

function App() {
  return (
   <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* 🎤 Static artist routes */}
        <Route path="/anirudh" element={<Anirudhbook />} />
        <Route path="/adhi" element={<Adhibook />} />
        <Route path="/yuvan" element={<Yuvanbook />} />

        {/* ✅ Dynamic artist route - handles any path like /harris, /dhanush etc. */}
        <Route path="/book/:artistName" element={<ArtistBookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
