// models/Video.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Video = sequelize.define('Video', {
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Video.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Video, { foreignKey: 'userId' });

module.exports = Video;
