// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nutix', 'nutix', 'cW6BhVaB', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

module.exports = sequelize;
