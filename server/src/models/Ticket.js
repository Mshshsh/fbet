const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
  prize: { type: DataTypes.STRING(200), allowNull: true },
  ticketCost: { type: DataTypes.INTEGER, defaultValue: 0 },
  maxTickets: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0 = sınırsız
  drawDate: { type: DataTypes.DATE, allowNull: true },
  winnerId: { type: DataTypes.INTEGER, allowNull: true },
  status: {
    type: DataTypes.ENUM('active', 'drawn', 'cancelled'),
    defaultValue: 'active',
  },
});

const TicketEntry = sequelize.define('TicketEntry', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ticketId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

module.exports = { Ticket, TicketEntry };
