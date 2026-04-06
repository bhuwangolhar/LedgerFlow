const app = require("./app");
const { connectDB } = require("./db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Server running on port ${PORT}`);
    }
  });
}

startServer();
