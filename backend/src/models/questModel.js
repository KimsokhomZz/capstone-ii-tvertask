const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Quest = sequelize.define("Quest", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("daily", "weekly", "combo", "custom"), allowNull: false },
    target: { type: DataTypes.INTEGER, allowNull: false }, // e.g., 3 Pomodoro, 5 tasks
    rewardXP: { type: DataTypes.INTEGER, defaultValue: 50 },
    emoji: { type: DataTypes.STRING, allowNull: true },   // optional cute emoji
    avatar: { type: DataTypes.STRING, allowNull: true }  // optional avatar
}, { timestamps: true });

module.exports = Quest;