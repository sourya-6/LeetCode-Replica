import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SubmissionResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-slate-300 text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-xl">No result data available.</p>
        </div>
      </div>
    );
  }

  const { jobId, result, problem, language, code } = state;
  console.log("1", result.output);

  const passedCount = result.output.testResults.filter((t) => t.passed).length;
  const totalCount = result.output.testResults.length;
  const scorePercentage = ((passedCount / totalCount) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">
                {result.isAccepted ? "🎉 Accepted!" : "❌ Wrong Answer"}
              </h1>
              <p className="text-lg opacity-90">
                {passedCount} / {totalCount} test cases passed
              </p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-black mb-1">{scorePercentage}%</div>
              <p className="text-sm opacity-75 uppercase tracking-wider">
                Score
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6 shadow-xl">
          <div className="grid grid-cols-2 gap-4 text-slate-200">
            <div>
              <p className="text-slate-400 text-sm mb-1">Job ID</p>
              <p className="font-mono text-sm text-slate-300">{jobId}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Language</p>
              <p className="font-semibold">
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm border border-blue-500/30">
                  {language}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="space-y-4 mb-6">
          <h3 className="text-2xl font-bold text-slate-200 mb-4">
            📝 Test Case Results
          </h3>
          {result.output.testResults.map((test, idx) => (
            <div
              key={idx}
              className={`border-2 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] ${
                test.passed
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-slate-200">
                  Test Case #{idx + 1}
                </h4>
                <span
                  className={`px-4 py-1.5 rounded-lg font-bold text-sm ${
                    test.passed
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {test.passed ? "✅ PASSED" : "❌ FAILED"}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400 font-medium mb-1">Input:</p>
                  <pre className="bg-slate-900/50 border border-slate-700 p-3 rounded-lg text-slate-200 overflow-x-auto">
                    {test.input}
                  </pre>
                </div>
                <div>
                  <p className="text-slate-400 font-medium mb-1">
                    Expected Output:
                  </p>
                  <pre className="bg-slate-900/50 border border-slate-700 p-3 rounded-lg text-slate-200 overflow-x-auto">
                    {String(test.expectedOutput)}
                  </pre>
                </div>
                <div>
                  <p className="text-slate-400 font-medium mb-1">
                    Your Output:
                  </p>
                  <pre
                    className={`bg-slate-900/50 border p-3 rounded-lg overflow-x-auto ${
                      test.passed
                        ? "border-green-500/30 text-green-300"
                        : "border-red-500/30 text-red-300"
                    }`}
                  >
                    {test.output || "(no output)"}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            ← Back to Problem
          </button>
          <button
            onClick={() => navigate("/problems")}
            className="flex-1 bg-slate-700 text-white font-bold py-4 rounded-xl border border-slate-600 hover:bg-slate-600 transition-all duration-300 hover:scale-105"
          >
            Browse Problems →
          </button>
        </div>
      </div>
    </div>
  );
}
