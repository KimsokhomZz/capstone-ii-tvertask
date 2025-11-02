const app = require('./src/app');
const { sequelize } = require('./src/models'); // exported sequelize from models/index.js
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// require models to register associations to make sure Sequelize knows about them
require('./src/models/index'); // loads src/models/index.js

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Connection failed:", err));

// Sync models with database (use alter instead of force to avoid data loss)
sequelize
  .sync({ force: true })
  .then(() => console.log("✅ Models synced"))
  .catch((err) => console.error("❌ Sync error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
