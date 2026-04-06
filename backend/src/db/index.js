const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV !== 'production') {
      console.log("PostgreSQL connected");
    }
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDB };