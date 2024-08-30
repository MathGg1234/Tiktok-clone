// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Vérifie si l'en-tête Authorization est présent et formaté correctement
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header is missing or invalid.' });
    }

    // Extrait le token en supprimant "Bearer "
    const token = authHeader.replace('Bearer ', '');

    // Vérifie et décode le token
    const decoded = jwt.verify(token, 'your_secret_key');

    // Cherche l'utilisateur correspondant à l'ID du token
    const user = await User.findByPk(decoded.id);

    // Si l'utilisateur n'est pas trouvé
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Attache l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error.message);
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = authMiddleware;
