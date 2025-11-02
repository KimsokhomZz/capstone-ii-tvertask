const sequelize = require('../config/database');
const User = require('./userModel');
const Task = require('./taskModel');
const PomodoroSession = require('./pomodoroSessionModel');

// Define associations
User.hasMany(Task, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(PomodoroSession, { foreignKey: 'user_id', onDelete: 'CASCADE' });
PomodoroSession.belongsTo(User, { foreignKey: 'user_id' });

Task.hasMany(PomodoroSession, { foreignKey: 'task_id', onDelete: 'CASCADE' });
PomodoroSession.belongsTo(Task, { foreignKey: 'task_id' });

module.exports = {
    sequelize,
    User,
    Task,
    PomodoroSession,
};