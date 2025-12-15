const { fn, col, literal } = require("sequelize");
const ProgressLog = require("../models/progressLogModel");
const { User, UserXP } = require("../models");
const { Op } = require("sequelize");


// use xp_earned from ProgressLog to build leaderboard
// exports.getLeaderboard = async (req, res) => {
//   const page = parseInt(req.query.page) || 0;
//   const limit = parseInt(req.query.limit) || 10;
//   const offset = page * limit;

//   try {
//     const results = await ProgressLog.findAll({
//       attributes: [
//         "userId",
//         [fn("SUM", col("xp_earned")), "total_xp"],
//       ],
//       group: ["userId", "User.id", "User->UserXP.id"],
//       order: [[literal("total_xp"), "DESC"]],
//       limit,
//       offset,
//       include: [
//         {
//           model: User,
//           attributes: ["name", "avatarUrl"],
//           include: [
//             {
//               model: UserXP,
//               attributes: ["level"],
//             },
//           ],
//         },
//       ],
//     });

//     const leaderboard = results.map((row, idx) => ({
//       rank: offset + idx + 1,
//       name: row.User?.name || "Unknown",
//       xp: row.get("total_xp") || 0,
//       avatar: row.User?.avatarUrl || null,
//       level: row.User?.UserXP?.level || 1,
//     }));

//     res.status(200).json({ leaderboard });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };


exports.getLeaderboard = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const offset = page * limit;

  try {
    // fetch top users by total_xp from UserXP
    const rows = await UserXP.findAll({
      attributes: ["user_id", "total_xp", "level"],
      order: [["total_xp", "DESC"]],
      limit,
      offset,
      include: [{ model: User, attributes: ["id", "name", "avatarUrl"] }],
    });

    // determine ProgressLog FK + date column names (support multiple schemas)
    const fk = ProgressLog.rawAttributes?.userId ? "userId" : "user_id";
    const dateCol = ProgressLog.rawAttributes?.date
      ? "date"
      : ProgressLog.rawAttributes?.created_at
        ? "created_at"
        : "createdAt";

    // sum xp_earned for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const nextDay = new Date(startOfDay);
    nextDay.setDate(nextDay.getDate() + 1);

    const xpRows = await ProgressLog.findAll({
      attributes: [fk, [fn("SUM", col("xp_earned")), "xp_earned"]],
      where: {
        [dateCol]: { [Op.gte]: startOfDay, [Op.lt]: nextDay },
      },
      group: [fk],
      raw: true,
    });

    const xpMap = {};
    xpRows.forEach((r) => {
      const id = r[fk];
      xpMap[id] = Number(r.xp_earned ?? 0);
    });

    const leaderboard = rows.map((r, i) => {
      const uid = r.user_id ?? r.dataValues?.user_id ?? r.dataValues?.userId;
      return {
        rank: offset + i + 1,
        name: r.User?.name || "Unknown",
        xp: Number(r.total_xp ?? r.xp ?? 0),
        xpEarned: Number(xpMap[uid] ?? 0),
        avatar: r.User?.avatarUrl || null,
        level: Number(r.level ?? 1),
      };
    });

    return res.status(200).json({ leaderboard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
