// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Hiiiiiiii')
})

// Register Route
router.post('/register', async (req, res) => {
  console.log('registering.........', req)
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
});

// Login Route
router.post('/login', async(req, res) => {
  const token = jwt.sign({ id: req.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});


module.exports = router;
