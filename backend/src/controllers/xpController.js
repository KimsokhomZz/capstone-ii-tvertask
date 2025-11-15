const { UserXP, XPLog } = require("../models");
const { calculateLevel, updateStreak } = require("../utils/xpUtils");

// POST /user/xp → add XP
exports.addXP = async (req, res) => {
    try {
        const { userId, amount, source } = req.body;

        let userXP = await UserXP.findOne({ where: { user_id: userId } });

        if (!userXP) {
            userXP = await UserXP.create({ user_id: userId });
        }

        userXP.total_xp += amount;
        userXP.level = calculateLevel(userXP.total_xp);

        updateStreak(userXP);
        await userXP.save();

        await XPLog.create({
            user_id: userId,
            source: source || "manual",
            amount,
            created_at: new Date()
        });

        res.json({
            message: "XP added successfully",
            total_xp: userXP.total_xp,
            level: userXP.level,
            streak: userXP.current_streak
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /user/xp → fetch XP + level
exports.getXP = async (req, res) => {
    try {
        const { userId } = req.query;

        const userXP = await UserXP.findOne({ where: { user_id: userId } });

        if (!userXP)
            return res.json({ total_xp: 0, level: 1 });

        res.json({
            total_xp: userXP.total_xp,
            level: userXP.level
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /user/streak → fetch streak
exports.getStreak = async (req, res) => {
    try {
        const { userId } = req.query;

        const userXP = await UserXP.findOne({ where: { user_id: userId } });

        if (!userXP)
            return res.json({ current_streak: 0 });

        res.json({
            streak: userXP.current_streak,
            last_active_date: userXP.last_active_date
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
