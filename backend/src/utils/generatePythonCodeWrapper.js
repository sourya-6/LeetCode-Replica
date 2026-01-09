// export function generatePythonWrapper({ userCode, testCases, functionName }) {
//   userCode = userCode.replace(/\t/g, '    '); // tabs → spaces

//   let code = `${userCode}\n\nimport json\nresults = []\npassed = 0\nfailed = 0\n\n`;

//   const jsToPython = (value) => {
//     if (typeof value === 'boolean') return value ? 'True' : 'False';
//     return JSON.stringify(value);
//   };

//   for (const testCase of testCases) {
//     const { input, expectedOutput } = testCase;

//     code +=
//       `try:\n` +
//       `    output = ${functionName}(${input})\n` +
//       `    passed_case = output == ${jsToPython(expectedOutput)}\n` +
//       `    if passed_case:\n` +
//       `        passed += 1\n` +
//       `    else:\n` +
//       `        failed += 1\n` +
//       `    results.append({\n` +
//       `        "input": ${JSON.stringify(input)},\n` +
//       `        "expected": ${jsToPython(expectedOutput)},\n` +
//       `        "output": output,\n` +
//       `        "passed": passed_case\n` +
//       `    })\n` +
//       `except Exception as e:\n` +
//       `    failed += 1\n` +
//       `    results.append({\n` +
//       `        "input": ${JSON.stringify(input)},\n` +
//       `        "expected": ${jsToPython(expectedOutput)},\n` +
//       `        "output": str(e),\n` +
//       `        "passed": False\n` +
//       `    })\n`;
//   }

//   code += `\nprint(json.dumps({ "passedCount": passed, "failedCount": failed, "testResults": results }))\n`;

//   return code;
// }

export function generatePythonWrapper({ userCode, testCases, functionName }) {
  userCode = userCode.replace(/\t/g, '    '); // tabs → spaces

  let code = `${userCode}\n\nimport json\nresults = []\npassed = 0\nfailed = 0\n\n`;

  // const jsToPython = (value) => {
  //   if (value==="true" || value === "false") return value === "true" ? 'True' : 'False';
  //   return JSON.stringify(value);
    
  // };
  function jsToPython(value) {
  if (typeof value === 'string') {
    return `${value}`; // wrap in double quotes for Python string
  } else if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  } else {
    return value;
  }
}


  for (const testCase of testCases) {
    const { input, expectedOutput } = testCase;

    code +=
      `try:\n` +
      `    output = ${functionName}(${input})\n` +
      
      `    passed_case = str(output) == str(${jsToPython(expectedOutput)})\n` + // 👈 fix here
      `    if passed_case:\n` +
      `        passed += 1\n` +
      `    else:\n` +
      `        failed += 1\n` +
      `    results.append({\n` +
      `        "input": ${JSON.stringify(input)},\n` +
      `        "expected": str(${jsToPython(expectedOutput)}),\n` + // 👈 ensure string
      `        "output": str(output),\n` +                          // 👈 ensure string
      `        "passed": passed_case\n` +
      `    })\n` +
      `except Exception as e:\n` +
      `    failed += 1\n` +
      `    results.append({\n` +
      `        "input": ${JSON.stringify(input)},\n` +
      `        "expected": str(${jsToPython(expectedOutput)}),\n` +
      `        "output": str(e),\n` +
      `        "passed": False\n` +
      `    })\n`;
  }

  code += `\nprint(json.dumps({ "passedCount": passed, "failedCount": failed, "testResults": results }))\n`;

  return code;
}
