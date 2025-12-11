const { UserXP } = require("../models");
const notificationService = require("./notificationService");

exports.getUserStrike = async (userId) => {
  let xp = await UserXP.findOne({ where: { user_id: userId } });

  if (!xp) {
    xp = await UserXP.create({
      user_id: userId,
      total_xp: 0,
      level: 1,
      current_streak: 0,
      last_active_date: new Date(),
    });
  }

  return {
    currentStrike: xp.current_streak,
    lastUpdated: xp.last_active_date,
  };
};

exports.updateStrike = async (userId) => {
  let xp = await UserXP.findOne({ where: { user_id: userId } });

  if (!xp) {
    xp = await UserXP.create({
      user_id: userId,
      total_xp: 0,
      level: 1,
      current_streak: 1,
      last_active_date: new Date(),
    });

    return xp;
  }

  // Simple streak rule:
  // If user performed an action today → increase streak
  // If last action was yesterday → continue streak
  // If last action older → reset streak

  const now = new Date();
  const last = new Date(xp.last_active_date);

  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day → continue existing streak
    xp.current_streak += 1;
  } else if (diffDays === 1) {
    // Yesterday → streak continues
    xp.current_streak += 1;
  } else {
    // Lost streak → reset
    xp.current_streak = 1;
  }

  xp.last_active_date = now;

  await xp.save();

  // Notify on streak milestones (3, 7, 14, 30, etc.)
  const milestones = [3, 7, 14, 30, 60, 90, 100];
  if (milestones.includes(xp.current_streak)) {
    try {
      await notificationService.notifyStreakMilestone(
        xp.user_id,
        xp.current_streak
      );
    } catch (err) {
      console.warn(
        "Failed to send streak milestone notification:",
        err.message
      );
    }
  }

  return xp;
};
