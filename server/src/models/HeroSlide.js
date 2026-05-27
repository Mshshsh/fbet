const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HeroSlide = sequelize.define('HeroSlide', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title:       { type: DataTypes.STRING(200), allowNull: true },
  subtitle:    { type: DataTypes.STRING(300), allowNull: true },
  imageUrl:    { type: DataTypes.STRING, allowNull: false },
  buttonText:  { type: DataTypes.STRING(80), allowNull: true },
  buttonLink:  { type: DataTypes.STRING, allowNull: true },
  order:       { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive:    { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = HeroSlide;
