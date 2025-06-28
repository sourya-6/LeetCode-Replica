import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Problems from "../pages/Problems";
import ProblemDetail from "../pages/ProblemDetail";
import SubmissionResult from "../pages/SubmissionResult";
import CodePlayground from "../pages/CodePlayground";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problem/:id" element={<ProblemDetail />} />
        <Route path="/result" element={<SubmissionResult />} />
        <Route path="/playground/:id" element={<CodePlayground />} />
      </Routes>
    </>
  );
}

export default App;
