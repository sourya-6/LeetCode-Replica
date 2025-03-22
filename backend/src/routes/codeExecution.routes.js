import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  executeCodeController,
  getCodeResult,
} from "../controllers/codeExecution.controller.js";

const router = express.Router();
router.use(verifyJWT);
// Protected Route - Only authenticated users can submit code
router.post("/submit", executeCodeController);

// Get Code Execution Result
router.get("/result/:jobId",  getCodeResult);

export default router;
