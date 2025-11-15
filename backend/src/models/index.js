const sequelize = require('../config/database');

// Import models    
const User = require('./userModel');
const Task = require('./taskModel');
const PomodoroSession = require('./pomodoroSessionModel');
const UserXP = require('./userXPModel');
const XPLog = require('./xpLogModel');


// USER → TASKS
User.hasMany(Task, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'user_id' });

// USER → POMODORO SESSIONS
User.hasMany(PomodoroSession, { foreignKey: 'user_id', onDelete: 'CASCADE' });
PomodoroSession.belongsTo(User, { foreignKey: 'user_id' });

// TASK → POMODORO SESSIONS
Task.hasMany(PomodoroSession, { foreignKey: 'task_id', onDelete: 'CASCADE' });
PomodoroSession.belongsTo(Task, { foreignKey: 'task_id' });

// USER → USER_XP (1:1)
User.hasOne(UserXP, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserXP.belongsTo(User, { foreignKey: 'user_id' });

// USER → XP_LOG (1:M)
User.hasMany(XPLog, { foreignKey: 'user_id', onDelete: 'CASCADE' });
XPLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    sequelize,
    User,
    Task,
    PomodoroSession,
    UserXP,
    XPLog
};