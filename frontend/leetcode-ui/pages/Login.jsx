import React, { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  loginSuccess,
  loginFailure,
  loginStart,
} from "../src/redux/slices/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    dispatch(loginStart());
    try {
      const res = await axios.post("/user/login", { email, password });
      const { token, user } = res.data.message || res.data;

      dispatch(loginSuccess({ user, token }));
      toast.success("🎉 Logged in successfully!", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/problems");
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
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
          <h2 style={styles.title}>🔐 Welcome Back</h2>
          <div style={styles.formGroup}>
            <input
              style={{
                ...styles.input,
                borderColor: errors.email ? "#ef4444" : "#cbd5e1",
              }}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>
          <div style={styles.formGroup}>
            <input
              style={{
                ...styles.input,
                borderColor: errors.password ? "#ef4444" : "#cbd5e1",
              }}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
            />
            {errors.password && (
              <p style={styles.errorText}>{errors.password}</p>
            )}
          </div>
          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    height: "100vh",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)",
    display: "flex",
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
    animation: "fadeIn 0.7s ease-in-out",
    position: "relative",
    zIndex: 10,
  },
  title: {
    textAlign: "center",
    marginBottom: "12px",
    fontSize: "28px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
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
  errorText: {
    color: "#ef4444",
    fontSize: "13px",
    margin: "0px",
    fontWeight: "500",
  },
};
