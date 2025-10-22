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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { email, password } = req.body;

  if (!email || !email.includes('@') || !password || password.trim().length < 7) {
    res.status(400).json({ message: 'Invalid input - password must be at least 7 characters' });
    return;
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: 'Email already exists' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(email, hashedPassword);
    const token = createJWT({ userId: newUser._id, email: newUser.email });

    res.status(201).json({ token, user: { email: newUser.email } });
  } catch (error) {
    console.error("Registration API error:", error);

    if (error.code === 11000) {
      res.status(409).json({ message: 'Email already exists' });
      return;
    }

    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
}
