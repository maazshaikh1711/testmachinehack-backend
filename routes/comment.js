// routes/comment.js
const express = require('express');
const Comment = require('../models/Comment');
const { authenticateJWT } = require('../middleware/authenticateJWT');
const router = express.Router();


/**
 * @swagger
 * /api/v1/comments/{postId}:
 *   post:
 *     summary: Create a comment for a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad Request (missing content)
 *       500:
 *         description: Internal server error
 */

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


/**
 * @swagger
 * /api/v1/comments/{postId}:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Successfully fetched comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 */

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
