import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Initializing CORS
app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin: ["http://localhost:5173", "https://www.paypal.com", "https://www.sandbox.paypal.com"],
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import codeExecutionRouter from "./routes/codeExecution.routes.js";
import problemRouter from "./routes/problem.routes.js";
// import leaderboardRoutes from "./src/routes/leaderboard.js";
// import historyRoutes from "./src/routes/history.js";


import submissionRoutes from "./routes/submission.routes.js";


app.use("/api/v1/user", userRouter);
app.use("/api/v1/codeExecution", codeExecutionRouter);
app.use("/api/v1/problem", problemRouter);
app.use("/api/v1/submissions", submissionRoutes);
// app.use("/api/leaderboard", leaderboardRoutes);
// app.use("/api/history", historyRoutes);

export { app };
