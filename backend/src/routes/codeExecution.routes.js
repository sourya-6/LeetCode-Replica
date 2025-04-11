import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  executeCodeController,
  getCodeResult,
} from "../controllers/codeExecution.controller.js";

const router = express.Router();
router.use(verifyJWT);

// Submit code for execution
router.post("/submit", executeCodeController);

// Fetch result by jobId
router.get("/result/:jobId", getCodeResult);

export default router;
