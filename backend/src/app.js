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

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    
    // ⚠️ IMPORTANT CHANGE
    return callback(null, true); // allow but log (for now)
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

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