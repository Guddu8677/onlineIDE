// // context/AuthContext.js
// import { createContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/router';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // Add loading state
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');
//     if (token && storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false); // Set loading to false after checking local storage
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         setUser(data.user);
//         return true;
//       } else {
//         console.error("Login failed:", data.message);
//         return false;
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error; // Re-throw to be caught in the component
//     }
//   };

//   const register = async (email, password) => {
//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         setUser(data.user);
//         return true;
//       } else {
//         console.error("Registration failed:", data.message);
//         return false;
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       throw error; // Re-throw to be caught in the component
//     }
//   };


//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     router.push('/login');
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     loading // Expose loading state
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading ? children : <div>Loading...</div>} {/* Render children only after loading is complete */}
//     </AuthContext.Provider>
//   );
// };









// context/AuthContext.js
const register = async (email, password) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `Server error: ${response.status}` 
      }));
      console.error("Registration failed:", errorData.message);
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return true;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `Server error: ${response.status}` 
      }));
      console.error("Login failed:", errorData.message);
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return true;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};