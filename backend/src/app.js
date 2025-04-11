import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Initializing CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import codeExecutionRouter from "./routes/codeExecution.routes.js";
import problemRouter from "./routes/problem.routes.js";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/codeExecution", codeExecutionRouter);
app.use("/api/v1/problem", problemRouter);
export { app };
