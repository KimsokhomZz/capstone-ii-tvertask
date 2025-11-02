require("dotenv").config();
const app = require("./src/app");
const sequelize = require("./src/config/database");
const PORT = process.env.PORT || 3000;
//  const morgan = require('morgan');
// register models with Sequelize to make sure it knows about them
require("./src/models/userModel");
require("./src/models/taskModel");
require("./src/models/pomodoroSessionModel");

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Connection failed:", err));

// Sync models with database (use alter instead of force to avoid data loss)
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Models synced"))
  .catch((err) => console.error("❌ Sync error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
