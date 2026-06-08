import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 300,
    default: '',
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
  redirectLink: {
    type: String,
    required: [true, 'Redirect link is required'],
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model('Advertisement', advertisementSchema);
