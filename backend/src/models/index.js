const sequelize = require("../config/database");

// Import models
const User = require("./userModel");
const Task = require("./taskModel");
const PomodoroSession = require("./pomodoroSessionModel");
const UserXP = require("./userXPModel");
const XPLog = require("./xpLogModel");
const Badge = require("./badgeModel");
const UserBadge = require("./userBadgeModel");
const UserQuest = require("./userQuestModel");
const Quest = require("./questModel");
const ProgressLog = require("./progressLogModel");
const TaskNote = require("./taskNoteModel");
const Notification = require("./notificationModel");

// USER → TASKS
User.hasMany(Task, { foreignKey: "user_id", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "user_id" });

// USER → POMODORO SESSIONS
User.hasMany(PomodoroSession, { foreignKey: "user_id", onDelete: "CASCADE" });
PomodoroSession.belongsTo(User, { foreignKey: "user_id" });

// TASK → POMODORO SESSIONS
Task.hasMany(PomodoroSession, { foreignKey: "task_id", onDelete: "CASCADE" });
PomodoroSession.belongsTo(Task, { foreignKey: "task_id" });

// TASK → TASK NOTES
Task.hasMany(TaskNote, { foreignKey: "task_id", onDelete: "CASCADE" });
TaskNote.belongsTo(Task, { foreignKey: "task_id" });

// USER → USER_XP (1:1)
User.hasOne(UserXP, { foreignKey: "user_id", onDelete: "CASCADE" });
UserXP.belongsTo(User, { foreignKey: "user_id" });

// USER → XP_LOG (1:M)
User.hasMany(XPLog, { foreignKey: "user_id", onDelete: "CASCADE" });
XPLog.belongsTo(User, { foreignKey: "user_id" });

// USER → BADGES (M:N)
User.belongsToMany(Badge, { through: UserBadge, foreignKey: "user_id" });
Badge.belongsToMany(User, { through: UserBadge, foreignKey: "badge_id" });

// USER → USER_QUESTS (M:N)
User.hasMany(UserQuest, { foreignKey: "userId" });
UserQuest.belongsTo(User, { foreignKey: "userId" });

Quest.hasMany(UserQuest, { foreignKey: "questId" });
UserQuest.belongsTo(Quest, { foreignKey: "questId" });

// User.hasOne(ProgressLog, {
//   foreignKey: "userId",
// });
// ProgressLog.belongsTo(User, { foreignKey: "userId" });

User.hasMany(TaskNote, { foreignKey: "user_id" });
TaskNote.belongsTo(User, { foreignKey: "user_id" });

// USER → NOTIFICATIONS
User.hasMany(Notification, { foreignKey: "user_id", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "user_id" });

// USER → PROGRESS LOGS
User.hasMany(ProgressLog, {
  foreignKey: "userId",
});
ProgressLog.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Task,
  PomodoroSession,
  UserXP,
  XPLog,
  Badge,
  UserBadge,
  Quest,
  UserQuest,
  ProgressLog,
  TaskNote,
  Notification,
};
