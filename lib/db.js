// // lib/db.js
// import mongoose from 'mongoose';
// import User from '../models/User'; // Import the User model
// import Project from '../models/Project'; // Import the Project model

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cipherstudio';

// async function dbConnect() {
//   try {
//     if (mongoose.connection.readyState >= 1) {
//       console.log('Already connected to MongoDB');
//       return;
//     }

//     await mongoose.connect(MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     throw error;
//   }
// }

// // User-related functions
// async function createUser(email, password) {
//   await dbConnect();
//   const user = new User({ email, password });
//   return user.save();
// }

// async function findUserByEmail(email) {
//   await dbConnect();
//   return User.findOne({ email });
// }

// // Project-related functions
// async function createProject(name, userId) {
//   await dbConnect();
//   const project = new Project({ name, userId, data: {} }); // Initialize 'data' to an empty object
//   return project.save();
// }

// async function getProjects() {
//   await dbConnect();
//   return Project.find();
// }

// async function getProjectById(id) {
//   await dbConnect();
//   return Project.findById(id);
// }

// async function updateProject(id, name, data, userId) {
//   await dbConnect();
//   return Project.findOneAndUpdate({ _id: id, userId: userId }, { name, data }, { new: true });
// }

// async function deleteProject(id, userId) {
//   await dbConnect();
//   return Project.findOneAndDelete({ _id: id, userId: userId });
// }

// export { dbConnect, createUser, findUserByEmail, createProject, getProjects, getProjectById, updateProject, deleteProject };



















// lib/db.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Import models AFTER connection
async function getUser() {
  await dbConnect();
  return mongoose.models.User || (await import('../models/User')).default;
}

async function getProject() {
  await dbConnect();
  return mongoose.models.Project || (await import('../models/Project')).default;
}

// User-related functions
async function createUser(email, password) {
  const User = await getUser();
  const user = new User({ email, password });
  return user.save();
}

async function findUserByEmail(email) {
  const User = await getUser();
  return User.findOne({ email });
}

// Project-related functions
async function createProject(name, userId) {
  const Project = await getProject();
  const project = new Project({ name, userId, data: {} });
  return project.save();
}

async function getProjects() {
  const Project = await getProject();
  return Project.find();
}

async function getProjectById(id) {
  const Project = await getProject();
  return Project.findById(id);
}

async function updateProject(id, name, data, userId) {
  const Project = await getProject();
  return Project.findOneAndUpdate(
    { _id: id, userId: userId },
    { name, data },
    { new: true }
  );
}

async function deleteProject(id, userId) {
  const Project = await getProject();
  return Project.findOneAndDelete({ _id: id, userId: userId });
}

export {
  dbConnect,
  createUser,
  findUserByEmail,
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};