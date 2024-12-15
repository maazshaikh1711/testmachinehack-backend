// routes/comment.js
const express = require('express');
const Comment = require('../models/Comment');
const { authenticateJWT } = require('../middleware/authenticateJWT');
const router = express.Router();

console.log("...........")
// Create a comment
router.post('/:postId', authenticateJWT, async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  try {
    const newComment = new Comment({
      user: req.user.id,
      post: postId,
      content,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

console.log('--------------')
// Get all comments for a post
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId }).populate('user', 'username'); // Populate user field with the username
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
