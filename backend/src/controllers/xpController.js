const xpService = require("../services/xpService");

exports.addXP = async (req, res) => {
    try {
        const { userId, xpAmount, source } = req.body;

        if (!userId || !xpAmount) {
            return res.status(400).json({ message: "userId and xpAmount are required" });
        }

        const result = await xpService.addXP({ userId, amount: xpAmount, source });

        return res.json({
            success: true,
            data: {
                xp: result.xp,
                gainedXp: xpAmount,          // frontend animation uses this
                level: result.level,
                gainedLevel: result.gainedLevel,
                nextLevelXp: result.nextLevelXp,
                newBadges: result.newBadges
            }
        });
    } catch (err) {
        console.error("Error adding XP:", err);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getXP = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const xpData = await xpService.getUserXP(userId);

        res.status(200).json(xpData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStatus = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }

        const result = await xpService.getStatus(userId);

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error("Error fetching XP status:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }

        const result = await xpService.getHistory(userId);

        res.status(200).json({ success: true, data: result });

    } catch (err) {
        console.error("Error fetching XP history:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};