// models/Video.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  // Import correct du modèle User

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

// Définir l'association avec le modèle User
Video.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Video;
