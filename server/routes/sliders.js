import express from 'express';
import mongoose from 'mongoose';
import Slider from '../models/Slider.js';
import Blog from '../models/Blog.js';
import Service from '../models/Service.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

function sanitizeItem(data) {
  const item = { ...data };
  if (!item.type || !['custom', 'blog', 'service'].includes(item.type)) {
    item.type = 'custom';
  }
  if (!item.blogId || !mongoose.Types.ObjectId.isValid(item.blogId)) {
    delete item.blogId;
  }
  if (!item.serviceId || !mongoose.Types.ObjectId.isValid(item.serviceId)) {
    delete item.serviceId;
  }
  return item;
}

const resolveItem = async (item) => {
  const base = { ...item };
  if (item.type === 'blog' && item.blogId) {
    const blog = await Blog.findById(item.blogId).lean();
    if (blog) {
      return {
        ...base,
        image: blog.image || item.image,
        title: blog.title,
        description: blog.description,
        category: blog.category,
        createdAt: blog.createdAt,
        views: blog.views,
        slug: blog.slug,
      };
    }
  }
  if (item.type === 'service' && item.serviceId) {
    const service = await Service.findById(item.serviceId).lean();
    if (service) {
      return {
        ...base,
        image: service.image || item.image,
        title: service.title,
        description: service.description,
        category: service.category,
        slug: service.slug,
      };
    }
  }
  return base;
};

router.get('/', async (req, res) => {
  try {
    const slider = await Slider.findOne({ isActive: true }).sort('-createdAt').lean();
    if (!slider) {
      return res.json({ items: [] });
    }
    const resolved = await Promise.all(
      (slider.items || []).sort((a, b) => a.order - b.order).map(resolveItem)
    );
    res.json({ items: resolved.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const sliders = await Slider.find().sort('-createdAt').lean();
    const result = await Promise.all(sliders.map(async (slider) => {
      const resolved = await Promise.all(
        (slider.items || []).sort((a, b) => a.order - b.order).map(resolveItem)
      );
      return { ...slider, items: resolved.filter(Boolean) };
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.items) {
      body.items = body.items.map(sanitizeItem);
    }
    const slider = await Slider.create(body);
    res.status(201).json(slider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.items) {
      body.items = body.items.map(sanitizeItem);
    }
    const slider = await Slider.findByIdAndUpdate(req.params.id, body, {
      new: true, runValidators: true,
    });
    if (!slider) return res.status(404).json({ message: 'Slider not found' });
    res.json(slider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id);
    if (!slider) return res.status(404).json({ message: 'Slider not found' });
    res.json({ message: 'Slider deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/items', protect, adminOnly, async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: 'Slider not found' });
    slider.items.push(sanitizeItem(req.body));
    await slider.save();
    res.status(201).json(slider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/items/:itemId', protect, adminOnly, async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: 'Slider not found' });
    const item = slider.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    Object.assign(item, sanitizeItem(req.body));
    await slider.save();
    res.json(slider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id/items/:itemId', protect, adminOnly, async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: 'Slider not found' });
    const item = slider.items.id(req.params.itemId);
    if (item && item.image && item.image.startsWith('/uploads/slider/')) {
      const fs = await import('fs');
      const fp = item.image.replace(/^\//, '');
      try { fs.unlinkSync(fp); } catch {}
      const parsed = fp.substring(0, fp.lastIndexOf('.')) || fp;
      try { fs.unlinkSync(parsed + '.webp'); } catch {}
      try { fs.unlinkSync(parsed + '.avif'); } catch {}
    }
    slider.items.pull(req.params.itemId);
    await slider.save();
    res.json(slider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get paginated blogs for slider item selection
router.get('/available-blogs', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { status: 'approved' };
    if (search) query.title = { $regex: search, $options: 'i' };
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select('title image category createdAt')
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({
      blogs,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit), limit: parseInt(limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get paginated services for slider item selection
router.get('/available-services', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { isActive: true };
    if (search) query.title = { $regex: search, $options: 'i' };
    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
      .select('title image category createdAt')
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({
      services,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit), limit: parseInt(limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
