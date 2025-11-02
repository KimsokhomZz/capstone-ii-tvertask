const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");


// routes register
const userRoutes = require("./routes/userRoutes");
const googleAuthRoutes = require("./controllers/googleController");
const facebookAuthRoutes = require("./controllers/facebookController");
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Use a specific origin for development to avoid wildcard issues
const corsOptions = {
  origin: '*', // allow all origins (development only)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', "X-Requested-With"],
  optionsSuccessStatus: 204,
};

// Enable CORS and preflight responses
app.use(cors(corsOptions));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Routes
app.use("/api/users", userRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/auth", facebookAuthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

module.exports = app;






