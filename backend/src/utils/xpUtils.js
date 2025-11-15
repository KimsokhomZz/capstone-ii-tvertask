function calculateLevel(totalXP) {
    return Math.floor(totalXP / 100) + 1;
}

function updateStreak(userXP) {
    const today = new Date().toDateString();
    const last = userXP.last_active_date ? new Date(userXP.last_active_date).toDateString() : null;

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

module.exports = { calculateLevel, updateStreak };
