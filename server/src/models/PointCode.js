const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PointCode = sequelize.define('PointCode', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code:        { type: DataTypes.STRING(32), allowNull: false, unique: true },
  points:      { type: DataTypes.INTEGER, allowNull: false },
  maxUses:     { type: DataTypes.INTEGER, defaultValue: null },  // null = sınırsız
  usedCount:   { type: DataTypes.INTEGER, defaultValue: 0 },
  expiresAt:   { type: DataTypes.DATE, defaultValue: null },
  isActive:    { type: DataTypes.BOOLEAN, defaultValue: true },
  createdById: { type: DataTypes.INTEGER, allowNull: true },
});

module.exports = PointCode;
