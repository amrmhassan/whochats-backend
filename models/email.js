import mongoose from 'mongoose';
import validator from 'validator';

const emailSchema = new mongoose.Schema({
  sentAt: {
    type: Date,
    default: Date.now(),
  },
  sender: {
    type: String,
    default: 'admin@natours.com',
    validate: [validator.isEmail, 'Should be a valid email'],
  },
  receiver: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Should be a valid email'],
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
});

const Email = mongoose.model('Email', emailSchema);
export default Email;
