const User = require("./userModel");
const UserXP = require("./userXPModel");
const ProgressLog = require("./progressLogModel");
const PomodoroSession = require("./pomodoroSessionModel");
const Task = require("./taskModel");

User.hasOne(ProgressLog, {
  foreignKey: "userId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
ProgressLog.belongsTo(User, { foreignKey: "userId" });

User.hasOne(UserXP, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UserXP.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = { User, UserXP, ProgressLog, PomodoroSession, Task };
