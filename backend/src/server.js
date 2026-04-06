const app = require("./app");
const { connectDB } = require("./db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("🚀 Starting server...");

    await connectDB();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🌍 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1); // VERY IMPORTANT (Render needs this)
  }
}

startServer();