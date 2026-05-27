const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(process.env.DB_PATH || './database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite bağlantısı başarılı.');
    // alter:true SQLite'da backup tablo hatasına yol açabilir.
    // Sütun değişikliklerini DB'yi sıfırlayarak uygulayın.
    await sequelize.sync({ force: false });
    console.log('Veritabanı tabloları senkronize edildi.');
  } catch (err) {
    console.error('Veritabanı bağlantı hatası:', err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
