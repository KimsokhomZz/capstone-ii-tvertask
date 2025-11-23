const streakService = require("../services/streakService");

exports.getStreak = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const streak = await streakService.getUserStrike(userId);

        res.status(200).json(streak);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
