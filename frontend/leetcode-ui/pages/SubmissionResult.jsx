import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SubmissionResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.result) return <p className="text-center mt-10">No result data.</p>;

  const { jobId, result, problem, language, code } = state;
  console.log('1',result.output)
  
  

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Submission Result</h2>
      <p><strong>Job ID:</strong> {jobId}</p>
      <p><strong>Language:</strong> {language}</p>

      <h3 style={{ marginTop: '20px' }}>Test Case Results:</h3>
      <div style={{ marginTop: '10px' }}>
        {result.output.testResults.map((test, idx) => (
          <div
            key={idx}
            style={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '12px',
              backgroundColor: test.passed ? '#e6ffed' : '#ffe6e6',
            }}
          >
            <p><strong>Input:</strong> {test.input}</p>
            <p><strong>Expected Output:</strong> {String(test.expectedOutput)}</p>
            <p><strong>Actual Output:</strong> {test.output}</p>
            <p>
              <strong>Result:</strong>{' '}
              <span style={{ color: test.passed ? 'green' : 'red' }}>
                {test.passed ? '✅ Passed' : '❌ Failed'}
              </span>
            </p>
          </div>
        ))}
      </div>

      <h4>
        Final Verdict:{' '}
        <span style={{ color: result.isAccepted ? 'green' : 'red' }}>
          {result.isAccepted ? '✅ Accepted' : '❌ Wrong Answer'}
        </span>
      </h4>

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: '20px',
          padding: '10px 16px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Back to Problem
      </button>
    </div>
  );
}