const Task = require("../models/taskModel");
const xpService = require("../services/xpService");
const notificationService = require("../services/notificationService");
const ProgressLog = require("../models/progressLogModel"); // ← ADD THIS
const { Op } = require("sequelize"); // ← ADD THIS

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user" });
    }
    const userId = req.user.id;
    const tasks = await Task.findAll({ where: { user_id: userId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { user_id, title, description, focus_time, status, short_break, long_break } = req.body;
    const task = await Task.create({
      user_id,
      title,
      description,
      focus_time,
      status,
      short_break,
      long_break,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, focus_time, status, short_break, long_break } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.focus_time = focus_time ?? task.focus_time;
    task.status = status ?? task.status;
    task.short_break = short_break ?? task.short_break;
    task.long_break = long_break ?? task.long_break;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update only the status of a task (PATCH)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    await task.save();

    res.json({ message: "Task status updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
exports.completeTask = async (req, res) => {
  try {
    const { userId, taskId, xp } = req.body;

    // Get task details
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Mark as completed
    if (task.status !== "completed") {
      task.status = "completed";
      await task.save();
    }

    // Award XP
    await xpService.addXP({
      userId,
      amount: xp,
      source: "task",
      metadata: { taskId },
    });

    // ✅ NEW: Update ProgressLog
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const nextDay = new Date(startOfDay);
      nextDay.setDate(nextDay.getDate() + 1);

      let progress = await ProgressLog.findOne({
        where: {
          userId,
          date: { [Op.gte]: startOfDay, [Op.lt]: nextDay },
        },
      });

      if (!progress) {
        // Create today's progress log
        await ProgressLog.create({
          userId,
          date: new Date(),
          tasks_completed: 1,
          focus_time: task.focus_time || 0,
          steak: 0,
          xp_earned: xp,
        });
      } else {
        // Update existing progress log
        await progress.increment({
          tasks_completed: 1,
          focus_time: task.focus_time || 0,
          xp_earned: xp,
        });
      }
    } catch (err) {
      console.warn("Failed to update ProgressLog:", err.message);
    }

    // Send notification
    try {
      await notificationService.notifyTaskComplete(userId, task.title, taskId);
    } catch (err) {
      console.warn("Failed to send task completion notification:", err.message);
    }

    res.status(200).json({ message: "Task completed and XP added." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
