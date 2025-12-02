const express = require("express");
const router = express.Router();
const questController = require("../controllers/questController");

router.get("/active", questController.getActiveQuests);
router.post("/progress", questController.progressQuest);

module.exports = router;