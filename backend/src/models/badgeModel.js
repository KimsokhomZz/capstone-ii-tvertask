const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Badge = sequelize.define("Badge", {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING },
    icon: { type: DataTypes.STRING }
}, {
    timestamps: true
});

module.exports = Badge;