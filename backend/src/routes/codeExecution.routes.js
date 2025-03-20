import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  executeCodeController,
  getCodeResult,
} from "../controllers/codeExecution.controller.js";

const router = express.Router();

// Protected Route - Only authenticated users can submit code
router.post("/submit", verifyJWT, executeCodeController);

// Get Code Execution Result
router.get("/result/:jobId", verifyJWT, getCodeResult);

export default router;
