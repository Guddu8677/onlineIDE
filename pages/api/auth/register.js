// // pages/api/auth/register.js
// import { hashPassword } from '../../../lib/auth';
// import { createUser } from '../../../lib/db';
// import { createJWT } from '../../../middlewares/auth';

// async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const { email, password } = req.body;

//   if (!email || !email.includes('@') || !password || password.trim().length < 7) {
//     return res.status(400).json({ message: 'Invalid input' });
//   }

//   try {
//     const hashedPassword = await hashPassword(password);
//     const newUser = await createUser(email, hashedPassword);
//     const token = createJWT({ userId: newUser._id, email: newUser.email });

//     res.status(201).json({ token, user: { email: newUser.email } });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(409).json({ message: 'Email already exists' });
//     }
//     console.error("Registration API error:", error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }

// export default handler;



























// pages/api/auth/register.js
import { hashPassword } from '../../../lib/auth';
import { createUser, findUserByEmail } from '../../../lib/db';
import { createJWT } from '../../../middlewares/auth';

// Add this config for Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    externalResolver: true,
  },
};

async function handler(req, res) {
  // Add CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !email.includes('@') || !password || password.trim().length < 7) {
    return res.status(400).json({ message: 'Invalid input - password must be at least 7 characters' });
  }

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(email, hashedPassword);
    const token = createJWT({ userId: newUser._id, email: newUser.email });

    return res.status(201).json({ token, user: { email: newUser.email } });
  } catch (error) {
    console.error("Registration API error:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export default handler;