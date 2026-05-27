const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PinnedMessage = sequelize.define('PinnedMessage', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  content: { type: DataTypes.STRING(500), allowNull: false },
  pinnedById: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = PinnedMessage;
