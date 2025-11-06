const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

router.post("/", progressController.getProgress);
// router.get("/achievements", progressController.getAchievements);
// router.get("/weekly-stats", progressController.getWeek);

module.exports = router;
