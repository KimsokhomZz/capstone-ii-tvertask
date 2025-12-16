const { where } = require("sequelize");
const { User, ProgressLog } = require("../models/index");

// GET /progress → fetch user stats (tasks completed, streak, XP, focus time)
exports.getProgressOverview = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: ProgressLog,
          attributes: ["task_completed", "streak", "xp_earned", "focus_time"],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      tasks_completed: user.ProgressLog.tasks_completed,
      streak: user.ProgressLog.streak,
      xp_earned: user.ProgressLog.xp_earned,
      focus_time: user.ProgressLog.focus_time,
    });
  } catch (error) {
    console.debug(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getTaskPerformance = async (req, res) => {
  const { userId } = req.body;

  try {
    const tasks = await User.findAll({
      where: { id: userId },
      include: [
        {
          model: ProgressLog,
          attributes: ["tasks_completed", "date"],
        },
      ],
      order: [[ProgressLog, "date", "ASC"]],
      limit: 100,
    });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAnalytic = async (req, res) => {
  const { userId } = req.body;

  try {
    const { count, rows } = await User.findAll({
      where: { id: userId },
      include: [
        {
          model: ProgressLog,
          attributes: ["task_completed", "streak", "focus_time"],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      tasks_completed: analytic.ProgressLog.tasks_completed,
      focus_time: analytic.ProgressLog.focus_time,
      streak: analytic.ProgressLog.streak,
    });
  } catch (error) {
    console.log(error);
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
