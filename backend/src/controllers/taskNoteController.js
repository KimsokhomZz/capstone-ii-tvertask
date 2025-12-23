const { Task, TaskNote } = require("../models");

/**
 * GET  /api/tasks/:taskId/notes
 */
exports.getNotesByTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const notes = await TaskNote.findAll({
            where: { task_id: taskId },
            order: [["createdAt", "DESC"]],
        });
        return res.json(notes);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/**
 * POST /api/notes
 * body: { task_id, text, tag?, user_id? }
 */
exports.createNote = async (req, res) => {
    try {
        const user_id = req.user?.id || req.body.user_id || null;
        const { task_id, text, tag } = req.body;

        if (!task_id || !text || text.trim() === "") {
            return res.status(400).json({ message: "task_id and text are required" });
        }

        const task = await Task.findByPk(task_id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const note = await TaskNote.create({ task_id, user_id, text, tag });
        return res.status(201).json(note);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/**
 * PUT /api/notes/:id
 * body: { text?, tag? }
 */
exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await TaskNote.findByPk(id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        // optional ownership check
        if (req.user && note.user_id && req.user.id !== note.user_id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updates = {};
        if (req.body.text !== undefined) updates.text = req.body.text;
        if (req.body.tag !== undefined) updates.tag = req.body.tag;

        await note.update(updates);
        return res.json(note);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/**
 * DELETE /api/notes/:id
 */
exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await TaskNote.findByPk(id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        // optional ownership check
        if (req.user && note.user_id && req.user.id !== note.user_id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await note.destroy();
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};