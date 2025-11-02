const Task = require('../models/taskModel');

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
        const task = await Task.create({ user_id, title, description, focus_time, status });
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
            return res.status(404).json({ message: 'Task not found' });
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
            return res.status(400).json({ message: 'Status is required' });
        }

        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status;
        await task.save();

        res.json({ message: 'Task status updated successfully', task });
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
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};