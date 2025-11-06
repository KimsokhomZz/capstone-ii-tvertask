const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserXP = sequelize.define(
  "UserXP",
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
    totalXP: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    currentStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastActiveDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = UserXP;
