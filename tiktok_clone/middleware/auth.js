// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header is missing or invalid.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Token has expired. Attempting to refresh...');
      res.status(401).json({ error: 'Token expired. Please refresh your session.' });
    } else {
      console.error('Error in authMiddleware:', error.message);
      res.status(401).json({ error: 'Please authenticate.' });
    }
  }
};

module.exports = authMiddleware;
