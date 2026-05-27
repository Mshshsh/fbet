const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BonusBuy = sequelize.define('BonusBuy', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  gameName: { type: DataTypes.STRING(100), allowNull: false },
  gameProvider: { type: DataTypes.STRING(100), allowNull: true },
  buyAmount: { type: DataTypes.FLOAT, allowNull: true },
  betAmount: { type: DataTypes.FLOAT, allowNull: true },
  multiplier: { type: DataTypes.FLOAT, allowNull: true },
  winAmount: { type: DataTypes.FLOAT, allowNull: true },
  date: { type: DataTypes.DATE, allowNull: true },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
  videoUrl: { type: DataTypes.STRING, allowNull: true },
  isHighlight: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = BonusBuy;
