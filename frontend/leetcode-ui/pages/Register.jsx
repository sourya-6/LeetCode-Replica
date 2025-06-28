import React, { useState } from 'react';
import axios from '../utils/axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('/user/register', { email, password });
      alert('✅ Registered successfully!');
      setEmail('');
      setPassword('');
    } catch (err) {
      alert('❌ Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🚀 Register</h2>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleRegister} style={styles.button}>
          Create Account
        </button>
      </div>
    </div>
  );
}

// 🔧 Styling
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    background: 'linear-gradient(to right, #0f172a, #1e293b)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  heading: {
    fontSize: '1.8rem',
    color: '#38bdf8',
    textAlign: 'center',
    marginBottom: '10px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#f1f5f9',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    transition: '0.2s ease',
  },
};
