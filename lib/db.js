// lib/db.js
import mongoose from 'mongoose';
import User from '../models/User'; // Import the User model
import Project from '../models/Project'; // Import the Project model

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cipherstudio';

async function dbConnect() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('Already connected to MongoDB');
      return;
    }

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// User-related functions
async function createUser(email, password) {
  await dbConnect();
  const user = new User({ email, password });
  return user.save();
}

async function findUserByEmail(email) {
  await dbConnect();
  return User.findOne({ email });
}

// Project-related functions
async function createProject(name, userId) {
  await dbConnect();
  const project = new Project({ name, userId, data: {} }); // Initialize 'data' to an empty object
  return project.save();
}

async function getProjects() {
  await dbConnect();
  return Project.find();
}

async function getProjectById(id) {
  await dbConnect();
  return Project.findById(id);
}

async function updateProject(id, name, data, userId) {
  await dbConnect();
  return Project.findOneAndUpdate({ _id: id, userId: userId }, { name, data }, { new: true });
}

async function deleteProject(id, userId) {
  await dbConnect();
  return Project.findOneAndDelete({ _id: id, userId: userId });
}

export { dbConnect, createUser, findUserByEmail, createProject, getProjects, getProjectById, updateProject, deleteProject };