const { Sequelize } = require("sequelize");
require("dotenv").config();

// Use DATABASE_URL for production (Neon/Render) or fallback to individual vars for local dev
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  // Production: Use DATABASE_URL with SSL for Neon
  sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Local development: Use individual env vars
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: console.log
    }
  );
}

async function connectDB() {
  try {
    console.log("📡 Attempting database connection...");
    console.log(`   Using: ${databaseUrl ? "DATABASE_URL" : "individual env vars"}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");
  } catch (error) {
    console.error("❌ DB connection failed:");
    console.error("   Error name:", error.name);
    console.error("   Error message:", error.message);
    if (error.original) {
      console.error("   Original error:", error.original.message);
    }
    throw error; // Let server.js handle the exit
  }
}

module.exports = { sequelize, connectDB };