import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../src/redux/slices/authSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navStyle = {
    padding: "16px 32px",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    color: "#f8fafc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const linkGroup = {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
    padding: "8px 16px",
    borderRadius: "8px",
    position: "relative",
  };

  const linkHoverStyle = {
    color: "#60a5fa",
    backgroundColor: "rgba(96, 165, 250, 0.1)",
  };

  const logoutButtonStyle = {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
  };

  const brandStyle = {
    fontSize: "22px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
  };

  const publicLinks = ["/", "/login", "/register"];
  const publicLabels = ["🏠 Home", "🔐 Login", "📝 Register"];
  const protectedLinks = ["/problems", "/submissions"];
  const protectedLabels = ["💡 Problems", "📊 My Submissions"];

  return (
    <nav style={navStyle}>
      <div style={brandStyle}>⚡ CodeCrack</div>
      <div style={linkGroup}>
        {!isAuthenticated ? (
          publicLinks.map((path, index) => (
            <Link
              key={path}
              to={path}
              style={linkStyle}
              onMouseOver={(e) => {
                e.target.style.color = linkHoverStyle.color;
                e.target.style.backgroundColor = linkHoverStyle.backgroundColor;
              }}
              onMouseOut={(e) => {
                e.target.style.color = linkStyle.color;
                e.target.style.backgroundColor = "transparent";
              }}
            >
              {publicLabels[index]}
            </Link>
          ))
        ) : (
          <>
            {protectedLinks.map((path, index) => (
              <Link
                key={path}
                to={path}
                style={linkStyle}
                onMouseOver={(e) => {
                  e.target.style.color = linkHoverStyle.color;
                  e.target.style.backgroundColor =
                    linkHoverStyle.backgroundColor;
                }}
                onMouseOut={(e) => {
                  e.target.style.color = linkStyle.color;
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                {protectedLabels[index]}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              style={logoutButtonStyle}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
              }}
            >
              🚪 Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
