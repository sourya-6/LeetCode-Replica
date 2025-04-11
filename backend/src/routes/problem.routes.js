import { Router } from "express";
import {
  getAllProblems,
  createProblem,
  getProblemById,
  runTestCases,
} from "../controllers/problem.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.get("/", getAllProblems);
router.get("/:id", getProblemById);

// Protected Routes
router.post("/", verifyJWT, createProblem);
router.post("/:id/run", verifyJWT, runTestCases);

export default router;
