const express = require("express");
const router = express.Router();
const pomodoroController = require("../controllers/pomodoroController");

router.get("/", pomodoroController.getSessions);
router.post("/start", pomodoroController.startSession);

// router.patch("/:id/complete", pomodoroController.completeSession);
// router.post("complete", pomodoroController.pomodoroComplete);

router.post("/complete", pomodoroController.completeSession);
router.post("/pause", pomodoroController.pauseSession);
router.post("/reset", pomodoroController.resetSession);
router.post("/claim-xp", pomodoroController.claimPomodoroXP);

module.exports = router;
