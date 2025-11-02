const express = require("express");
const router = express.Router();
const pomodoroController = require("../controllers/pomodoroController");

router.get("/", controller.getSessions);
router.post("/start", controller.startSession);
// router.patch("/:id/complete", controller.completeSession);

router.post("/complete", pomodoroController.completeSession);
router.post("/pause", pomodoroController.pauseSession);
router.post("/reset", pomodoroController.resetSession);

module.exports = router;
