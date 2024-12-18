const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
  const userWithSameUsername = await User.findOne({ username: this.username });
  if (userWithSameUsername && userWithSameUsername._id !== this._id) {
    const error = new Error('Username already exists');
    error.code = 11000; // MongoDB's duplicate key error code
    next(error);
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User; 