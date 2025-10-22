// pages/login.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid credentials.');
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <Head>
        <title>Login - CipherStudio</title>
      </Head>
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">Login</button>
      </form>
      <p>
        Don't have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;