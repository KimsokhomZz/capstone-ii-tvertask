const PomodoroSession = require("../models/pomodoroSessionModel");
const xpService = require("../services/xpService");
const { UserXP, Task, User } = require("../models");


/**
 * POST /api/pomodoro/start
 * body: { user_id, task_id, duration? (minutes) }
 */
// Start session
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

// Pause session
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

// Reset session
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


// Complete session
exports.completeSession = async (req, res) => {
  try {
    const { sessionId, xp } = req.body;

    const session = await PomodoroSession.findOne({ where: { id: sessionId } });

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.completed) {
      return res.status(400).json({ success: false, message: "Session already completed" });
    }

    // --- 1. Update Session Data ---
    const endTime = new Date();
    session.end_time = endTime;

    if (session.start_time) {
      const diffMs = endTime - new Date(session.start_time);
      session.duration = Math.max(0, Math.round(diffMs / 60000)); // minutes
    }

    session.completed = true;
    session.status = "completed";
    session.xp_earned = xp;
    await session.save();

    // --- 2. Store XP as pending (no direct XP award) ---
    const userXP = await UserXP.findOne({ where: { user_id: session.user_id } });
    userXP.pendingXP += xp;
    await userXP.save();

    // --- 3. Log event in XP Service (source only, no XP increment) ---
    await XPLog.create({
      user_id: session.user_id,
      amount: xp,
      source: "pomodoro-complete"
    });

    return res.status(200).json({
      success: true,
      message: "Pomodoro completed. XP added to pending.",
      pendingXP: userXP.pendingXP,
      session
    });

  } catch (error) {
    console.error("Error completing Pomodoro:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Claim pending XP from pomodoros (reward popup)
exports.claimPomodoroXP = async (req, res) => {
  try {
    const { userId } = req.body;

    const userXP = await UserXP.findOne({ where: { user_id: userId } });
    if (!userXP) {
      return res.status(404).json({ message: "UserXP row not found." });
    }

    const pending = Number(userXP.pendingXP ?? 0);
    if (pending <= 0) {
      return res.status(400).json({ message: "No XP to claim." });
    }

    const amount = userXP.pendingXP;

    // reset pending XP
    userXP.pendingXP = 0;
    await userXP.save();

    // award XP using XP service
    await xpService.addXP({
      user_id: userId,
      amount,
      source: "pomodoro-claim"
    });

    res.status(200).json({
      message: "Pomodoro XP claimed.",
      awardedXP: amount
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
