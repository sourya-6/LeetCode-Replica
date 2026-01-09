import express from "express";
import rateLimit from "express-rate-limit";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  executeCodeController,
  getCodeResult,
} from "../controllers/codeExecution.controller.js";

const router = express.Router();
router.use(verifyJWT);

// Rate limiting for code execution - max 20 submissions per 15 minutes
const codeExecutionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each user to 20 requests per windowMs
  message: "Too many code submissions. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => req.user?.id || req.ip,
  skip: (req) => process.env.NODE_ENV === "test",
});

// Submit code for execution
router.post("/submit", codeExecutionLimiter, executeCodeController);

// Fetch result by jobId
router.get("/result/:jobId", getCodeResult);

export default router;
