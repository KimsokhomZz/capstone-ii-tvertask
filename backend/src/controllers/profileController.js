const User = require("../models/userModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/avatars");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `avatar-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// Get user profile with extended information
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user,
        profileCompleteness: calculateProfileCompleteness(user),
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, bio, location, website } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }

      const existingUser = await User.findOne({
        where: {
          email: email.toLowerCase(),
          id: { [require("sequelize").Op.ne]: userId },
        },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use by another account",
        });
      }
    }

    // Update user fields
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email.toLowerCase();
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (website !== undefined) updates.website = website;

    await user.update(updates);

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toJSON();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user: userWithoutPassword },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old avatar if exists
    if (user.avatarUrl) {
      const oldAvatarPath = path.join(
        __dirname,
        "../../uploads/avatars",
        path.basename(user.avatarUrl)
      );
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user with new avatar URL
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await user.update({ avatarUrl });

    res.json({
      success: true,
      message: "Avatar updated successfully",
      data: {
        avatarUrl,
        user: {
          ...user.toJSON(),
          avatarUrl,
        },
      },
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload avatar",
    });
  }
};

// Remove avatar
const removeAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete avatar file if exists
    if (user.avatarUrl) {
      const avatarPath = path.join(
        __dirname,
        "../../uploads/avatars",
        path.basename(user.avatarUrl)
      );
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Remove avatar URL from user
    await user.update({ avatarUrl: null });

    res.json({
      success: true,
      message: "Avatar removed successfully",
    });
  } catch (error) {
    console.error("Remove avatar error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove avatar",
    });
  }
};

// Get user statistics
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // This would typically query your task/pomodoro tables
    // For now, returning mock data
    const stats = {
      level: 5,
      xp: 2450,
      streak: 7,
      totalTasks: 45,
      completedTasks: 38,
      totalFocusTime: 1800, // in minutes
      weeklyStats: generateWeeklyStats(),
      achievements: generateAchievements(),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get stats",
    });
  }
};

// Get detailed stats
const getDetailedStats = async (req, res) => {
  try {
    const { period = "week" } = req.query;
    const userId = req.user.id;

    // This would typically query your analytics tables
    const detailedStats = {
      weeklyStats: generateWeeklyStats(),
      monthlyStats: generateMonthlyStats(),
      productivity: calculateProductivity(),
      goals: getUserGoals(),
    };

    res.json({
      success: true,
      data: detailedStats,
    });
  } catch (error) {
    console.error("Get detailed stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get detailed stats",
    });
  }
};

// Get user activities
const getActivities = async (req, res) => {
  try {
    const { filter = "all", page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    // This would typically query your activity log table
    // For now, returning mock data
    const activities = generateMockActivities();
    const filteredActivities = filterActivities(activities, filter);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        activities: paginatedActivities,
        totalCount: filteredActivities.length,
        totalPages: Math.ceil(filteredActivities.length / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get activities",
    });
  }
};

// Update user settings
const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Store settings in user preferences (you might want to create a separate settings table)
    const currentSettings = user.settings ? JSON.parse(user.settings) : {};
    const updatedSettings = { ...currentSettings, ...settings };

    await user.update({ settings: JSON.stringify(updatedSettings) });

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: { settings: updatedSettings },
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};

// Deactivate account
const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.update({
      isActive: false,
      deactivatedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate account",
    });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete avatar file if exists
    if (user.avatarUrl) {
      const avatarPath = path.join(
        __dirname,
        "../../uploads/avatars",
        path.basename(user.avatarUrl)
      );
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Soft delete - you might want to anonymize data instead
    await user.update({
      deletedAt: new Date(),
      email: `deleted_${userId}@questify.com`,
      name: "Deleted User",
    });

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

// Helper functions
const calculateProfileCompleteness = (user) => {
  let completeness = 0;
  const fields = ["name", "email", "bio", "avatarUrl", "location"];

  fields.forEach((field) => {
    if (user[field] && user[field].trim() !== "") {
      completeness += 20;
    }
  });

  return completeness;
};

const generateWeeklyStats = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    tasks: Math.floor(Math.random() * 10),
    focusTime: Math.floor(Math.random() * 120),
  }));
};

const generateMonthlyStats = () => {
  // Generate stats for last 30 days
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    tasks: Math.floor(Math.random() * 15),
    focusTime: Math.floor(Math.random() * 180),
  }));
};

const calculateProductivity = () => {
  return {
    weeklyAverage: 85,
    monthlyTrend: "up",
    bestDay: "Tuesday",
    peakHour: "10:00 AM",
  };
};

const getUserGoals = () => {
  return [
    { name: "Daily Tasks", current: 5, target: 8, type: "daily" },
    { name: "Weekly Focus Time", current: 420, target: 600, type: "weekly" },
    { name: "Monthly Streak", current: 15, target: 30, type: "monthly" },
  ];
};

const generateAchievements = () => {
  return [
    {
      id: "first_task",
      name: "First Steps",
      description: "Complete your first task",
      icon: "🎯",
      unlocked: true,
      unlockedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "week_streak",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      unlocked: true,
      unlockedAt: "2024-01-22T10:00:00Z",
    },
    {
      id: "task_master",
      name: "Task Master",
      description: "Complete 50 tasks",
      icon: "🏆",
      unlocked: false,
    },
  ];
};

const generateMockActivities = () => {
  const activities = [];
  const types = [
    "task_completed",
    "task_created",
    "pomodoro_completed",
    "level_up",
    "achievement_unlocked",
  ];

  for (let i = 0; i < 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    activities.push({
      id: `activity_${i}`,
      type,
      title: getActivityTitle(type),
      description: getActivityDescription(type),
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      metadata: getActivityMetadata(type),
    });
  }

  return activities;
};

const getActivityTitle = (type) => {
  const titles = {
    task_completed: "Task Completed",
    task_created: "New Task",
    pomodoro_completed: "Focus Session",
    level_up: "Level Up!",
    achievement_unlocked: "Achievement Unlocked",
  };
  return titles[type];
};

const getActivityDescription = (type) => {
  const descriptions = {
    task_completed: 'Completed "Study for exam"',
    task_created: 'Created "Finish project"',
    pomodoro_completed: "Completed a 25-minute focus session",
    level_up: "Reached level 6",
    achievement_unlocked: 'Earned "Task Master" achievement',
  };
  return descriptions[type];
};

const getActivityMetadata = (type) => {
  const metadata = {
    task_completed: { taskName: "Study for exam", xpGained: 50 },
    task_created: { taskName: "Finish project" },
    pomodoro_completed: { pomodoroCount: 1, xpGained: 25 },
    level_up: { level: 6 },
    achievement_unlocked: { achievementName: "Task Master" },
  };
  return metadata[type];
};

const filterActivities = (activities, filter) => {
  if (filter === "all") return activities;

  const filterMap = {
    tasks: ["task_completed", "task_created"],
    pomodoro: ["pomodoro_completed"],
    achievements: ["achievement_unlocked"],
    level_ups: ["level_up"],
  };

  return activities.filter((activity) =>
    filterMap[filter]?.includes(activity.type)
  );
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar: [upload.single("avatar"), uploadAvatar],
  removeAvatar,
  getStats,
  getDetailedStats,
  getActivities,
  updateSettings,
  deactivateAccount,
  deleteAccount,
};
