const { Op } = require("sequelize");
const User = require("../models/userModel");
const ProgressLog = require("../models/progressLogModel");
const { UserXP } = require("../models");

exports.getLeaderboard = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const offset = page * limit;

  try {
    const topUsers = await User.findAll({
      include: [
        {
          model: ProgressLog,
          attributes: ["xp_earned"],
          where: {
            xp_earned: { [Op.gt]: 0 },
          },
        },
      ],
      order: [[ProgressLog, "xp_earned", "DESC"]],
      limit,
      offset,
    });

    // Compute rank based on page offset
    const leaderboard = topUsers.map((user, index) => ({
      rank: offset + index + 1,
      user: user.name,
      xp_earned: user.ProgressLog?.xp_earned || 0,
    }));

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getUserXP = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const offset = page * limit;

  try {
    const topUserXPs = await User.findAll({
      attributes: ["id", "name", "avatarUrl"],
      include: [
        {
          model: UserXP,
          attributes: ["level", "currentStreak"],
          where: {
            currentStreak: { [Op.gt]: 0 },
          },
        },
      ],
      order: [[UserXP, "currentStreak", "DESC"]],
      limit,
      offset,
    });

    // Compute rank based on page offset
    const leaderboardXP = topUserXPs.map((user, index) => ({
      rank: offset + index + 1,
      user: user.name,
      currentStreak: user.UserXP?.currentStreak || 0,
    }));

    res.status(200).json({ success: true, leaderboardXP });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
