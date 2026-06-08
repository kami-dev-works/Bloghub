import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    default: '',
    maxlength: 500
  },
  content: {
    type: String,
    default: ''
  },
  contentType: {
    type: String,
    enum: ['visual', 'text', 'html', 'html-only'],
    default: 'visual'
  },
  htmlContent: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    default: 'other'
  },
  price: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  shortId: {
    type: String,
    unique: true,
    sparse: true
  },
  seoTitles: [{ type: String, trim: true }],
  metaDescription: { type: String, default: '' },
  metaTitle: { type: String, default: '' },
  ogImage: { type: String, default: '' },
  canonicalUrl: { type: String, default: '' },
  keywords: [{ type: String, trim: true }],
  faq: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }]
}, { timestamps: true });

serviceSchema.index({ title: 'text', description: 'text' });
serviceSchema.index({ isActive: 1, createdAt: -1 });
serviceSchema.index({ isActive: 1, category: 1, createdAt: -1 });
serviceSchema.index({ isActive: 1, rating: -1 });
serviceSchema.index({ isActive: 1, isFeatured: -1, createdAt: -1 });
serviceSchema.index({ createdAt: -1 });

function generateShortId() {
  return Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 6);
}

serviceSchema.pre('save', function(next) {
  if (!this.shortId) {
    this.shortId = generateShortId();
  }
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '+') + '+' + this.shortId;
  }
  next();
});

export default mongoose.model('Service', serviceSchema);
