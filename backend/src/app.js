const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const path = require("path");

// routes register
const userRoutes = require("./routes/userRoutes");
const googleAuthRoutes = require("./controllers/googleController");
const facebookAuthRoutes = require("./controllers/facebookController");
// const authRoutes = require('./routes/authRoutes');
const taskRoutes = require("./routes/taskRoutes");
const pomodoroRoutes = require("./routes/pomodoroRoutes");

// for get all users testing
const { User } = require("./models");
const router = express.Router();

const app = express();

// CORS options for development
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ], // Add common dev ports
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
  credentials: true,
};

// Enable CORS
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Session configuration (required for passport)
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.use("/api/health", (req, res) => {
  res.status(200).send("OK");
});

// testing get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.use("/", router);

// Routes
app.use("/api/users", userRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/auth", facebookAuthRoutes);
// app.use('/api/auth', authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/pomodoro", pomodoroRoutes);

module.exports = app;
