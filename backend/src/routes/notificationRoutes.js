const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Get all notifications for a user
router.get("/:userId", notificationController.getUserNotifications);

// Get unread notification count
router.get("/:userId/unread-count", notificationController.getUnreadCount);

// Create a new notification
router.post("/", notificationController.createNotification);

// Mark specific notifications as read
router.patch("/:userId/mark-read", notificationController.markAsRead);

// Mark all notifications as read
router.patch("/:userId/mark-all-read", notificationController.markAllAsRead);

// Delete a notification
router.delete("/:id", notificationController.deleteNotification);

// Delete all notifications for a user
router.delete("/:userId/all", notificationController.deleteAllNotifications);

module.exports = router;
