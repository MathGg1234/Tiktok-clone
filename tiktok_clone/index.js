const express = require('express');
const sequelize = require('./config/database');
const { User, Video } = require('./models');  // Importe les modèles avec les associations
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const path = require('path');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});
