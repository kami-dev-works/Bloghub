import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js';
import uploadRoutes from './routes/upload.js';
import feedbackRoutes from './routes/feedback.js';
import adsRoutes from './routes/ads.js';
import notificationRoutes from './routes/notifications.js';
import serviceRoutes from './routes/services.js';
import serviceCategoryRoutes from './routes/serviceCategories.js';
import websiteSettingRoutes from './routes/websiteSettings.js';
import sitemapRoutes from './routes/sitemap.js';
import indexNowRoutes from './routes/indexnow.js';
import sliderRoutes from './routes/sliders.js';
import contentRoutes from './routes/content.js';
import { securityHeaders } from './middleware/security.js';
import { webpMiddleware } from './middleware/webp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

const isDev = process.env.NODE_ENV !== 'production';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 5000 : 200,
  message: { message: 'Too many requests, please try again later.' },
  skip: () => isDev,
});

if (isDev) {
  console.log('⚠️  Rate limiter disabled in development mode');
}

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', webpMiddleware, express.static(path.join(__dirname, 'uploads')));
app.use('/api', contentRoutes);
app.use(securityHeaders);

// Rate limit API routes
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-categories', serviceCategoryRoutes);
app.use('/api/website-settings', websiteSettingRoutes);
app.use('/api/sliders', sliderRoutes);
app.use('/api', sitemapRoutes);
app.use('/api', indexNowRoutes);

app.get('/api/health', async (req, res) => {
  let siteName = 'BlogHub';
  try {
    const WebsiteSetting = (await import('./models/WebsiteSetting.js')).default;
    const settings = await WebsiteSetting.findOne();
    if (settings?.siteName) siteName = settings.siteName;
  } catch (e) {}
  res.json({ status: 'ok', message: `${siteName} API is running` });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloghub';

const createDefaultAdmin = async () => {
  try {
    const User = (await import('./models/User.js')).default;
    
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (!existingAdmin) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin@123',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        bio: 'System Administrator',
        location: 'New York',
        notifications: { email: true, likes: true, comments: true }
      });
      
      console.log('✅ Default admin user created');
      console.log('   Email: admin@example.com');
      console.log('   Password: Admin@123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await createDefaultAdmin();
    try {
      const Blog = (await import('./models/Blog.js')).default;
      const count = await Blog.countDocuments({ shortId: { $exists: false } });
      if (count > 0) {
        const allBlogs = await Blog.find({ shortId: { $exists: false } });
        for (const n of allBlogs) {
          n.shortId = n._id.toString().slice(-8);
          await n.save();
        }
        console.log(`✅ Backfilled shortId for ${count} blog items`);
      }
    } catch (err) {
      console.error('Error backfilling shortIds:', err.message);
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
