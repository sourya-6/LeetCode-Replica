// routes/submission.routes.js
import { Router } from "express";
import { getAllSubmissions,saveSubmission } from "../controllers/submission.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔒 Protected: View all submissions by the logged-in user
router.get("/", verifyJWT, getAllSubmissions);
router.post("/save", verifyJWT, saveSubmission);

export default router;
