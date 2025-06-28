import User from "../models/user.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const getLeaderboard = asyncHandler(async (req, res) => {
  const topUsers = await User.find()
    .sort({ acceptedSubmissions: -1 })
    .select("username problemsSolved acceptedSubmissions")
    .limit(10);

  res.status(200).json({
    success: true,
    data: topUsers,
  });
});
