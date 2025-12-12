const { UserXP, XPLog } = require("../models");
const { calculateLevel } = require("../utils/xpUtils");
const badgeService = require("./badgeService");
const streakService = require("./streakService");
const notificationService = require("./notificationService");

// function readXpFromRecord(rec) {
//     if (!rec) return 0;
//     if (typeof rec.xp === "number") return rec.xp;
//     if (typeof rec.total_xp === "number") return rec.total_xp;
//     // fallback to dataValues
//     return Number(rec.dataValues?.xp ?? rec.dataValues?.total_xp ?? 0) || 0;
// }

// function getLevelFromRecord(rec) {
//     return Number(rec.level ?? rec.dataValues?.level ?? 1) || 1;
// }

// module.exports = { readXpFromRecord, getLevelFromRecord };

// -------------------------------
// Helpers
// -------------------------------
function readXpFromRecord(rec) {
  if (!rec) return 0;
  if (typeof rec.xp === "number") return rec.xp;
  if (typeof rec.total_xp === "number") return rec.total_xp;

  return Number(rec.dataValues?.xp ?? rec.dataValues?.total_xp ?? 0) || 0;
}

function getLevelFromRecord(rec) {
  return Number(rec.level ?? rec.dataValues?.level ?? 1) || 1;
}

exports.readXpFromRecord = readXpFromRecord;
exports.getLevelFromRecord = getLevelFromRecord;

async function ensureUserXPRow(userId) {
  let userXP = await UserXP.findOne({ where: { user_id: userId } });

  if (!userXP) {
    const payload = { user_id: userId };

    if (UserXP.rawAttributes?.xp) payload.xp = 0;
    if (UserXP.rawAttributes?.total_xp) payload.total_xp = 0;
    if (UserXP.rawAttributes?.level) payload.level = 1;
    if (UserXP.rawAttributes?.pendingXP) payload.pendingXP = 0;

    userXP = await UserXP.create(payload);
  }

  return userXP;
}

// -------------------------------
// Main XP Add Function
// -------------------------------
exports.addXP = async ({ userId, amount, source = "xp_add" }) => {
  amount = Number(amount);
  if (!amount || amount <= 0)
    throw new Error("XP amount must be greater than 0");

  // Ensure row exists
  const userXP = await ensureUserXPRow(userId);

  // Read current XP + Level
  const currentXP = readXpFromRecord(userXP);
  const oldLevel = getLevelFromRecord(userXP);
  const newTotalXP = currentXP + amount;

  // Calculate level
  const { level, nextLevelXp } = calculateLevel(newTotalXP);
  const gainedLevel = level > oldLevel;

  // Save updates
  const updatePayload = { level };
  if (UserXP.rawAttributes?.xp) updatePayload.xp = newTotalXP;
  if (UserXP.rawAttributes?.total_xp) updatePayload.total_xp = newTotalXP;

  await userXP.update(updatePayload);

  // Log XP
  const logPayload = { amount, source };
  if (XPLog.rawAttributes?.user_id) logPayload.user_id = userId;
  else logPayload.userId = userId;

  await XPLog.create(logPayload);

  // Streak service (safe)
  try {
    await streakService.updateStrike(userId);
  } catch (err) {
    console.warn("streakService.updateStrike failed:", err.message);
  }

  // Badge evaluation
  const newBadges = (await badgeService.evaluateUser(userId)) || [];

  // Send notifications
  try {
    // Notify about XP gain
    await notificationService.notifyXpGain(userId, amount, source);

    // Notify about level up if it happened
    if (gainedLevel) {
      await notificationService.notifyLevelUp(userId, level);
    }
  } catch (err) {
    console.warn("Failed to send XP/Level notifications:", err.message);
  }

  return {
    xp: newTotalXP,
    level,
    gainedLevel,
    newBadges,
    nextLevelXp,
  };
};

// -------------------------------
// Claim Pending XP
// -------------------------------
exports.claimPendingXP = async (userId) => {
  const userXP = await ensureUserXPRow(userId);
  const pending = Number(userXP.pendingXP ?? 0);

  if (pending <= 0) {
    return {
      xp: readXpFromRecord(userXP),
      claimed: 0,
      level: getLevelFromRecord(userXP),
    };
  }

  // Reset pending XP before awarding
  await userXP.update({ pendingXP: 0 });

  const result = await exports.addXP({
    userId,
    amount: pending,
    source: "pending-claim",
  });

  return {
    ...result,
    claimed: pending,
  };
};

// -------------------------------
// Public Getter
// -------------------------------
exports.getUserXP = async (userId) => {
  const userXP = await ensureUserXPRow(userId);

  const xpVal = readXpFromRecord(userXP);
  const { level, nextLevelXp } = calculateLevel(xpVal);

  return {
    xp: xpVal,
    level,
    nextLevelXp,
  };
};

exports.getStatus = async (userId) => {
  const userXP = await UserXP.findOne({ where: { user_id: userId } });
  if (!userXP) throw new Error("User XP record not found");

  const xp = Number(userXP.total_xp ?? userXP.xp ?? 0);
  const pendingXP = Number(userXP.pendingXP ?? 0);

  const { level, nextLevelXp } = calculateLevel(xp);

  // progressPercent = (currentXP / XP required for next level)
  const progressPercent = Math.round(
    ((xp - calculateLevel(xp).prevLevelTotal) /
      (calculateLevel(xp).nextLevelTotal - calculateLevel(xp).prevLevelTotal)) *
      100
  );

  return {
    xp,
    level,
    nextLevelXp,
    pendingXP,
    progressPercent: Number.isFinite(progressPercent) ? progressPercent : 0,
  };
};

exports.getHistory = async (userId) => {
  const logs = await XPLog.findAll({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]],
  });

  return logs.map((log) => ({
    amount: log.amount,
    source: log.source,
    timestamp: log.createdAt,
  }));
};
