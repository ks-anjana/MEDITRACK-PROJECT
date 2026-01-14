const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

/* =========================================================
   ✅ CORS CONFIGURATION (CRITICAL FIX)
========================================================= */

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5001',
    'https://meditrack-project.vercel.app',
    'https://meditrack-project-insuqyov-anjanas-projects-6cd71d05.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors());

/* =========================================================
   BODY PARSERS
========================================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   UPLOADS DIRECTORY
========================================================= */

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Uploads directory created');
}

app.use('/uploads', express.static(uploadDir));

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MediTrack API is running',
    timestamp: new Date().toISOString()
  });
});

console.log('\n🔧 Registering API routes...\n');

/* =========================================================
   ROUTES
========================================================= */

try {
  app.use('/api/auth', require('./routes/authRoutes'));
  console.log('✅ [1/9] Auth routes registered');
} catch (e) {
  console.error('❌ Auth routes failed:', e.message);
}

try {
  app.use('/api/medicines', require('./routes/medicines'));
  console.log('✅ [2/9] Medicine routes registered');
} catch (e) {
  console.error('❌ Medicine routes failed:', e.message);
}

try {
  app.use('/api/appointments', require('./routes/appointments'));
  console.log('✅ [3/9] Appointment routes registered');
} catch (e) {
  console.error('❌ Appointment routes failed:', e.message);
}

try {
  app.use('/api/prescriptions', require('./routes/prescriptions'));
  console.log('✅ [4/9] Prescription routes registered');
} catch (e) {
  console.error('❌ Prescription routes failed:', e.message);
}

try {
  app.use('/api/health-tips', require('./routes/healthTips'));
  console.log('✅ [5/9] Health tips routes registered');
} catch (e) {
  console.error('❌ Health tips routes failed:', e.message);
}

try {
  app.use('/api/advertisements', require('./routes/advertisements'));
  console.log('✅ [6/9] Advertisement routes registered');
} catch (e) {
  console.error('❌ Advertisement routes failed:', e.message);
}

try {
  app.use('/api/feedback', require('./routes/feedback'));
  console.log('✅ [7/9] Feedback routes registered');
} catch (e) {
  console.error('❌ Feedback routes failed:', e.message);
}

try {
  app.use('/api/users', require('./routes/users'));
  console.log('✅ [8/9] User routes registered');
} catch (e) {
  console.error('❌ User routes failed:', e.message);
}

try {
  app.use('/api/notifications', require('./routes/notifications'));
  console.log('✅ [9/9] Notification routes registered');
} catch (e) {
  console.error('❌ Notification routes failed:', e.message);
}

console.log('\n✅ All routes registration attempted\n');

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    method: req.method
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error('❌ Global error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ API Base: /api`);
  console.log('🚀 ========================================\n');
});

/* =========================================================
   MONGODB + CRON JOBS
========================================================= */

(async () => {
  try {
    const connectDB = require('./config/db');
    await connectDB();
    console.log('✅ MongoDB connected');

    try {
      const { seedDefaultData } = require('./utils/seedData');
      setTimeout(seedDefaultData, 2000);
    } catch {}

    try {
      const { startCronJobs } = require('./utils/cronJobs');
      startCronJobs();
      console.log('✅ Cron jobs started');
    } catch {}

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  }
})();
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, Postman, curl
    if (!origin) return callback(null, true);

    // Allow localhost
    if (
      origin.startsWith('http://localhost')
    ) {
      return callback(null, true);
    }

    // ✅ Allow ALL Vercel preview + production domains
    if (
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }

    console.error('❌ Blocked by CORS:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Preflight
app.options('*', cors());

/* =========================================================
   SAFE SHUTDOWN
========================================================= */

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received');
  server.close(() => process.exit(0));
});
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://meditrack-project.vercel.app",
  "https://meditrack-project-59b0syv74-anjanas-projects-6cd71d05.vercel.app",
  "https://meditrack-project-insuqyov-anjanas-projects-6cd71d05.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow server-to-server, curl, postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// IMPORTANT: Preflight
app.options("*", cors());
