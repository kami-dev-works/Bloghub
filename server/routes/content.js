import express from 'express';
import Blog from '../models/Blog.js';
import Service from '../models/Service.js';

const router = express.Router();

router.get('/content/blog/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || !blog.htmlContent) {
      return res.status(404).send('Content not found');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.send(blog.htmlContent);
  } catch (error) {
    res.status(500).send('Error loading content');
  }
});

router.get('/content/service/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service || !service.htmlContent) {
      return res.status(404).send('Content not found');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.send(service.htmlContent);
  } catch (error) {
    res.status(500).send('Error loading content');
  }
});

export default router;
