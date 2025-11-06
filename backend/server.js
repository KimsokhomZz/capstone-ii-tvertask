const app = require("./src/app");
const sequelize = require("./src/config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// register models with Sequelize to make sure it knows about them
const { User, ProgressLog, PomodoroSession, Task } = require("./src/models");

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Connection failed:", err));

// Sync models with database
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Models synced"))
  .catch((err) => console.error("❌ Sync error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
