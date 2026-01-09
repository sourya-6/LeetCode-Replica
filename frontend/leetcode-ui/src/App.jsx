import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Problems from "../pages/Problems";
import ProblemDetail from "../pages/ProblemDetail";
import SubmissionResult from "../pages/SubmissionResult";
import CodePlayground from "../pages/CodePlayground";
import MySubmissions from "../pages/MySubmissions";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problem/:id"
          element={
            <ProtectedRoute>
              <ProblemDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <SubmissionResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playground/:id"
          element={
            <ProtectedRoute>
              <CodePlayground />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <MySubmissions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
