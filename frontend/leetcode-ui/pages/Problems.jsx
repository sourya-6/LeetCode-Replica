import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/problem')
      .then(res => {
        const sorted = res.data.message.sort((a, b) => getDifficultyRank(a.difficulty) - getDifficultyRank(b.difficulty));
        setProblems(sorted);
        setFilteredProblems(sorted);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let filtered = [...problems];

    if (filter !== 'all') {
      filtered = filtered.filter(p => p.difficulty.toLowerCase() === filter);
    }

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProblems(filtered);
  }, [filter, searchTerm, problems]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>🔥 Coding Challenges</h2>
        <div style={styles.controls}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.dropdown}
          >
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.grid}>
        {filteredProblems.map((p) => (
          <Link to={`/problem/${p._id}`} key={p._id} style={styles.cardLink}>
            <div style={{ ...styles.card, borderLeft: `6px solid ${getColor(p.difficulty)}` }}>
              <h3 style={styles.title}>{p.title}</h3>
              <span style={{ ...styles.difficulty, color: getColor(p.difficulty) }}>
                {p.difficulty.toUpperCase()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Difficulty sort helper
function getDifficultyRank(difficulty) {
  const ranks = { easy: 1, medium: 2, hard: 3 };
  return ranks[difficulty.toLowerCase()] || 99;
}

// Color helper
function getColor(difficulty) {
  switch (difficulty.toLowerCase()) {
    case 'easy': return '#22c55e';
    case 'medium': return '#facc15';
    case 'hard': return '#ef4444';
    default: return '#a5b4fc';
  }
}

// Styles
const styles = {
  container: {
    padding: '40px',
    background: 'linear-gradient(to right, #0f172a, #1e293b)',
    minHeight: '100vh',
    color: '#f8fafc',
  },
  header: {
    marginBottom: '30px',
  },
  heading: {
    fontSize: '2.2rem',
    background: 'linear-gradient(to right, #38bdf8, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  dropdown: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #334155',
    background: '#1e293b',
    color: '#f8fafc',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  searchInput: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #334155',
    background: '#1e293b',
    color: '#f8fafc',
    fontSize: '1rem',
    width: '100%',
    maxWidth: '300px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  cardLink: {
    textDecoration: 'none',
  },
  card: {
    background: '#1e293b',
    padding: '20px',
    borderRadius: '10px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '120px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.2rem',
    marginBottom: '10px',
    color: '#f1f5f9',
  },
  difficulty: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    fontSize: '0.9rem',
    borderRadius: '6px',
    padding: '4px 8px',
    backgroundColor: '#f1f5f91a',
  },
};
