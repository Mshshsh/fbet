const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CodeRedemption = sequelize.define('CodeRedemption', {
  id:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  codeId: { type: DataTypes.INTEGER, allowNull: false },
}, { updatedAt: false });

module.exports = CodeRedemption;
