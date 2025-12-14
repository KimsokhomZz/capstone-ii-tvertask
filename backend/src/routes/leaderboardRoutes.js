const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

// router.post('/', leaderboardController.getLeaderboard);
router.get('/', leaderboardController.getLeaderboard);

module.exports = router;