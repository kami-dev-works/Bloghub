import express from 'express';
import Advertisement from '../models/Advertisement.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const ads = await Advertisement.find({ isActive: true }).sort('-createdAt');
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const ads = await Advertisement.find().sort('-createdAt');
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const ad = await Advertisement.create(req.body);
    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/click', async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (!ad) return res.status(404).json({ message: 'Advertisement not found' });
    res.json({ clicks: ad.clicks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Advertisement not found' });
    res.json({ message: 'Advertisement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
