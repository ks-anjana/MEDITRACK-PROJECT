const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables first
dotenv.config();

// Initialize express app
const app = express();

// Create uploads directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Uploads directory created');
}

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(uploadDir));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MediTrack API is running',
    timestamp: new Date().toISOString()
  });
});

console.log('\n🔧 Registering API routes...\n');

// Auth routes
try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ [1/8] Auth routes registered: /api/auth');
} catch (error) {
  console.error('❌ [1/8] Auth routes failed:', error.message);
}

// Medicine routes
try {
  const medicineRoutes = require('./routes/medicines');
  app.use('/api/medicines', medicineRoutes);
  console.log('✅ [2/8] Medicine routes registered: /api/medicines');
} catch (error) {
  console.error('❌ [2/8] Medicine routes failed:', error.message);
}

// Appointment routes
try {
  const appointmentRoutes = require('./routes/appointments');
  app.use('/api/appointments', appointmentRoutes);
  console.log('✅ [3/8] Appointment routes registered: /api/appointments');
} catch (error) {
  console.error('❌ [3/8] Appointment routes failed:', error.message);
}

// Prescription routes
try {
  const prescriptionRoutes = require('./routes/prescriptions');
  app.use('/api/prescriptions', prescriptionRoutes);
  console.log('✅ [4/8] Prescription routes registered: /api/prescriptions');
} catch (error) {
  console.error('❌ [4/8] Prescription routes failed:', error.message);
}

// Health tips routes
try {
  const healthTipRoutes = require('./routes/healthTips');
  app.use('/api/health-tips', healthTipRoutes);
  console.log('✅ [5/8] Health tips routes registered: /api/health-tips');
} catch (error) {
  console.error('❌ [5/8] Health tips routes failed:', error.message);
}

// Advertisement routes
try {
  const advertisementRoutes = require('./routes/advertisements');
  app.use('/api/advertisements', advertisementRoutes);
  console.log('✅ [6/8] Advertisement routes registered: /api/advertisements');
} catch (error) {
  console.error('❌ [6/8] Advertisement routes failed:', error.message);
}

// Feedback routes
try {
  const feedbackRoutes = require('./routes/feedback');
  app.use('/api/feedback', feedbackRoutes);
  console.log('✅ [7/8] Feedback routes registered: /api/feedback');
} catch (error) {
  console.error('❌ [7/8] Feedback routes failed:', error.message);
}

// User routes
try {
  const userRoutes = require('./routes/users');
  app.use('/api/users', userRoutes);
  console.log('✅ [8/8] User routes registered: /api/users');
} catch (error) {
  console.error('❌ [8/8] User routes failed:', error.message);
}

console.log('\n✅ All routes registration attempted\n');

// 404 handler - MUST be after all routes
app.use((req, res) => {
  console.log(`⚠️  404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/medicines',
      'POST /api/medicines',
      'GET  /api/appointments',
      'POST /api/appointments',
      'GET  /api/prescriptions',
      'POST /api/prescriptions',
      'GET  /api/health-tips',
      'POST /api/health-tips',
      'GET  /api/advertisements',
      'POST /api/advertisements',
      'GET  /api/feedback',
      'POST /api/feedback',
      'GET  /api/users/admin/stats'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server first, then connect to MongoDB
const server = app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ API Base: http://localhost:${PORT}/api`);
  console.log('🚀 ========================================\n');
});

// Connect to MongoDB after server starts
(async () => {
  try {
    const connectDB = require('./config/db');
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    // Seed default data after successful connection
    try {
      const { seedDefaultData } = require('./utils/seedData');
      setTimeout(() => {
        seedDefaultData();
        console.log('✅ Default data seeding completed');
      }, 2000);
    } catch (error) {
      console.error('⚠️  Seed data function not available:', error.message);
    }
    
    // Start cron jobs after MongoDB is ready
    try {
      const { startCronJobs } = require('./utils/cronJobs');
      startCronJobs();
      console.log('✅ Cron jobs initialized for medicine & appointment reminders');
    } catch (error) {
      console.error('⚠️  Cron jobs not available:', error.message);
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('⚠️  Server is running but database is not connected');
    console.error('💡 Start MongoDB: net start MongoDB (Windows)');
    console.error('💡 Or run: mongod --dbpath="C:\\data\\db"');
  }
})();

// Handle unhandled promise rejections - DO NOT EXIT
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err.message);
  console.error('⚠️  Server continues running...');
});

// Handle uncaught exceptions - DO NOT EXIT
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err.message);
  console.error('⚠️  Server continues running...');
});

// Handle SIGTERM gracefully
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

// Handle CTRL+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});
