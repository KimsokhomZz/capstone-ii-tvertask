const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const profileController = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/check-email", authController.checkEmailAvailability);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Protected routes - Authentication
router.get("/me", protect, authController.getMe);
router.put("/change-password", protect, authController.changePassword);

// Protected routes - Profile Management
router.get("/profile", protect, profileController.getProfile);
router.put("/profile", protect, profileController.updateProfile);
router.post("/avatar", protect, profileController.uploadAvatar);
router.delete("/avatar", protect, profileController.removeAvatar);
router.get("/activity-stats", protect, profileController.getActivityStats);
router.get("/analytics-stats", protect, profileController.getAnalyticsStats);

// Protected routes - Stats and Activities
router.get("/stats", protect, profileController.getStats);
router.get("/detailed-stats", protect, profileController.getDetailedStats);
router.get("/activities", protect, profileController.getActivities);
router.get("/weekly-stats", protect, profileController.getWeeklyStats);

// Protected routes - Settings and Account Management
router.put("/settings", protect, profileController.updateSettings);
router.put("/deactivate-account", protect, profileController.deactivateAccount);
router.delete("/delete-account", protect, profileController.deleteAccount);

module.exports = router;
