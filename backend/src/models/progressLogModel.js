const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProgressLog = sequelize.define(
  "ProgressLog",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
