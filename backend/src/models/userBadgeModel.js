const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserBadge = sequelize.define("UserBadge", {
    earnedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ["user_id", "badge_id"] // ensures no duplicate badges per user
        }
    ],
    timestamps: false
});

module.exports = UserBadge;
