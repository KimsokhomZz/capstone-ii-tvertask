const questService = require("../services/questService");

exports.getActiveQuests = async (req, res) => {
    try {
        const { userId } = req.query;
        const quests = await questService.getActiveQuests(userId);
        res.json({ success: true, data: quests });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.progressQuest = async (req, res) => {
    try {
        const { userId, questType, increment } = req.body;
        const quests = await questService.progressQuest(userId, questType, increment);
        res.json({ success: true, data: quests });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};