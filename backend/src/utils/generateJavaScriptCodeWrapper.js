export function generateJavaScriptWrapper({ userCode, testCases, functionName }) {
  return `
${userCode}

function runTests() {
  const results = [];
  const testCases = ${JSON.stringify(testCases)};

  for (const { input, expectedOutput } of testCases) {
    try {
      const parsedInput = JSON.parse(input);
      const output = ${functionName}(...parsedInput);

      const normalizedOutput = typeof output === 'string' ? output : JSON.stringify(output);
      const passed = normalizedOutput === expectedOutput;

      results.push({
        input,
        expectedOutput,
        output: normalizedOutput,
        passed
      });
    } catch (err) {
      results.push({
        input,
        expectedOutput,
        output: err.toString(),
        passed: false
      });
    }
  }

  console.log(JSON.stringify({
    passedCount: results.filter(r => r.passed).length,
    failedCount: results.filter(r => !r.passed).length,
    testResults: results
  }));
}

runTests();
`;
}





// export function generateJavaScriptWrapper({ userCode, testCases, functionName }) {
//   return `
// ${userCode}

// function runTests() {
//   const results = [];
//   const testCases = ${JSON.stringify(testCases)};

//   for (const { input, expectedOutput } of testCases) {
//     try {
//       const parsedInput = JSON.parse(input);
//       const output = ${functionName}(parsedInput);

//       const normalizedOutput = typeof output === 'string' ? output : JSON.stringify(output);
//       const passed = normalizedOutput === expectedOutput;

//       results.push({
//         input,
//         expectedOutput,
//         output: normalizedOutput,
//         passed
//       });
//     } catch (err) {
//       results.push({
//         input,
//         expectedOutput,
//         output: err.toString(),
//         passed: false
//       });
//     }
//   }

//   console.log(JSON.stringify({
//     passedCount: results.filter(r => r.passed).length,
//     failedCount: results.filter(r => !r.passed).length,
//     testResults: results
//   }));
// }

// runTests();
// `;
// }
