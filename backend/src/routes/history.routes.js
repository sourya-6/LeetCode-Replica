import express from "express";
import { getUserHistory } from "../controllers/history.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, getUserHistory);

export default router;
