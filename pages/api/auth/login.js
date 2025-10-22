import { verifyPassword } from '../../../lib/auth';
import { findUserByEmail } from '../../../lib/db';
import { createJWT } from '../../../middlewares/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createJWT({ userId: user._id, email: user.email });

    res.status(200).json({ token, user: { email: user.email } });
  } catch (error) {
    console.error("Login API error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default handler;