const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tournament = sequelize.define('Tournament', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
  type: { type: DataTypes.STRING(50), defaultValue: 'genel' },
  startDate: { type: DataTypes.DATE, allowNull: true },
  endDate: { type: DataTypes.DATE, allowNull: true },
  prizePool: { type: DataTypes.STRING(200), allowNull: true },
  rules: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM('upcoming', 'active', 'ended'),
    defaultValue: 'upcoming',
  },
});

const TournamentEntry = sequelize.define('TournamentEntry', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tournamentId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  rank: { type: DataTypes.INTEGER, allowNull: true },
});

module.exports = { Tournament, TournamentEntry };
