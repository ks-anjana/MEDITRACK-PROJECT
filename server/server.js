const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

/* =========================================================
   ✅ SINGLE & CORRECT CORS CONFIG (FINAL)
========================================================= */

app.use(cors({
  origin: (origin, callback) => {
    // Allow Postman, curl, server-to-server
    if (!origin) return callback(null, true);

    // Allow localhost
    if (origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    // ✅ Allow ALL Vercel deployments (preview + prod)
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    console.error("❌ Blocked by CORS:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Preflight (VERY IMPORTANT)
app.options("*", cors());

/* =========================================================
   BODY PARSERS
========================================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   UPLOADS
========================================================= */

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "MediTrack API running",
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   ROUTES
========================================================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/medicines", require("./routes/medicines"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/prescriptions", require("./routes/prescriptions"));
app.use("/api/health-tips", require("./routes/healthTips"));
app.use("/api/advertisements", require("./routes/advertisements"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/users", require("./routes/users"));
app.use("/api/notifications", require("./routes/notifications"));

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* =========================================================
   DATABASE + CRON
========================================================= */

(async () => {
  try {
    const connectDB = require("./config/db");
    await connectDB();
    console.log("✅ MongoDB connected");

    try {
      const { seedDefaultData } = require("./utils/seedData");
      seedDefaultData();
    } catch {}

    try {
      const { startCronJobs } = require("./utils/cronJobs");
      startCronJobs();
    } catch {}
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
  }
})();

/* =========================================================
   SAFE SHUTDOWN
========================================================= */

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
