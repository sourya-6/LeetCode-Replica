// imports stay the same...
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import CodeEditor from "../components/CodeEditor";
import Split from "react-split";
import { useDispatch, useSelector } from "react-redux";
import { updateCode } from "../src/redux/slices/codeSlice";

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  // const [code, setCode] = useState('// Write your code here');
  const dispatch = useDispatch();
  const codeMap = useSelector((state) => state.code.codeMap);
  const code = codeMap[id] || "// Write your code here";

  const [language, setLanguage] = useState("cpp");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`/problem/${id}`)
      .then((res) => setProblem(res.data.message))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = isFullscreen ? "hidden" : "auto";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isFullscreen]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const submitRes = await axios.post("/codeExecution/submit", {
        problemId: id,
        code,
        language,
        functionName: problem.functionName,
        testCases: problem.testCases,
      });

      const jobId = submitRes.data.message.jobId;

      // Poll for the result
      let retries = 20;
      let result = null;

      while (retries--) {
        const pollRes = await axios.get(`/codeExecution/result/${jobId}`);
        if (pollRes.data.message?.result) {
          result = pollRes.data.message.result;
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }

      if (!result) throw new Error("Job result timed out");

      // 💾 Save submission to DB
      await axios.post("/submissions/save", {
        problemId: id,
        code,
        language,
        testResults: result.output.testResults,
        passedCount: result.output.passedCount,
        failedCount: result.output.failedCount,
        score:
          result.output.passedCount === problem.testCases.length
            ? 100
            : (result.output.passedCount / problem.testCases.length) * 100,
      });

      navigate("/result", {
        state: { jobId, result, problem, language, code },
      });
    } catch (err) {
      console.error(err);
      alert(
        "Submission failed: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    setRunResult(null);
    setLoading(true);
    try {
      const res = await axios.post(`/problem/${problem._id}/run`, {
        language,
        code,
        functionName: problem.functionName,
        testCases: problem.testCases,
      });
      setRunResult(res.data.output);
    } catch (err) {
      console.error(err);
      setRunResult({ error: "Run failed." });
    } finally {
      setLoading(false);
    }
  };

  if (!problem)
    return <p className="text-center  text-lg font-medium mt-10">Loading...</p>;

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50">
      {isFullscreen && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-white z-[9999] p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">
              Editing: <span className="text-blue-600">{problem.title}</span>
            </h2>
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-3 py-1 text-sm font-medium bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              Exit Fullscreen (Esc)
            </button>
          </div>
          <div className="flex-1 border rounded-lg overflow-hidden shadow">
            <CodeEditor
              language={language}
              value={code}
              onChange={(newCode) =>
                dispatch(updateCode({ problemId: id, code: newCode }))
              }
            />
          </div>
        </div>
      )}

      {!isFullscreen && (
        <Split className="flex h-full" sizes={[40, 60]} minSize={[300, 400]}>
          <div className="p-6 overflow-y-auto bg-white shadow-inner">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-4">
              {problem.title}
            </h1>
            <p className="text-gray-800 whitespace-pre-wrap mb-6 text-sm leading-relaxed">
              {problem.description}
            </p>

            {problem.constraints && (
              <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h3 className="text-md font-semibold text-yellow-700 mb-1">
                  Constraints:
                </h3>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {problem.constraints}
                </pre>
              </div>
            )}

            {problem.testCases?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-blue-700">
                  Sample Test Cases:
                </h3>
                {problem.testCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-100 text-sm shadow-sm"
                  >
                    <p className="font-medium text-gray-800 mb-1">Input:</p>
                    <pre className="bg-white p-2 rounded border mb-2 text-gray-700">
                      {testCase.input}
                    </pre>
                    <p className="font-medium text-gray-800 mb-1">
                      Expected Output:
                    </p>
                    <pre className="bg-white p-2 rounded border text-gray-700">
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 mb-4">
              <label
                htmlFor="lang"
                className="block font-medium mb-2 text-gray-700"
              >
                Select Language:
              </label>
              <select
                id="lang"
                className="w-full px-3 py-2 border rounded-md shadow"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRun}
                className="w-full bg-blue-100 text-blue-700 font-semibold py-2 rounded-lg shadow hover:bg-blue-200 transition"
              >
                Run Code
              </button>
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 rounded-lg shadow hover:scale-105 transition-all"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>

            {/* Run Code Output */}
            {runResult && (
              <div className="mt-4 bg-gray-50 border p-4 rounded">
                <h4 className="text-md font-bold mb-2 text-gray-800">
                  Run Output:
                </h4>
                {runResult.error && (
                  <p className="text-red-500">{runResult.error}</p>
                )}
                {runResult.results?.map((res, i) => (
                  <div key={i} className="text-sm text-gray-700 mb-2">
                    <p>
                      <strong>Input:</strong> {JSON.stringify(res.input)}
                    </p>
                    <p>
                      <strong>Expected:</strong> {String(res.expected)}
                    </p>
                    <p>
                      <strong>Output:</strong> {String(res.output)}
                    </p>
                    <p>
                      <strong>Result:</strong>{" "}
                      {res.passed ? "✅ Passed" : "❌ Failed"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="p-2 h-full bg-gray-100">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsFullscreen(true)}
                className="px-4 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              >
                Fullscreen Editor
              </button>
            </div>
            <div className="w-full h-[calc(100%-2rem)] border rounded-lg shadow-lg overflow-hidden">
              <CodeEditor
                language={language}
                value={code}
                onChange={(newCode) =>
                  dispatch(updateCode({ problemId: id, code: newCode }))
                }
              />
            </div>
          </div>
        </Split>
      )}
    </div>
  );
}
