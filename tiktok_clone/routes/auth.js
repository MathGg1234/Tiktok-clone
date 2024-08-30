// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ id: user.id, username: user.username, email: user.email }); // Ne retourne pas le mot de passe
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ajout de logs pour vérifier ce qui se passe
    console.log('Trying to find user with email:', email);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.error('User not found with email:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.error('Invalid password for user:', email);
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route par défaut pour /api/auth
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Auth API - Use /register or /login for authentication.' });
});

module.exports = router;
