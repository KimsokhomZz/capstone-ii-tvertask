const User = require("./userModel");
const ProgressLog = require("./progressLogModel");
const PomodoroSession = require("./pomodoroSessionModel");
const Task = require("./taskModel");

User.hasOne(ProgressLog, {
  foreignKey: "user_id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
ProgressLog.belongsTo(User);

module.exports = { User, ProgressLog, PomodoroSession, Task };
