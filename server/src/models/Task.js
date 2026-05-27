const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  reward: { type: DataTypes.INTEGER, defaultValue: 0 },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
  type: {
    type: DataTypes.ENUM('daily', 'weekly', 'one-time'),
    defaultValue: 'one-time',
  },
  externalLink: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  expiresAt: { type: DataTypes.DATE, allowNull: true },
});

const TaskCompletion = sequelize.define('TaskCompletion', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  taskId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  completedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = { Task, TaskCompletion };
