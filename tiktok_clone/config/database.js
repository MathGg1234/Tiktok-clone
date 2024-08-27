// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tiktok_clone', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

module.exports = sequelize;
