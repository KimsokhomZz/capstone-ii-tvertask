const { Notification } = require("../models");

/**
 * Notification Service - Helper functions to create notifications
 */

/**
 * Create a notification for a user
 */
const createNotification = async (
  userId,
  type,
  title,
  message,
  metadata = null
) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      type,
      title,
      message,
      metadata,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Notify user about XP gain
 */
const notifyXpGain = async (userId, xpAmount, reason) => {
  return createNotification(
    userId,
    "xp",
    "XP Earned! 🎉",
    `You earned ${xpAmount} XP for ${reason}!`,
    { xp_amount: xpAmount, reason }
  );
};

/**
 * Notify user about quest completion
 */
const notifyQuestComplete = async (userId, questName, questId, reward) => {
  return createNotification(
    userId,
    "quest",
    "Quest Completed! 🎯",
    `Congratulations! You completed "${questName}" and earned ${reward} XP!`,
    { quest_id: questId, quest_name: questName, reward }
  );
};

/**
 * Notify user about new badge
 */
const notifyBadgeEarned = async (userId, badgeName, badgeId) => {
  return createNotification(
    userId,
    "badge",
    "New Badge Earned! 🏆",
    `You unlocked the "${badgeName}" badge!`,
    { badge_id: badgeId, badge_name: badgeName }
  );
};

/**
 * Notify user about achievement
 */
const notifyAchievement = async (userId, achievementName, description) => {
  return createNotification(
    userId,
    "achievement",
    "Achievement Unlocked! 🏅",
    `${achievementName}: ${description}`,
    { achievement_name: achievementName }
  );
};

/**
 * Notify user about task completion
 */
const notifyTaskComplete = async (userId, taskTitle, taskId) => {
  return createNotification(
    userId,
    "task",
    "Task Completed! ✓",
    `Great job! You completed "${taskTitle}"`,
    { task_id: taskId, task_title: taskTitle }
  );
};

/**
 * Notify user about streak milestone
 */
const notifyStreakMilestone = async (userId, streakDays) => {
  return createNotification(
    userId,
    "streak",
    `${streakDays}-Day Streak! 🔥`,
    `Amazing! You've maintained a ${streakDays}-day streak. Keep it up!`,
    { streak_days: streakDays }
  );
};

/**
 * Notify user about level up
 */
const notifyLevelUp = async (userId, newLevel) => {
  return createNotification(
    userId,
    "xp",
    "Level Up! ⭐",
    `Congratulations! You've reached level ${newLevel}!`,
    { level: newLevel }
  );
};

module.exports = {
  createNotification,
  notifyXpGain,
  notifyQuestComplete,
  notifyBadgeEarned,
  notifyAchievement,
  notifyTaskComplete,
  notifyStreakMilestone,
  notifyLevelUp,
};
