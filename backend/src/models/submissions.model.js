import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  output: { type: String },
  passed: { type: Boolean, default: false },
});

const submissionSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    testResults: [testResultSchema],
    passedCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    isAccepted: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);


export const Submission = mongoose.model("Submission", submissionSchema);
