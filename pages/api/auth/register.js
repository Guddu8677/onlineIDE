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



























// // pages/api/auth/register.js
// import { hashPassword } from '../../../lib/auth';
// import { createUser, findUserByEmail } from '../../../lib/db';
// import { createJWT } from '../../../middlewares/auth';

// export default async function handler(req, res) {
//   // Set CORS headers
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//   );

//   // Handle preflight
//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }

//   // Only allow POST
//   if (req.method !== 'POST') {
//     res.status(405).json({ message: 'Method Not Allowed' });
//     return;
//   }

//   const { email, password } = req.body;

//   // Validation
//   if (!email || !email.includes('@') || !password || password.trim().length < 7) {
//     res.status(400).json({ message: 'Invalid input - password must be at least 7 characters' });
//     return;
//   }

//   try {
//     // Check if user exists
//     const existingUser = await findUserByEmail(email);
//     if (existingUser) {
//       res.status(409).json({ message: 'Email already exists' });
//       return;
//     }

//     // Create user
//     const hashedPassword = await hashPassword(password);
//     const newUser = await createUser(email, hashedPassword);
//     const token = createJWT({ userId: newUser._id, email: newUser.email });

//     res.status(201).json({ 
//       token, 
//       user: { email: newUser.email } 
//     });
//   } catch (error) {
//     console.error("Registration API error:", error);
//     console.error("Error stack:", error.stack);
    
//     if (error.code === 11000) {
//       res.status(409).json({ message: 'Email already exists' });
//       return;
//     }
    
//     res.status(500).json({ 
//       message: 'Internal server error',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
//     });
//   }
// }









import { hashPassword } from '../../../lib/auth';
import { createUser, findUserByEmail } from '../../../lib/db';
import { createJWT } from '../../../middlewares/auth';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !email.includes('@') || !password || password.trim().length < 7) {
      return res.status(400).json({
        message: 'Invalid input. Email must be valid and password must be at least 7 characters long.',
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await hashPassword(password);

    // ✅ Safely create a unique username from email
    let baseUsername = email.split('@')[0];
    if (!baseUsername) baseUsername = `user${Date.now()}`;

    // Ensure no duplicate username
    let finalUsername = baseUsername;
    let counter = 1;
    const User = (await import('../../../models/User')).default;
    while (await User.findOne({ username: finalUsername })) {
      finalUsername = `${baseUsername}${counter++}`;
    }

    // ✅ Pass username to createUser()
    const newUser = await createUser({
      email,
      password: hashedPassword,
      username: finalUsername,
    });

    const token = createJWT({ userId: newUser._id, email: newUser.email });

    res.status(201).json({
      token,
      user: {
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error('Registration API error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
