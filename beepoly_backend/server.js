const express = require('express');
const cors = require('cors');
require('dotenv').config();

const deckRoutes = require('./routes/deckRoutes');
const { isConfigured } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Beepoly Node.js REST API Backend',
    databaseConnected: isConfigured,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', deckRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Beepoly Backend API running at http://localhost:${PORT}`);
  console.log(`📊 Database Status: ${isConfigured ? 'Connected (Supabase)' : 'Mock Mode'}`);
  console.log(`===================================================`);
});
