import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const navStyle = {
    padding: '12px 24px',
    backgroundColor: '#1e293b', // Slate-800
    color: '#f8fafc', // Slate-50
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  };

  const linkGroup = {
    display: 'flex',
    gap: '20px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#f8fafc',
    fontWeight: '500',
    fontSize: '16px',
    transition: 'color 0.2s ease-in-out',
  };

  const linkHoverStyle = {
    color: '#38bdf8', // Sky-400 on hover
  };

  return (
    <nav style={navStyle}>
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>💻 CodeArena</div>
      <div style={linkGroup}>
        {['/', '/problems', '/login', '/register'].map((path, index) => {
          const labels = ['Home', 'Problems', 'Login', 'Register'];
          return (
            <Link
              key={path}
              to={path}
              style={linkStyle}
              onMouseOver={e => (e.target.style.color = linkHoverStyle.color)}
              onMouseOut={e => (e.target.style.color = linkStyle.color)}
            >
              {labels[index]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
