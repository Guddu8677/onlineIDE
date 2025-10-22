// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  data: { // Store project data (files, content, etc.)
    type: Object, // Flexible data structure
    default: {},
  },
}, { timestamps: true }); // Add timestamps

export default mongoose.models.Project || mongoose.model('Project', projectSchema);