// Dynamic XP calculation + streak system
const BASE_XP = 100;
const EXPONENT = 1.4;

// Total XP required to REACH a given level
function xpForLevel(level) {
    if (level <= 1) return 0;

    let total = 0;
    for (let i = 1; i < level; i++) {
        total += Math.round(BASE_XP * Math.pow(i, EXPONENT));
    }
    return total;
}

// Return { level, nextLevelXp }
function calculateLevel(totalXp) {
    let level = 1;

    // Increase level until next level requires too much XP
    while (xpForLevel(level + 1) <= totalXp) {
        level++;
        if (level > 1000) break; // safety
    }

    const prevLevelTotal = xpForLevel(level);
    const nextLevelTotal = xpForLevel(level + 1);
    const nextLevelXp = Math.max(0, nextLevelTotal - totalXp);

    return { level, nextLevelXp, prevLevelTotal, nextLevelTotal };
}

function updateStreak(userXP) {
    const today = new Date().toDateString();
    const last = userXP.last_active_date
        ? new Date(userXP.last_active_date).toDateString()
        : null;

    if (!last) {
        userXP.current_streak = 1;
    } else {
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (last === yesterday) {
            userXP.current_streak += 1;
        } else if (last !== today) {
            userXP.current_streak = 1;
        }
    }

    userXP.last_active_date = new Date();
    return userXP;
}

module.exports = {
    xpForLevel,
    calculateLevel,
    updateStreak,
    BASE_XP,
    EXPONENT
};

// function calculateLevel(xp) {
//     // in case : 100 XP per level
//     const level = Math.floor(xp / 100) + 1;
//     const nextLevelXp = level * 100;

//     return { level, nextLevelXp };
// };