import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/user/login', { email, password });
      toast.success('🎉 Logged in successfully!', {
        position: 'top-right',
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate('/problems');
      }, 2000); // give toast some time to show
    } catch (err) {
      toast.error('❌ Login failed. Please check your credentials.', {
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>🔐 Welcome Back</h2>
          <input
            style={styles.input}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#f8fafc',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    animation: 'fadeIn 0.7s ease-in-out',
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#1e293b',
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    outline: 'none',
    transition: '0.3s',
  },
  button: {
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};
