import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  text: {
    type: String,
    default: '',
    trim: true,
    maxlength: 500,
  },
  textHi: {
    type: String,
    default: '',
    trim: true,
    maxlength: 500,
  },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
