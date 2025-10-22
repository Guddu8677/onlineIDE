// import { verifyPassword } from '../../../lib/auth';
// import { findUserByEmail } from '../../../lib/db';
// import { createJWT } from '../../../middlewares/auth';

// async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const { email, password } = req.body;

//   try {
//     const user = await findUserByEmail(email);
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const isValid = await verifyPassword(password, user.password);
//     if (!isValid) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = createJWT({ userId: user._id, email: user.email });

//     res.status(200).json({ token, user: { email: user.email } });
//   } catch (error) {
//     console.error("Login API error:", error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }

// export default handler;























// pages/api/auth/login.js
import { verifyPassword } from '../../../lib/auth';
import { findUserByEmail } from '../../../lib/db';
import { createJWT } from '../../../middlewares/auth';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = createJWT({ userId: user._id, email: user.email });

    res.status(200).json({ 
      token, 
      user: { email: user.email } 
    });
  } catch (error) {
    console.error("Login API error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
}