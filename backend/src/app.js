const express = require("express");
const cors = require("cors");

require("./models");
const routes = require("./routes");

const app = express();

/**
 * ============================
 * CORS CONFIG (PRODUCTION SAFE)
 * ============================
 */

// Parse allowed origins from env
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(o => o.trim())
  : ["http://localhost:5173"];

// CORS configuration object
const corsOptions = {
  origin: allowedOrigins,  // simple array, no function needed
  credentials: false,       // JWT in header, no cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Apply CORS middleware - this handles preflight automatically
app.use(cors(corsOptions));

/**
 * ============================
 * MIDDLEWARE
 * ============================
 */

app.use(express.json());

/**
 * ============================
 * ROUTES
 * ============================
 */

app.use("/api", routes);

/**
 * ============================
 * HEALTH CHECK (OPTIONAL BUT USEFUL)
 * ============================
 */

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "LedgerFlow API running 🚀",
  });
});

/**
 * ============================
 * 404 ERROR HANDLER
 * (Must be after all routes)
 * ============================
 */
app.use((req, res) => {
  // CORS headers already applied by cors() middleware above
  // This ensures even 404s return proper CORS headers
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} does not exist`,
    tip: "Routes are under /api prefix (e.g., /api/auth/signup)",
  });
});

module.exports = app;