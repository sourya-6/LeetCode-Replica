import express from "express";
import {get getLeaderboard} from "../controllers/leaderboard.controller.js"

const router = express.Router();

router.get("/", getLeaderboard);

export default router;
