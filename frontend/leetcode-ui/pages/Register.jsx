import React, { useState } from "react";
import axios from "../utils/axios";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginStart, loginFailure } from "../src/redux/slices/authSlice";

export default function Register() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    dispatch(loginStart());
    try {
      const res = await axios.post("/user/register", {
        username,
        name,
        email,
        password,
      });
      toast.success("✅ Registered successfully! Please log in.", {
        position: "top-right",
        autoClose: 1500,
      });
      setUsername("");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      dispatch(loginFailure(errorMsg));
      toast.error(`❌ ${errorMsg}`, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>🚀 Register</h2>
          <div style={styles.formGroup}>
            <input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({ ...errors, username: "" });
              }}
              style={{
                ...styles.input,
                borderColor: errors.username ? "#ef4444" : "#334155",
              }}
            />
            {errors.username && (
              <p style={styles.errorText}>{errors.username}</p>
            )}
          </div>
          <div style={styles.formGroup}>
            <input
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              style={{
                ...styles.input,
                borderColor: errors.name ? "#ef4444" : "#334155",
              }}
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>
          <div style={styles.formGroup}>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              style={{
                ...styles.input,
                borderColor: errors.email ? "#ef4444" : "#334155",
              }}
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>
          <div style={styles.formGroup}>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              style={{
                ...styles.input,
                borderColor: errors.password ? "#ef4444" : "#334155",
              }}
            />
            {errors.password && (
              <p style={styles.errorText}>{errors.password}</p>
            )}
          </div>
          <div style={styles.formGroup}>
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: "" });
              }}
              style={{
                ...styles.input,
                borderColor: errors.confirmPassword ? "#ef4444" : "#334155",
              }}
            />
            {errors.confirmPassword && (
              <p style={styles.errorText}>{errors.confirmPassword}</p>
            )}
          </div>
          <button
            onClick={handleRegister}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>
    </>
  );
}

// 🔧 Styling
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    padding: "48px",
    borderRadius: "20px",
    boxShadow:
      "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    width: "100%",
    maxWidth: "440px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    position: "relative",
    zIndex: 10,
  },
  heading: {
    fontSize: "28px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    marginBottom: "12px",
  },
  input: {
    padding: "14px 18px",
    fontSize: "16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#f8fafc",
  },
  button: {
    padding: "14px",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "13px",
    margin: "0px",
    fontWeight: "500",
  },
};
