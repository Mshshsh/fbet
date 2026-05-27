const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  avatarCategory: { type: DataTypes.INTEGER, defaultValue: 1 },
  avatarNumber: { type: DataTypes.INTEGER, defaultValue: 1 },
  color: { type: DataTypes.STRING(30), defaultValue: '#00e257' },
  role: {
    type: DataTypes.ENUM('user', 'moderator', 'admin'),
    defaultValue: 'user',
  },
  vipLevel: { type: DataTypes.INTEGER, defaultValue: 0 },
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  isBanned: { type: DataTypes.BOOLEAN, defaultValue: false },
  isMuted: { type: DataTypes.BOOLEAN, defaultValue: false },
  lastSeen: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = User;
