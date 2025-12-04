const express = require("express");
const router = express.Router();
const noteCtrl = require("../controllers/taskNoteController");

// If you use auth middleware, insert it e.g. `auth` between route and controller
router.get("/:taskId", noteCtrl.getNotesByTask);
router.post("/", noteCtrl.createNote);
router.put("/:id", noteCtrl.updateNote);
router.delete("/:id", noteCtrl.deleteNote);

module.exports = router;