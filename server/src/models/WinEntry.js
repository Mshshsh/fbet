const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WinEntry = sequelize.define('WinEntry', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(100), allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  gameName: { type: DataTypes.STRING(100), allowNull: false },
  multiplier: { type: DataTypes.FLOAT, allowNull: true },
  winAmount: { type: DataTypes.FLOAT, allowNull: true },
  currency: { type: DataTypes.STRING(10), defaultValue: 'TRY' },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
});

module.exports = WinEntry;
