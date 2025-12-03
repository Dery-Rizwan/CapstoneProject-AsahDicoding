const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bapbRoutes = require('./routes/bapbRoutes');
const bappRoutes = require('./routes/bappRoutes');
const documentRoutes = require('./routes/documentRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // NEW

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'BA Digital System API - BAPB & BAPP Unified',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      bapb: '/api/bapb',
      bapp: '/api/bapp',
      documents: '/api/documents',
      notifications: '/api/notifications' // NEW
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bapb', bapbRoutes);
app.use('/api/bapp', bappRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes); // NEW

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}`);
      console.log('\n📋 Available Routes:');
      console.log('   - Auth: /api/auth');
      console.log('   - Users: /api/users');
      console.log('   - BAPB: /api/bapb');
      console.log('   - BAPP: /api/bapp');
      console.log('   - Documents: /api/documents');
      console.log('   - Notifications: /api/notifications'); // NEW
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to database:', err);
    process.exit(1);
  });

module.exports = app;