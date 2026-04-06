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
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, same-origin requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      // ✅ Allowed origin - return headers
      return callback(null, true);
    }

    // ❌ NOT allowed origin - still return headers so browser receives proper rejection
    // This prevents silent failures; browser will block the response
    const error = new Error(`CORS policy violation: Origin ${origin} not allowed`);
    error.status = 403;
    console.warn("⚠️  CORS rejected:", origin, "| Allowed:", allowedOrigins);
    return callback(error);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false, // Explicitly handle preflight in middleware
  optionsSuccessStatus: 200, // For browsers that choke on 204
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