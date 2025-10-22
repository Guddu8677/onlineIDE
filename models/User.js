// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Check if the model already exists before defining it
export default mongoose.models.User || mongoose.model('User', userSchema);