import express from 'express';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:newsId', async (req, res) => {
  try {
    const comments = await Comment.find({ news: req.params.newsId })
      .populate('user', 'username avatar')
      .sort('-createdAt');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:newsId', protect, async (req, res) => {
  try {
    const comment = await Comment.create({
      user: req.user._id,
      news: req.params.newsId,
      content: req.body.content
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
