const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MarketItem = sequelize.define('MarketItem', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
  pointCost: { type: DataTypes.INTEGER, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: -1 }, // -1 = sınırsız
  category: { type: DataTypes.STRING(50), defaultValue: 'bonus' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

const MarketTransaction = sequelize.define('MarketTransaction', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  itemId: { type: DataTypes.INTEGER, allowNull: false },
  pointsSpent: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'fulfilled', 'cancelled'),
    defaultValue: 'pending',
  },
});

module.exports = { MarketItem, MarketTransaction };
