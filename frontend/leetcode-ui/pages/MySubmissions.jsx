import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get("/submissions");
        setSubmissions(res.data.submissions); // from ApiResponse
      } catch (err) {
        console.error("Failed to load submissions", err);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📜 My Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Problem</th>
                <th className="p-3">Language</th>
                <th className="p-3">Score</th>
                <th className="p-3">Passed</th>
                <th className="p-3">Failed</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, i) => (
                <tr key={sub._id} className="border-t">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{sub.problemId?.title}</td>
                  <td className="p-3">{sub.language}</td>
                  <td className="p-3">{sub.score}</td>
                  <td className="p-3">{sub.passedCount}</td>
                  <td className="p-3">{sub.failedCount}</td>
                  <td className="p-3">{new Date(sub.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
