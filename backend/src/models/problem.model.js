import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});

const problemSchema = new mongoose.Schema(
  {
    problemId: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    inputFormat: { type: String, required: true },
    outputFormat: { type: String, required: true },
    constraints: [{ type: String }],  // Adding constraints field
    examples: [{ type: String }],
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" }, // Difficulty level
    tags: [{ type: String }],  // Optional tags for categorization
    testCases: [testCaseSchema],
  },
  { timestamps: true }
);

export const Problem = mongoose.model("Problem", problemSchema);
