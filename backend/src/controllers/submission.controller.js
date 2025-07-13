// controllers/submission.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { Submission } from "../models/submissions.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllSubmissions = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const submissions = await Submission.find({ userId })
    .populate("problemId", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Submissions fetched successfully",
    submissions,
  });
});

export const saveSubmission = asyncHandler(async (req, res) => {
  const { problemId, code, language, passedCount, failedCount, testResults, score } = req.body;
  const userId = req.user._id;

  const submission = await Submission.create({
    problemId,
    userId,
    code,
    language,
    passedCount,
    failedCount,
    testResults,
    score,
  });

  res.status(201).json(new ApiResponse(201, "Submission saved successfully", submission));
});
