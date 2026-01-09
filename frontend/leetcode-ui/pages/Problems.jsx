import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/problem")
      .then((res) => {
        const sorted = res.data.message.sort(
          (a, b) =>
            getDifficultyRank(a.difficulty) - getDifficultyRank(b.difficulty)
        );
        setProblems(sorted);
        setFilteredProblems(sorted);
        setError(null);
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message || "Failed to load problems";
        setError(errorMsg);
        toast.error(`❌ ${errorMsg}`, { position: "top-right" });
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...problems];

    if (filter !== "all") {
      filtered = filtered.filter((p) => p.difficulty.toLowerCase() === filter);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProblems(filtered);
  }, [filter, searchTerm, problems]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>🔥 Coding Challenges</h2>
        {!loading && !error && (
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
        )}
      </div>

      {loading && (
        <div style={{ ...styles.messageContainer, color: "#666" }}>
          ⏳ Loading problems...
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            ...styles.messageContainer,
            backgroundColor: "#fee",
            color: "#c33",
            border: "1px solid #fcc",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && filteredProblems.length === 0 && (
        <div style={{ ...styles.messageContainer, color: "#666" }}>
          No problems found. Try adjusting your filters.
        </div>
      )}

      {!loading && !error && filteredProblems.length > 0 && (
        <div style={styles.grid}>
          {filteredProblems.map((p) => (
            <Link to={`/problem/${p._id}`} key={p._id} style={styles.cardLink}>
              <div
                style={{
                  ...styles.card,
                  borderLeft: `6px solid ${getColor(p.difficulty)}`,
                }}
              >
                <h3 style={styles.title}>{p.title}</h3>
                <span
                  style={{
                    ...styles.difficulty,
                    color: getColor(p.difficulty),
                  }}
                >
                  {p.difficulty.toUpperCase()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
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
    case "easy":
      return "#22c55e";
    case "medium":
      return "#facc15";
    case "hard":
      return "#ef4444";
    default:
      return "#a5b4fc";
  }
}

// Styles
const styles = {
  container: {
    padding: "48px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    minHeight: "100vh",
    color: "#f8fafc",
  },
  header: {
    marginBottom: "36px",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "16px",
  },
  controls: {
    display: "flex",
    gap: "16px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
  dropdown: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "2px solid #334155",
    background: "rgba(30, 41, 59, 0.8)",
    backdropFilter: "blur(10px)",
    color: "#f8fafc",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  searchInput: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "2px solid #334155",
    background: "rgba(30, 41, 59, 0.8)",
    backdropFilter: "blur(10px)",
    color: "#f8fafc",
    fontSize: "1rem",
    width: "100%",
    maxWidth: "360px",
    transition: "all 0.3s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  messageContainer: {
    padding: "48px",
    textAlign: "center",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    marginTop: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  cardLink: {
    textDecoration: "none",
  },
  card: {
    background: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(10px)",
    padding: "24px",
    borderRadius: "16px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "140px",
    cursor: "pointer",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    position: "relative",
    overflow: "hidden",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#f1f5f9",
  },
  difficulty: {
    fontWeight: "700",
    alignSelf: "flex-start",
    fontSize: "0.85rem",
    borderRadius: "8px",
    padding: "6px 12px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
};
