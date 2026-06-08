import express from 'express';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sort = '-createdAt' } = req.query;
    const query = { isActive: true };
    if (category && category !== 'all') query.category = category;
    if (search) query.$text = { $search: search };
    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({
      services,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit), limit: parseInt(limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const services = await Service.find({ isActive: true })
      .sort('-rating')
      .limit(limit);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/like', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const userId = req.user._id.toString();
    const likeIndex = service.likes.findIndex((id) => id.toString() === userId);

    if (likeIndex > -1) {
      service.likes.splice(likeIndex, 1);
      await service.save();
      await User.findByIdAndUpdate(req.user._id, { $pull: { likedServices: service._id } });
      res.json({ likes: service.likes.length, liked: false });
    } else {
      service.likes.push(req.user._id);
      await service.save();
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { likedServices: service._id } });
      res.json({ likes: service.likes.length, liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) return res.status(404).json({ message: 'Service not found' });

    const userId = req.user._id.toString();
    const alreadyRated = service.ratedBy.some((id) => id.toString() === userId);

    if (alreadyRated) {
      return res.status(400).json({ message: 'You have already rated this service' });
    }

    const newRatingCount = service.ratingCount + 1;
    const newRating = (service.rating * service.ratingCount + rating) / newRatingCount;

    service.rating = Math.round(newRating * 10) / 10;
    service.ratingCount = newRatingCount;
    service.ratedBy.push(req.user._id);

    await service.save();
    res.json({ rating: service.rating, ratingCount: service.ratingCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/stats', protect, adminOnly, async (req, res) => {
  try {
    const { views, likes } = req.body;
    const updateData = {};

    if (typeof views === 'number' && views >= 0) {
      updateData.views = views;
    }

    if (Array.isArray(likes)) {
      updateData.likes = likes;
    }

    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const countWords = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    if (countWords(req.body.title) > 20) return res.status(400).json({ message: 'Title exceeds 20 word limit' });
    if (req.body.contentType !== 'html-only' && countWords(req.body.description) > 50) return res.status(400).json({ message: 'Description exceeds 50 word limit' });
    const data = { ...req.body };
    if (data.contentType === 'html-only') {
      data.description = '';
      data.image = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';
    }
    const service = await Service.create(data);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (countWords(req.body.title) > 20) return res.status(400).json({ message: 'Title exceeds 20 word limit' });
    if (req.body.contentType !== 'html-only' && countWords(req.body.description) > 50) return res.status(400).json({ message: 'Description exceeds 50 word limit' });
    const data = { ...req.body };
    if (data.contentType === 'html-only') {
      data.description = '';
      data.image = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';
    }
    const service = await Service.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
