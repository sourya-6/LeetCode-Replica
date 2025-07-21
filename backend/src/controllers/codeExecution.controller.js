import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  submitCode,
  getCodeExecutionResult,
} from "../services/codeExecution.service.js";
import { Problem } from "../models/problem.model.js";

// Submit code (controller)
export const executeCodeController = asyncHandler(async (req, res) => {
  const { code, language, functionName, testCases } = req.body;
  const userId = req.user?.id;
console.log(userId,"Getting into it")
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
// export const getCodeResult = asyncHandler(async (req, res) => {
//   const { jobId } = req.params;

//   const result = await getCodeExecutionResult(jobId);
//   console.log('result',result)
//   if (!result) {
//     return res
//       .status(202)
//       .json(new ApiResponse(202, "Job is still processing", {}));
//   }

//   const { output, isAccepted, userId, problemId  } = result;
// console.log(result)
//   //  Fetch problem to get maxScore
//   const problem = await Problem.findById(problemId);
//   if (!problem) {
//     throw new ApiError(404, "Problem not found");
//   }

//   const totalTests = output.testResults?.length || 0;
//   const passedCount = output.passedCount || 0;

//   const score = totalTests > 0 ? (problem.maxScore / totalTests) * passedCount : 0;

//   //  Save submission in MongoDB
//   await Submission.create({
//     problemId,
//     userId,
//     code: output.code,
//     language: output.language,
//     testResults: output.testResults,
//     passedCount,
//     failedCount: output.failedCount || 0,
//     score,
//   });

//   res
//     .status(200)
//     .json(new ApiResponse(200, "Execution result", { jobId, result }));
// });
