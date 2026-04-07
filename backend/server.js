const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // Bind to all interfaces for network access

connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`✅  Server running on http://${HOST}:${PORT}`);
  });
});
// restart
