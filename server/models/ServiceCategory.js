import mongoose from 'mongoose';

const serviceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: 100
  },
  value: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  icon: {
    type: String,
    default: ''
  },
}, { timestamps: true });

export default mongoose.model('ServiceCategory', serviceCategorySchema);
