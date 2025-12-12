const { Quest, UserQuest } = require("../models");
const xpService = require("./xpService");
const notificationService = require("./notificationService");

async function getActiveQuests(userId) {
  return UserQuest.findAll({
    where: { userId },
    include: Quest,
  });
}

async function progressQuest(userId, questType, increment = 1) {
  const userQuests = await UserQuest.findAll({
    where: { userId, completed: false },
    include: { model: Quest, where: { type: questType } },
  });

  const updatedQuests = [];

  for (const uq of userQuests) {
    uq.progress += increment;

    // Complete quest if target reached
    if (uq.progress >= uq.Quest.target && !uq.completed) {
      uq.completed = true;
      uq.completedAt = new Date();

      // Grant XP through existing service
      await xpService.addXP({
        userId,
        amount: uq.Quest.rewardXP,
        source: "quest_completed",
      });

      // Notify about quest completion
      try {
        await notificationService.notifyQuestComplete(
          userId,
          uq.Quest.name || uq.Quest.title,
          uq.Quest.id,
          uq.Quest.rewardXP
        );
      } catch (err) {
        console.warn(
          "Failed to send quest completion notification:",
          err.message
        );
      }
    }

    await uq.save();
    updatedQuests.push(uq);
  }

  return updatedQuests;
}

module.exports = { getActiveQuests, progressQuest };
