const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SpinHistory = sequelize.define('SpinHistory', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:       { type: DataTypes.INTEGER, allowNull: false },
  reward:       { type: DataTypes.INTEGER, allowNull: false },
  segmentIndex: { type: DataTypes.INTEGER, allowNull: false },
}, { updatedAt: false });

module.exports = SpinHistory;
