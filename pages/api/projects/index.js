// pages/api/projects/index.js
import { getProjects, createProject } from '../../../lib/db';
import { verifyJWT } from '../../../middlewares/auth';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const projects = await getProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.error("Get projects API error:", error);
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  } else if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const decoded = verifyJWT(token);
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const { name } = req.body;
      const newProject = await createProject(name, decoded.userId);
      res.status(201).json(newProject);
    } catch (error) {
      console.error("Create project API error:", error);
      res.status(500).json({ message: 'Failed to create project' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default handler;