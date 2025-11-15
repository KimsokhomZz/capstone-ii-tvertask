const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const XPLog = sequelize.define("XPLog", {
    user_id: { type: DataTypes.INTEGER },
    source: { type: DataTypes.STRING },
    amount: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE }
}, {
    timestamps: false
});

module.exports = XPLog;