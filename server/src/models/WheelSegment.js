const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WheelSegment = sequelize.define('WheelSegment', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  label:     { type: DataTypes.STRING(50), allowNull: false },
  points:    { type: DataTypes.INTEGER, allowNull: false },
  weight:    { type: DataTypes.INTEGER, defaultValue: 10 },  // ağırlık (olasılık)
  color:     { type: DataTypes.STRING(20), defaultValue: '#2a2008' },
  textColor: { type: DataTypes.STRING(20), defaultValue: '#c9a84c' },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive:  { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = WheelSegment;
