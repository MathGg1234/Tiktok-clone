// routes/user.js
const express = require('express');
const { Video } = require('../models');
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

// Route par défaut pour /api/user
router.get('/', (req, res) => {
  res.status(200).json({ message: 'User API - Use /profile to get user profile information.' });
});

module.exports = router;
