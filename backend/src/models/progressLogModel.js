const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProgressLog = sequelize.define(
  "ProgressLog",
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
    },
    tasks_completed: {
      type: DataTypes.INTEGER,
    },
    focus_time: {
      type: DataTypes.INTEGER,
    },
    steak: {
      type: DataTypes.INTEGER,
    },
    xp_earned: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ProgressLog;
