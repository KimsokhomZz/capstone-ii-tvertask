// Centralized badge evaluation logic.
// Exports evaluateUser(userId) -> returns array of newly-awarded badges (strings)
// Also exports badge rules metadata if you want to display requirements.

const { UserXP, XPLog } = require("../models"); // your sequelize models
const { readXpFromRecord, getLevelFromRecord } = require("./xpService");
const notificationService = require("./notificationService");

// Badge definitions (simple)
const BADGES = {
  STRIKE_MASTER: {
    id: "strike_master",
    title: "Strike Master",
    description: "Hit 3 consecutive strikes",
    check: async (userId, userXP) => {
      // prefer userXP.strike/strike_count else fallback to XPLog analysis
      const strike = Number(userXP?.strike ?? userXP?.streak ?? 0) || 0;
      return strike >= 3;
    },
  },

  TASK_HERO: {
    id: "task_hero",
    title: "Task Hero",
    description: "Complete 10 tasks",
    check: async (userId, userXP) => {
      // If you have counters on userXP, use them:
      const tasks =
        Number(userXP?.tasks_completed ?? userXP?.task_count ?? 0) || 0;
      if (tasks >= 10) return true;

      // Fallback: analyze XPLog `source === 'task'`
      const count = await XPLog.count({
        where: { user_id: userId, source: "task" },
      });
      return count >= 10;
    },
  },

  FOCUS_CHAMP: {
    id: "focus_champ",
    title: "Focus Champ",
    description: "Finish 5 Pomodoro sessions",
    check: async (userId, userXP) => {
      const pom = Number(userXP?.pomodoro_count ?? 0) || 0;
      if (pom >= 5) return true;
      const count = await XPLog.count({
        where: { user_id: userId, source: "pomodoro-complete" },
      });
      return count >= 5;
    },
  },

  LEVEL_ACHIEVER: {
    id: "level_achiever",
    title: "Level Achiever",
    description: "Reach level 5",
    check: async (userId, userXP) => {
      const level =
        Number(userXP?.level ?? userXP?.dataValues?.level ?? 1) || 1;
      return level >= 5;
    },
  },

  CONSISTENCY_KING: {
    id: "consistency_king",
    title: "Consistency King",
    description: "Maintain activity streaks",
    check: async (userId, userXP) => {
      const streak = Number(userXP?.streak ?? userXP?.strike ?? 0) || 0;
      return streak >= 7; // example: 7-day streak for this badge
    },
  },
};

// Helper: read existing badges from user record (if you store them)
async function getExistingBadges(userId) {
  // If you store badges in a user table, fetch them; else return [].
  // We'll try userXP.badges (array of ids) if present.
  const userXP = await UserXP.findOne({ where: { user_id: userId } });
  if (!userXP) return [];
  if (Array.isArray(userXP.badges)) return userXP.badges;
  // maybe stored as JSON string
  try {
    if (typeof userXP.badges === "string") {
      return JSON.parse(userXP.badges);
    }
  } catch (e) {
    // ignore parse errors
  }
  return [];
}

// Save badges back to user record (if you want)
async function persistBadges(userId, badges) {
  const userXP = await UserXP.findOne({ where: { user_id: userId } });
  if (!userXP) return;
  // write to badges if attribute exists
  if (UserXP.rawAttributes?.badges) {
    // store as JSON string or array per your model
    const isJsonCol =
      UserXP.rawAttributes.badges.type &&
      UserXP.rawAttributes.badges.type.key === "JSON";
    const payload = isJsonCol ? { badges } : { badges: JSON.stringify(badges) };
    await userXP.update(payload);
  }
}

// Main evaluation entry
async function evaluateUser(userId) {
  const userXP = await UserXP.findOne({ where: { user_id: userId } });
  const existing = await getExistingBadges(userId);

  const newlyAwarded = [];

  for (const ruleKey of Object.keys(BADGES)) {
    const rule = BADGES[ruleKey];
    const has = existing.includes(rule.id);
    try {
      const pass = await rule.check(userId, userXP);
      if (pass && !has) {
        newlyAwarded.push(rule.id);
        existing.push(rule.id);
      }
    } catch (err) {
      // log and continue
      console.error("Badge check error", rule.id, err);
    }
  }

  if (newlyAwarded.length > 0) {
    await persistBadges(userId, existing);

    // Notify about each new badge
    for (const badgeId of newlyAwarded) {
      const badge = Object.values(BADGES).find((b) => b.id === badgeId);
      if (badge) {
        try {
          await notificationService.notifyBadgeEarned(
            userId,
            badge.title,
            badge.id
          );
        } catch (err) {
          console.warn("Failed to send badge notification:", err.message);
        }
      }
    }
  }

  return newlyAwarded;
}

module.exports = {
  evaluateUser,
  BADGES,
};
