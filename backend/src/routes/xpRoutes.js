const router = require("express").Router();
const xpController = require("../controllers/xpController");

router.post("/xp", xpController.addXP);
router.get("/xp", xpController.getXP);
router.get("/streak", xpController.getStreak);

module.exports = router;
