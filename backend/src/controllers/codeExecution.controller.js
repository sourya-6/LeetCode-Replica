import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  submitCode,
  getCodeExecutionResult,
} from "../services/codeExecution.service.js";

// Submit code (controller)
export const executeCodeController = asyncHandler(async (req, res) => {
  const { code, language, functionName, testCases } = req.body;
  const userId = req.user?.id;

  const jobId = await submitCode(userId, code, language, functionName, testCases);

  res
    .status(202)
    .json(new ApiResponse(202, "Code submitted successfully!", { jobId }));
});

// Get result (controller)
export const getCodeResult = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const result = await getCodeExecutionResult(jobId);
  if (!result) {
    return res
      .status(202)
      .json(new ApiResponse(202, "Job is still processing", {}));
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Execution result", { jobId, result }));
});
