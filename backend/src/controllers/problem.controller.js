import { Problem } from "../models/problem.model.js";
import { Submission } from "../models/submissions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v4 as uuidv4 } from "uuid";
import {
  submitCode,
  getCodeExecutionResult,
} from "../services/codeExecution.service.js";

// Get All Problems
const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await Problem.find();
  res
    .status(200)
    .json(new ApiResponse(200, "Problems fetched successfully!", problems));
});

// Create a New Problem with Test Cases
const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    inputFormat,
    outputFormat,
    examples,
    constraints,
    difficulty,
    tags,
    testCases,
  } = req.body;

  // Check for duplicate title
  const existingProblem = await Problem.findOne({ title });
  if (existingProblem) {
    throw new ApiError(400, "Problem with the same title already exists!");
  }

  // Generate a unique problem ID
  const problemId = uuidv4();

  const problem = new Problem({
    problemId,
    title,
    description,
    inputFormat,
    outputFormat,
    examples,
    constraints,
    difficulty,
    tags,
    testCases,
  });

  await problem.save();
  res
    .status(201)
    .json(new ApiResponse(201, "Problem created successfully!", problem));
});

// Get a Particular Problem by ID
const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await Problem.findById(id);
  if (!problem) {
    throw new ApiError(404, "Problem not found!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Problem fetched successfully!", problem));
});

// Run Test Cases for a Given Problem
const runTestCases = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { code, language } = req.body;
  
    if (!code || !language) {
      throw new ApiError(400, "Code and language are required!");
    }
  
    const problem = await Problem.findById(id);
    if (!problem) {
      throw new ApiError(404, "Problem not found!");
    }
  
    const testResults = [];
    let passedCount = 0;
  
    for (const testCase of problem.testCases) {
      const { input, expectedOutput } = testCase;
  
      const wrappedCode =
        language === "python"
          ? `${code}\nprint(${input})`
          : `${code}\nconsole.log(${input})`;
  
      try {
        const jobId = await submitCode(req.user._id, wrappedCode, language);
        const output = await getCodeExecutionResult(jobId);
  
        const actualOutput = output.result || output.error || "No Output";
  
        const passed = output.success && actualOutput.trim() === expectedOutput.trim();
  
        testResults.push({
          input,
          expectedOutput,
          output: actualOutput,
          passed,
        });
  
        if (passed) passedCount++;
      } catch (err) {
        testResults.push({
          input,
          expectedOutput,
          output: "Execution failed",
          passed: false,
        });
      }
    }
  
    const failedCount = testResults.length - passedCount;
  
    const submission = new Submission({
      problemId: id,
      userId: req.user._id,
      code,
      language,
      testResults,
      passedCount,
      failedCount,
    });
  
    await submission.save();
  
    res.status(200).json(
      new ApiResponse(200, "Test cases executed successfully!", {
        passedCount,
        failedCount,
        testResults,
      })
    );
  });
  

export { getAllProblems, createProblem, getProblemById, runTestCases };
