const PomodoroSession = require("../models/pomodoroSessionModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");


/**
 * POST /api/pomodoro/start
 * body: { user_id, task_id, duration? (minutes) }
 */
exports.startSession = async (req, res) => {
  try {
    const { user_id, task_id, duration } = req.body;
    if (!user_id || !task_id) {
      return res.status(400).json({ success: false, message: "user_id and task_id are required" });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const task = await Task.findByPk(task_id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const session = await PomodoroSession.create({
      user_id,
      task_id,
      start_time: new Date(),
      end_time: null,
      duration: duration ?? 0,
      completed: false,
      xp_earned: 0,
      status: "active",
    });

    return res.status(201).json({ success: true, message: "Session started", data: session });
  } catch (error) {
    console.error("Error starting session:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * PATCH /api/pomodoro/:id/complete
 * marks session completed, sets end_time, computes duration (if not provided), adds xp
 */
// exports.completeSession = async (req, res) => {
//   try {
//     const sessionId = req.params.id;
//     const session = await PomodoroSession.findOne({ where: { id: sessionId } });

//     if (!session) {
//       return res.status(404).json({ success: false, message: "Pomodoro session not found" });
//     }

//     if (session.completed) {
//       return res.status(400).json({ success: false, message: "Session already completed" });
//     }

//     const endTime = new Date();
//     session.end_time = endTime;
//     // compute duration in minutes if start_time exists
//     if (session.start_time) {
//       const diffMs = new Date(endTime) - new Date(session.start_time);
//       session.duration = Math.max(0, Math.round(diffMs / 60000));
//     }
//     session.completed = true;
//     session.status = "completed";

//     // award XP on completion
//     session.xp_earned = (session.xp_earned || 0) + 5;

//     await session.save();

//     // If User model has an 'xp' column, increment user's total xp by 5
//     if (User.rawAttributes && User.rawAttributes.xp) {
//       await User.increment("xp", { by: 5, where: { id: session.user_id } });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Pomodoro session completed successfully",
//       data: session,
//     });
//   } catch (error) {
//     console.error("Error completing Pomodoro session:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

/**
 * GET /api/pomodoro?user_id=#
 * returns sessions for a user (or all sessions if user_id not provided)
 */
exports.getSessions = async (req, res) => {
  try {
    const { user_id } = req.query;
    const where = {};
    if (user_id) where.user_id = user_id;

    const sessions = await PomodoroSession.findAll({
      where,
      include: [
        { model: Task, attributes: ["id", "title", "user_id"] },
        // optionally include user: { model: User, attributes: ['id','name','email'] }
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.completeSession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await PomodoroSession.findOne({ where: { id: sessionId } });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Pomodoro session not found",
      });
    }

    session.xp_earned += 5; // Award 5 XP for completing the session
    await session.save();

    return res.status(200).json({
      success: true,
      message: "Pomodoro session completed successfully",
      data: session,
    });
  } catch (error) {
    console.error("Error completing Pomodoro session:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.pauseSession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await PomodoroSession.findOne({ where: { id: sessionId } });
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    if (session.completed)
      return res
        .status(400)
        .json({ success: false, message: "Cannot pause a completed session" });

    session.status = "paused";
    await session.save();

    return res
      .status(200)
      .json({ success: true, message: "Session paused", data: session });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.resetSession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await PomodoroSession.findOne({ where: { id: sessionId } });
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    session.status = "active";
    session.start_time = 0;
    session.end_time = 0;
    session.duration = 0;
    session.completed = false;

    await session.save();

    return res
      .status(200)
      .json({ success: true, message: "Session reset", data: session });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
