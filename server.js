// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketio = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const server = app.listen(5000, () => {
      console.log('Server running on port 5000');
    });

const apiRoutes = require('./routes/api');
app.use('/api/v1', apiRoutes);


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
  