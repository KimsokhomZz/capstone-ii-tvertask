const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TaskNote = sequelize.define(
    "TaskNote",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: true }, // optional: who wrote it
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "Tasks", key: "id" },
            onDelete: "CASCADE",
        },
        text: { type: DataTypes.TEXT, allowNull: false },
    },
    { timestamps: true }
);

module.exports = TaskNote;