const app = require("./app");
const { connectDB } = require("./db");

const PORT = process.env.PORT || 5000;

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

async function startServer() {
  try {
    console.log("🚀 Starting server...");
    console.log(`   Node version: ${process.version}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`   PORT: ${PORT}`);
    console.log(`   DATABASE_URL set: ${!!process.env.DATABASE_URL}`);

    await connectDB();

    // Bind to 0.0.0.0 for Render/cloud platforms
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🌍 Server running on http://0.0.0.0:${PORT}`);
      console.log("✅ Application started successfully");
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error("❌ Failed to start server:");
    console.error("   Error:", error.message);
    console.error("   Stack:", error.stack);
    process.exit(1);
  }
}

startServer();