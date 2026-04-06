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
  ? process.env.FRONTEND_URL.split(",")
      .map(origin => origin.trim().replace(/\/$/, "")) // remove trailing slash
  : ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    console.error("❌ CORS blocked:", origin);
    return callback(null, false); // don't throw error (preflight safe)
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

// Apply CORS
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

module.exports = app;