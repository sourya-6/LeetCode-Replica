export function generatePythonWrapper({ userCode, testCases, functionName }) {
    userCode = userCode.replace(/\t/g, '    '); // Convert tabs to spaces for Python
  
    let code = `${userCode}\n\nimport json\nresults = []\n\n`;
  
    const jsToPython = (value) => {
      if (typeof value === 'boolean') return value ? 'True' : 'False';
      return JSON.stringify(value);
    };
  
    for (const testCase of testCases) {
      const { input, expectedOutput } = testCase;
  
      code +=
        `try:\n` +
        `    output = ${functionName}(${input})\n` +
        `    passed = str(output) == str(${jsToPython(expectedOutput)})\n` +
        `    results.append({\n` +
        `        "input": ${JSON.stringify(input)},\n` +
        `        "expected": ${jsToPython(expectedOutput)},\n` +
        `        "output": str(output),\n` +
        `        "passed": passed\n` +
        `    })\n` +
        `except Exception as e:\n` +
        `    results.append({\n` +
        `        "input": ${JSON.stringify(input)},\n` +
        `        "expected": ${jsToPython(expectedOutput)},\n` +
        `        "output": str(e),\n` +
        `        "passed": False\n` +
        `    })\n`;
    }
  
    code += `\nprint(json.dumps(results))\n`;
  
    return code;
  }
  