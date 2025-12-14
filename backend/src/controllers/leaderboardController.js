const { fn, col, literal } = require("sequelize");
const User = require("../models/userModel");
const ProgressLog = require("../models/progressLogModel");
const UserXP = require("../models/userXPModel");

exports.getLeaderboard = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const offset = page * limit;

  try {
    const results = await ProgressLog.findAll({
      attributes: [
        "userId",
        [fn("SUM", col("xp_earned")), "total_xp"],
      ],
      group: ["userId", "User.id", "User->UserXP.id"],
      order: [[literal("total_xp"), "DESC"]],
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ["name", "avatarUrl"],
          include: [
            {
              model: UserXP,
              attributes: ["level"],
            },
          ],
        },
      ],
    });

    const leaderboard = results.map((row, idx) => ({
      rank: offset + idx + 1,
      name: row.User?.name || "Unknown",
      xp: row.get("total_xp") || 0,
      avatar: row.User?.avatarUrl || null,
      level: row.User?.UserXP?.level || 1,
    }));

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
