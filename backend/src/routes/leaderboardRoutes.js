const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

router.post('/', leaderboardController.getLeaderboard);
router.post('/userXP', leaderboardController.getUserXP);

module.exports = router;