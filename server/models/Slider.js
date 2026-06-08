import mongoose from 'mongoose';

const sliderItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['custom', 'blog', 'service'],
    required: true,
  },
  image: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  redirectLink: { type: String, default: '' },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  order: { type: Number, default: 0 },
}, { _id: true });

const sliderSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Main Slider',
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  items: [sliderItemSchema],
}, { timestamps: true });

sliderSchema.index({ isActive: 1, createdAt: -1 });

function collectItemFiles(items) {
  const files = [];
  for (const item of items) {
    if (item.image && item.image.startsWith('/uploads/slider/')) {
      const fp = item.image.replace(/^\//, '');
      files.push(fp);
      const parsed = fp.substring(0, fp.lastIndexOf('.')) || fp;
      files.push(parsed + '.webp');
      files.push(parsed + '.avif');
    }
  }
  return [...new Set(files)];
}

sliderSchema.pre('findOneAndDelete', async function(next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    if (doc && doc.items && doc.items.length > 0) {
      const fs = await import('fs');
      const files = collectItemFiles(doc.items);
      for (const f of files) {
        try { fs.unlinkSync(f); } catch {}
      }
    }
  } catch (e) {}
  next();
});

export default mongoose.model('Slider', sliderSchema);
