// index.js
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const path = require('path');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// Servir la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});
