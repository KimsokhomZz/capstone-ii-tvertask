const router = require("express").Router();
const xpController = require("../controllers/xpController");
const streakController = require("../controllers/streakController");;

router.post("/xp", xpController.addXP);
router.get("/xp", xpController.getXP);
router.get("/streak", streakController.getStreak);
router.get("/status", xpController.getStatus);
router.get("/history", xpController.getHistory);

module.exports = router;
