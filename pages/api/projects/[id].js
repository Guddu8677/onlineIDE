// pages/api/projects/[id].js
import { getProjectById, updateProject, deleteProject } from '../../../lib/db';
import { verifyJWT } from '../../../middlewares/auth';

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const project = await getProjectById(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json(project);
    } catch (error) {
      console.error("Get project by ID API error:", error);
      res.status(500).json({ message: 'Failed to fetch project' });
    }
  } else if (req.method === 'PUT') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const decoded = verifyJWT(token);
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const { name, data } = req.body; // Expecting 'name' and 'data' in the request body
      const updatedProject = await updateProject(id, name, data, decoded.userId);
      res.status(200).json(updatedProject);
    } catch (error) {
      console.error("Update project API error:", error);
      res.status(500).json({ message: 'Failed to update project' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const decoded = verifyJWT(token);
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      await deleteProject(id, decoded.userId);
      res.status(204).end(); // No content on successful deletion
    } catch (error) {
      console.error("Delete project API error:", error);
      res.status(500).json({ message: 'Failed to delete project' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default handler;