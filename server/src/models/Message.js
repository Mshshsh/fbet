const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.STRING(500), allowNull: false },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deletedById: { type: DataTypes.INTEGER, allowNull: true },
  mentions: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('mentions');
      try { return JSON.parse(raw); } catch { return []; }
    },
    set(val) {
      this.setDataValue('mentions', JSON.stringify(val || []));
    },
  },
});

module.exports = Message;
