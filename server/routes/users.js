import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await User.countDocuments();
    const users = await User.find()
      .select('-password')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/with-passwords', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await User.countDocuments();
    const users = await User.find()
      .select('+password')
      .sort({ role: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const usersWithPasswords = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      notifications: user.notifications,
      likedNews: user.likedNews,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.json({
      users: usersWithPasswords,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    const trendingBlogs = await Blog.find({ status: 'approved' })
      .sort('-views -likes.length')
      .limit(5)
      .populate('author', 'username');

    res.json({
      totalUsers,
      totalBlogs,
      totalViews: totalViews[0]?.total || 0,
      trendingBlogs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { username, bio, location, avatar, notifications } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, location, avatar, notifications },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/password', protect, adminOnly, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Password updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/liked', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'likedNews',
      populate: { path: 'author', select: 'username avatar' }
    });
    res.json(user.likedNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/like/:blogId', protect, async (req, res) => {
  try {
    const blogId = req.params.blogId;
    
    const likeIndex = user.likedNews.indexOf(blogId);
    
    if (likeIndex > -1) {
      user.likedNews.splice(likeIndex, 1);
    } else {
      user.likedNews.push(blogId);
    }
    await user.save();
    
    const blog = await Blog.findById(blogId);
    if (blog) {
      const likeIdx = blog.likes.indexOf(req.user._id);
      if (likeIdx > -1) {
        blog.likes.splice(likeIdx, 1);
      } else {
        blog.likes.push(req.user._id);
      }
      await blog.save();
    }
    
    res.json({ likedNews: user.likedNews, liked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
