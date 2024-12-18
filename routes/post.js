const express = require('express');
const Post = require('../models/Post');
const { authenticateJWT } = require('../middleware/authenticateJWT');
const router = express.Router();

module.exports = (io) => {
  /**
   * @swagger
   * /api/v1/posts:
   *   post:
   *     summary: Create a new post
   *     tags: [Posts]
   *     description: This endpoint allows an authenticated user to create a new post with a caption and/or an image URL.
   *     security:
   *       - bearerAuth: []  # Uses JWT for authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               caption:
   *                 type: string
   *                 description: Caption for the post
   *               imageUrl:
   *                 type: string
   *                 description: Optional image URL for the post
   *             example:
   *               caption: "My first post"
   *               imageUrl: "http://example.com/image.jpg"
   *     responses:
   *       201:
   *         description: Post created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Post created successfully"
   *                 post:
   *                   type: object
   *                   properties:
   *                     user:
   *                       type: string
   *                       description: User ID
   *                     caption:
   *                       type: string
   *                     imageUrl:
   *                       type: string
   *                     createdAt:
   *                       type: string
   *                     updatedAt:
   *                       type: string
   *       400:
   *         description: Bad Request - Missing caption or image URL
   *       401:
   *         description: Unauthorized - Missing or invalid token
   *       500:
   *         description: Server error
   */
  // Create new post
  router.post('/', authenticateJWT, async (req, res) => {
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
        const populatedPost = await Post.findById(savedPost._id).populate('user', 'username');
        io.emit('newPost', populatedPost); // Emit the new post event to all clients
        res.status(201).json({ message: 'Post created successfully', post: populatedPost });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Server error' });
    }
  });

  /**
   * @swagger
   * /api/v1/posts:
   *   get:
   *     summary: Get all posts
   *     tags: [Posts]
   *     description: Fetch all posts from the database. This endpoint requires authentication.
   *     security:
   *       - bearerAuth: []  # Uses JWT for authentication
   *     responses:
   *       200:
   *         description: List of posts retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   user:
   *                     type: string
   *                     description: User ID who created the post
   *                   caption:
   *                     type: string
   *                   imageUrl:
   *                     type: string
   *                   createdAt:
   *                     type: string
   *                   updatedAt:
   *                     type: string
   *       401:
   *         description: Unauthorized - Missing or invalid token
   *       500:
   *         description: Server error
   */

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

  return router;
}
// module.exports = router;
