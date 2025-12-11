const { Notification, User } = require("../models");
const { Op } = require("sequelize");

/**
 * Get all notifications for a user
 */
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { limit = 50, offset = 0, unreadOnly = false } = req.query;

    const whereClause = { user_id: userId };
    if (unreadOnly === "true") {
      whereClause.read = false;
    }

    const notifications = await Notification.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const unreadCount = await Notification.count({
      where: { user_id: userId, read: false },
    });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

/**
 * Get unread notification count
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const count = await Notification.count({
      where: { user_id: userId, read: false },
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
      error: error.message,
    });
  }
};

/**
 * Create a new notification
 */
exports.createNotification = async (req, res) => {
  try {
    const { user_id, type, title, message, metadata } = req.body;

    if (!user_id || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "user_id, type, title, and message are required",
      });
    }

    const notification = await Notification.create({
      user_id,
      type,
      title,
      message,
      metadata: metadata || null,
    });

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create notification",
      error: error.message,
    });
  }
};

/**
 * Mark notification(s) as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({
        success: false,
        message: "notificationIds array is required",
      });
    }

    const [updatedCount] = await Notification.update(
      { read: true },
      {
        where: {
          id: { [Op.in]: notificationIds },
          user_id: userId,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `${updatedCount} notification(s) marked as read`,
      updatedCount,
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
      error: error.message,
    });
  }
};

/**
 * Mark all notifications as read for a user
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const [updatedCount] = await Notification.update(
      { read: true },
      {
        where: {
          user_id: userId,
          read: false,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `${updatedCount} notification(s) marked as read`,
      updatedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

/**
 * Delete a notification
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.user_id;

    const notification = await Notification.findOne({
      where: { id, user_id: userId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.destroy();

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

/**
 * Delete all notifications for a user
 */
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deletedCount = await Notification.destroy({
      where: { user_id: userId },
    });

    res.status(200).json({
      success: true,
      message: `${deletedCount} notification(s) deleted`,
      deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete all notifications",
      error: error.message,
    });
  }
};
