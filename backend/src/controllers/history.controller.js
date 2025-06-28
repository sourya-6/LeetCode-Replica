import Submission from "../models/submission.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const getUserHistory = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ user: req.user._id })
    .populate("problem", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: submissions,
  });
});
