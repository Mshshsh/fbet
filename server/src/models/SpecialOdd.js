const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SpecialOdd = sequelize.define('SpecialOdd', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  odds: { type: DataTypes.FLOAT, allowNull: true },
  match: { type: DataTypes.STRING(200), allowNull: true },
  sport: { type: DataTypes.STRING(100), allowNull: true },
  bookmaker: { type: DataTypes.STRING(100), allowNull: true },
  expiresAt: { type: DataTypes.DATE, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = SpecialOdd;
