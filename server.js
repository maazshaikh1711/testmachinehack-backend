// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const passport = require('./config/passport');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type']
  }));

// Initialise Passport
app.use(passport.initialize());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//Listening to server
const server = app.listen(5000, () => {
      console.log('Server running on port 5000');
    });


//Add Routes    
const userAuthRoutes = require('./routes/userAuth');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

app.use('/api/v1/auth', userAuthRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);

// Socket.io setup
const io = socketio(server);

// Socket.io events
io.on('connection', socket => {
  console.log('New client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});


// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
  });