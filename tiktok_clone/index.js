const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos'); // Assurez-vous que ce fichier est correctement configuré
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));


// Servir la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Lire les certificats SSL
const privateKey = fs.readFileSync('/etc/letsencrypt/live/nutix.fun/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/nutix.fun/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Synchroniser la base de données et démarrer le serveur HTTPS
sequelize.sync().then(() => {
    https.createServer(credentials, app).listen(443, () => {
        console.log('Server running on https://nutix.fun');
    });
});
