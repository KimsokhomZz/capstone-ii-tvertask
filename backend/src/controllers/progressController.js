const { where } = require("sequelize");
const User = require("../models/userModel");

// GET /progress → fetch user stats (tasks completed, streak, XP, focus time)
exports.getProgress = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findOne({
      where: { id: userId },
      include: ["ProgressLog"],
    });
    return res.status(200).json({
      success: true,
      tasks_completed: user.ProgressLog.tasks_completed,
      streak: user.ProgressLog.streak,
      xp_earned: user.ProgressLog.xp_earned,
      focus_time: user.ProgressLog.focus_time
    });
  } catch (error) {
    console.debug(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /achievements → fetch unlocked achievements
exports.getAchievements = async (req, res) => {
  const { userId } = req.body;

  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// GET /weekly-stats → fetch weekly task/focus time summaries
