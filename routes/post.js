const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const router = express.Router();

// Create new post
router.post('/', async (req, res) => {
  console.log("..........", req, req.user)
  const { caption, imageUrl } = req.body;

  if (!caption && !imageUrl) {
    return res.status(400).json({ error: 'Caption or image URL is required' });
  }

  try {
    const newPost = new Post({
      user: req.user.id, // Extracted from the JWT token
      caption,
      imageUrl,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: savedPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all posts
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username') // Populate the user field to include the username
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
