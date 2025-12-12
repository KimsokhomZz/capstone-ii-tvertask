const Task = require("../models/taskModel");
const xpService = require("../services/xpService");
const notificationService = require("../services/notificationService");

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { user_id, title, description, focus_time, status } = req.body;
    const task = await Task.create({
      user_id,
      title,
      description,
      focus_time,
      status,
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
    const { title, description, focus_time, status } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.focus_time = focus_time ?? task.focus_time;
    task.status = status ?? task.status;
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

    // Get task details for notification
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.status !== "completed") {
      task.status = "completed";
      await task.save();
    }

    // call XP service
    await xpService.addXP({
      userId,
      amount: xp,
      source: "task",
      metadata: { taskId },
    });

    // Send task completion notification
    try {
      await notificationService.notifyTaskComplete(
        userId,
        task.title,
        taskId
      );
    } catch (err) {
      console.warn(
        "Failed to send task completion notification:",
        err.message
      );
    }

    res.status(200).json({ message: "Task completed and XP added." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
