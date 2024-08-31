// routes/user.js
const express = require('express');
const { Video } = require('../models');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Route pour récupérer les informations du profil utilisateur
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = req.user; // Utilise l'utilisateur déjà récupéré par le middleware

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Récupère les vidéos associées à l'utilisateur
    const videos = await Video.findAll({
      where: { userId: user.id },
      attributes: ['id', 'description', 'videoUrl'],
    });

    // Envoi des informations utilisateur avec les vidéos associées
    res.json({
      id: user.id,
      username: user.username,
      profilePicture: user.profilePicture || '/images/default-profile.png',
      followers: 120, // Ce chiffre pourrait être calculé dynamiquement si un système de suivi est implémenté
      posts: videos.map(video => ({
        id: video.id,
        description: video.description,
        imageUrl: `/${video.videoUrl}`, // Chemin pour accéder à la vidéo
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Configurer multer pour stocker les images dans 'photoUtilisateur'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'photoUtilisateur/'); // Dossier où les images seront stockées
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nom unique pour éviter les conflits
  }
});

const upload = multer({ storage });

// Route pour télécharger et mettre à jour la photo de profil
router.post('/upload/profile-picture', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  try {
    const user = req.user;
    const profilePicturePath = `/photoUtilisateur/${req.file.filename}`; // Chemin relatif de l'image

    // Mettre à jour le chemin de la photo de profil dans la base de données
    await User.update({ profilePicture: profilePicturePath }, { where: { id: user.id } });

    res.json({ message: 'Photo de profil mise à jour avec succès.', profilePicture: profilePicturePath });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la photo de profil.' });
  }
});


// Route par défaut pour /api/user
router.get('/', (req, res) => {
  res.status(200).json({ message: 'User API - Use /profile to get user profile information.' });
});

module.exports = router;
