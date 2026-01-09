import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/submissions");
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to load submissions";
        setError(errorMsg);
        toast.error(`❌ ${errorMsg}`, { position: "top-right" });
        console.error("Failed to load submissions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        📊 My Submissions
      </h1>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="text-slate-300 text-lg">
            ⏳ Loading submissions...
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-500/10 border-2 border-red-500/30 backdrop-blur-sm rounded-xl p-5 text-red-400">
          <p className="font-bold flex items-center gap-2">
            <span>⚠️</span> Error Loading Submissions
          </p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && submissions.length === 0 ? (
        <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600 rounded-xl p-8 text-center text-slate-300">
          <div className="text-5xl mb-3">🚀</div>
          <p className="text-lg">No submissions yet. Start solving problems!</p>
        </div>
      ) : (
        !loading && (
          <div className="overflow-x-auto rounded-xl border border-slate-700 shadow-2xl">
            <table className="min-w-full text-sm bg-slate-800/50 backdrop-blur-sm">
              <thead className="bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 font-semibold">
                <tr>
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">Problem</th>
                  <th className="p-4 text-left">Language</th>
                  <th className="p-4 text-left">Score</th>
                  <th className="p-4 text-left">Passed</th>
                  <th className="p-4 text-left">Failed</th>
                  <th className="p-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {submissions.map((sub, i) => (
                  <tr
                    key={sub._id}
                    className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors duration-200"
                  >
                    <td className="p-4 text-slate-400">{i + 1}</td>
                    <td className="p-4 font-semibold text-slate-100">
                      {sub.problemId?.title || "Unknown"}
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-500/30">
                        {sub.language}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-bold ${
                          sub.score === 100
                            ? "text-green-400"
                            : sub.score >= 50
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {(sub.score || 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-green-400 font-semibold flex items-center gap-1">
                        ✅ {sub.passedCount}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-red-400 font-semibold flex items-center gap-1">
                        ❌ {sub.failedCount}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
