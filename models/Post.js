const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, required: true }, // Caption for the post
    imageKey: { type: String, required: false }, // Optional image URL
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
