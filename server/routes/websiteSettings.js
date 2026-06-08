import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WebsiteSetting from '../models/WebsiteSetting.js';
import { protect, adminOnly } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let settings = await WebsiteSetting.findOne();
    if (!settings) {
      settings = await WebsiteSetting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', protect, adminOnly, async (req, res) => {
  try {
    let settings = await WebsiteSetting.findOne();
    if (!settings) {
      settings = new WebsiteSetting();
    }

    const oldLogo = settings.logo;
    const oldFavicon = settings.favicon;

    Object.keys(req.body).forEach(key => {
      if (key in settings) {
        settings[key] = req.body[key];
      }
    });
    await settings.save();

    const deleteFile = (url) => {
      if (url && (url.startsWith('/uploads/') || url.startsWith('/uploads/logo/') || url.startsWith('/uploads/favicon/'))) {
        const oldPath = path.join(__dirname, '..', url);
        try { if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } catch (e) {}
      }
    };

    if (oldLogo && oldLogo !== settings.logo) deleteFile(oldLogo);
    if (oldFavicon && oldFavicon !== settings.favicon) deleteFile(oldFavicon);

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
