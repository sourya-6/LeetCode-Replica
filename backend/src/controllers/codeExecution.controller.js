import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import redisClient from "../utils/redisClient.js";
import { v4 as uuidv4 } from "uuid";

// Submit Code for Execution
export const executeCodeController = asyncHandler(async (req, res) => {
    const { code, language } = req.body;
    if (!code || !language) {
        throw new ApiError(400, "Code and Language are required");
    }

    const jobId = uuidv4(); // Generate unique job ID
    const jobData = JSON.stringify({ jobId, code, language });

    await redisClient.rpush("jobQueue", jobData); // Push job to Redis queue

    res.status(202).json(new ApiResponse(202, "Code submitted successfully!", { jobId }));
});

// Get Execution Result
export const getCodeResult = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const result = await redisClient.get(`jobResults:${jobId}`);

    if (!result) {
        throw new ApiError(404, "Result not found or still processing");
    }

    res.status(200).json(new ApiResponse(200, "Execution result", { jobId, result }));
});
