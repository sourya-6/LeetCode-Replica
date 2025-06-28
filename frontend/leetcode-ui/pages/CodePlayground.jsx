import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import axios from '../utils/axios';

const CodePlayground = () => {
  const { id } = useParams(); // <- dynamic problem ID from URL
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('// Write your function here');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch problem details
  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await axios.get(`/problem/${id}`);
        setProblem(res.data.message);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    if (!problem) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post('/codeExecution/submit', {
        language,
        code,
        problemId: problem._id,
        functionName: problem.functionName,
        testCases: problem.testCases,
      });

      const jobId = res.data.message.jobId;

      // Poll for result
      let retries = 20;
      while (retries--) {
        const poll = await axios.get(`/codeExecution/result/${jobId}`);
        if (poll.data.message?.result) {
          setResult(poll.data.message.result);
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (err) {
      console.error(err);
      setResult({ error: 'Submission failed.' });
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return <p className="text-center mt-10">Loading Problem...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
      <p className="mb-4 text-gray-700">{problem.description}</p>

      <label>Language:</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="ml-2 px-2 py-1 border rounded"
      >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <div className="mt-4">
        <CodeEditor language={language} value={code} onChange={setCode} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Submitting...' : 'Submit Code'}
      </button>

      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Result</h3>
          {result.error && <p className="text-red-500">{result.error}</p>}
          {result.output && (
            <ul className="list-disc list-inside text-sm">
              {result.output.map((tc, i) => (
                <li key={i}>
                  <strong>Input:</strong> {tc.input} | <strong>Expected:</strong>{' '}
                  {String(tc.expected)} | <strong>Output:</strong> {tc.output} |{' '}
                  {tc.passed ? '✅ Passed' : '❌ Failed'}
                </li>
              ))}
            </ul>
          )}
          {typeof result.isAccepted === 'boolean' && (
            <h4
              className={`mt-4 font-bold ${
                result.isAccepted ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {result.isAccepted ? 'Accepted ✅' : 'Wrong Answer ❌'}
            </h4>
          )}
        </div>
      )}
    </div>
  );
};

export default CodePlayground;
