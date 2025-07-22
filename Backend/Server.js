const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/authRoutes');
const concertRoutes = require('./routes/concertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const uploadRoutes = require('./routes/uploadRoute'); // NEW

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // for JSON payloads

// Serve static files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes); // NEW

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('❌ MongoDB Error:', err));
