import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { protect, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import { processAndSaveImage } from '../utils/imageProcessor.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.query.folder || 'uploads';
    const dest = folder.startsWith('/') ? folder.slice(1) : folder;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post('/profile', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let imageUrl = `/uploads/${req.file.filename}`;
    try {
      const result = await processAndSaveImage(req.file.path, { maxWidth: 400 });
      imageUrl = `/uploads/${result.webp}`;
    } catch (err) {
      console.error('Image processing failed:', err);
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: imageUrl },
      { new: true }
    );

    res.json({
      message: 'Profile picture uploaded successfully',
      avatar: imageUrl,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/blog-image', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let imageUrl = `/uploads/${req.file.filename}`;
    try {
      const result = await processAndSaveImage(req.file.path);
      imageUrl = `/uploads/${result.webp}`;
    } catch (err) {
      console.error('Image processing failed:', err);
    }

    res.json({
      message: 'Image uploaded successfully',
      image: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/site-asset', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const folder = req.query.folder || 'uploads';
    let imageUrl = `/${folder.replace(/\\/g, '/')}/${req.file.filename}`;
    try {
      const result = await processAndSaveImage(req.file.path);
      imageUrl = `/${folder.replace(/\\/g, '/')}/${result.webp}`;
    } catch (err) {
      console.error('Image processing failed:', err);
    }
    res.json({ message: 'Uploaded successfully', url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/blog-image/base64', protect, adminOnly, async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const ext = image.match(/^data:image\/(\w+);base64,/)?.[1] || 'jpg';
    const filename = `${uuidv4()}.${ext}`;
    
    const fs = await import('fs');
    fs.writeFileSync(path.join('uploads', filename), buffer);

    const filePath = path.join('uploads', filename);
    let imageUrl = `/uploads/${filename}`;
    try {
      const result = await processAndSaveImage(filePath);
      imageUrl = `/uploads/${result.webp}`;
    } catch (err) {
      console.error('Image processing failed:', err);
    }

    res.json({
      message: 'Image uploaded successfully',
      image: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum 5MB allowed.' });
    }
    return res.status(400).json({ message: error.message });
  }
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
});

export default router;
