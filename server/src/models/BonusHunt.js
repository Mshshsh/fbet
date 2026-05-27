const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BonusHuntSession = sequelize.define('BonusHuntSession', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  startAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalBet: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalWin: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: {
    type: DataTypes.ENUM('active', 'completed'),
    defaultValue: 'active',
  },
  startDate: { type: DataTypes.DATE, allowNull: true },
  endDate: { type: DataTypes.DATE, allowNull: true },
});

const BonusHuntSlot = sequelize.define('BonusHuntSlot', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sessionId: { type: DataTypes.INTEGER, allowNull: false },
  gameName: { type: DataTypes.STRING(100), allowNull: false },
  provider: { type: DataTypes.STRING(100), allowNull: true },
  betAmount: { type: DataTypes.FLOAT, allowNull: true },
  multiplier: { type: DataTypes.FLOAT, allowNull: true },
  winAmount: { type: DataTypes.FLOAT, allowNull: true },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
});

module.exports = { BonusHuntSession, BonusHuntSlot };
