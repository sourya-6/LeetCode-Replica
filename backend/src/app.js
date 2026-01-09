import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Secure CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:5173", "https://leet-code-replica.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import codeExecutionRouter from "./routes/codeExecution.routes.js";
import problemRouter from "./routes/problem.routes.js";
import submissionRoutes from "./routes/submission.routes.js";

app.get("/", (req, res) => {
  res.send("🚀 Leetcode Replica Backend is running!");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/codeExecution", codeExecutionRouter);
app.use("/api/v1/problem", problemRouter);
app.use("/api/v1/submissions", submissionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[${new Date().toISOString()}] Error: ${message}`);

  res.status(status).json({
    success: false,
    statusCode: status,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
  });
});

export { app };
