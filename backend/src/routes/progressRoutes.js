const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

router.post("/", progressController.getProgressOverview);
router.post("/task-performance", progressController.getTaskPerformance);
router.post("/analytic", progressController.getAnalytic)
// router.get("/achievements", progressController.getAchievements);
// router.get("/weekly-stats", progressController.getWeek);

module.exports = router;
