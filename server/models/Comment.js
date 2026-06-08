import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  news: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: 500
  }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
