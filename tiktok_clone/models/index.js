// models/index.js
const User = require('./User');
const Video = require('./Video');

// Définir les associations ici
User.hasMany(Video, { foreignKey: 'userId', as: 'videos' });

module.exports = { User, Video };
