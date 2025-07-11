export function generateJavaScriptWrapper({ userCode, testCases, functionName }) {
  const parsedCases = testCases.map(tc => {
    const [inputStr, expectedOutput] = [tc.input, tc.expectedOutput];
    return {
      input: JSON.parse(`[${inputStr}]`),
      expected: JSON.parse(expectedOutput)
    };
  });

  return `
${userCode}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const testResults = [];
let passedCount = 0;

const testCases = ${JSON.stringify(parsedCases)};

for (const tc of testCases) {
  let actual;
  try {
    actual = ${functionName}(...tc.input);
  } catch (e) {
    actual = "Execution failed";
  }

  const passed = deepEqual(actual, tc.expected);
  if (passed) passedCount++;

  testResults.push({
    input: JSON.stringify(tc.input),
    expectedOutput: JSON.stringify(tc.expected),
    output: typeof actual === 'string' ? actual : JSON.stringify(actual),
    passed
  });
}

const finalResult = {
  passedCount,
  failedCount: testCases.length - passedCount,
  testResults
};

console.log(JSON.stringify(finalResult));
`;
}
