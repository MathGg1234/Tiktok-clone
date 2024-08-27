// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = authMiddleware;
