import mongoose from 'mongoose';
const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 30,
    required: true,
  },
  message: {
    type: String,
    maxlength: 1000,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  selectedFile: {
    type: String,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postsSchema);
export default Post;
