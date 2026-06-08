import express from 'express';
import Notification from '../models/Notification.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let notification = await Notification.findOne();
    if (!notification) {
      notification = await Notification.create({ text: '' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const { text, textHi } = req.body;
    let notification = await Notification.findOne();
    if (notification) {
      notification.text = text || '';
      notification.textHi = textHi || '';
      await notification.save();
    } else {
      notification = await Notification.create({ text: text || '', textHi: textHi || '' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
