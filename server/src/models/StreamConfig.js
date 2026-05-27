const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StreamConfig = sequelize.define('StreamConfig', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  platform: {
    type: DataTypes.ENUM('twitch', 'youtube', 'kick', 'other'),
    defaultValue: 'kick',
  },
  channelName: { type: DataTypes.STRING(100), allowNull: true },
  embedUrl: { type: DataTypes.STRING, allowNull: true },
  isLive: { type: DataTypes.BOOLEAN, defaultValue: false },
  updatedById: { type: DataTypes.INTEGER, allowNull: true },
});

module.exports = StreamConfig;
