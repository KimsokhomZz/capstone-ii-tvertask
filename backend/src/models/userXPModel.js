const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserXP = sequelize.define("UserXP", {
    user_id: { type: DataTypes.INTEGER },
    total_xp: { type: DataTypes.INTEGER, defaultValue: 0 },
    level: { type: DataTypes.INTEGER, defaultValue: 1 },
    current_streak: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_active_date: { type: DataTypes.DATE, allowNull: true }
}, {
    timestamps: false
});

module.exports = UserXP;