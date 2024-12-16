// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: "Register a new user"
 *     description: "This endpoint allows a user to register with a username and password."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "john_doe"
 *               password: "password123"
 *     responses:
 *       201:
 *         description: "User registered successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "User registered successfully"
 *       400:
 *         description: "Bad Request - Missing or incorrect data"
 */

// Register Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
});


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: "Login a user"
 *     description: "This endpoint allows a user to log in using their username and password and receive a JWT token."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "john_doe"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: "User logged in successfully and token generated"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *               example:
 *                 token: "your-jwt-token-here"
 *       401:
 *         description: "Unauthorized - Invalid username or password"
 *       400:
 *         description: "Bad Request - Missing data"
 */

// Login Route
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});


module.exports = router;
