import { spawn } from "child_process";
import path from "path";

// Safe code execution using spawn instead of exec
export const executeCode = async (filePath, language, testCases = []) => {
  // Validate language
  const supportedLanguages = ["python", "javascript", "cpp", "java", "c"];
  if (!supportedLanguages.includes(language)) {
    throw new Error("Unsupported language");
  }

  // Validate file path - prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  if (normalizedPath.includes("..")) {
    throw new Error("Invalid file path");
  }

  // Helper to spawn a process and capture full stdout/stderr
  const runProcess = (cmd, args, opts = {}) =>
    new Promise((resolve, reject) => {
      const child = spawn(cmd, args, {
        timeout: 5000,
        stdio: ["pipe", "pipe", "pipe"],
        ...opts,
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("error", (err) => {
        reject(new Error(`Failed to execute: ${err.message}`));
      });

      // If stdin data is provided, write it to the process
      if (opts.stdinData && child.stdin) {
        try {
          child.stdin.write(opts.stdinData);
          child.stdin.end();
        } catch (e) {
          // Ignore stdin write errors; process may not read stdin
        }
      }

      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(stderr || `Process exited with code ${code}`));
        } else {
          resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
        }
      });

      // Timeout handling (hard kill)
      setTimeout(() => {
        child.kill();
        reject(new Error("Code execution timeout (5s limit)"));
      }, 5000);
    });

  // Python / JavaScript: run interpreter and return last line (wrappers output JSON)
  if (language === "python") {
    const { stdout } = await runProcess("python3", [filePath]);
    const lines = stdout.split("\n");
    return lines[lines.length - 1];
  }

  if (language === "javascript") {
    const { stdout } = await runProcess("node", [filePath]);
    const lines = stdout.split("\n");
    return lines[lines.length - 1];
  }

  // C++: compile then run and return full stdout (pipe-separated outputs)
  if (language === "cpp") {
    const outputPath = filePath.replace(/\.cpp$/, ".out");

    // Compile
    await runProcess("g++", ["-O2", "-std=c++17", filePath, "-o", outputPath]);

    // Run compiled binary
    // If test cases are provided, execute once per test case and feed stdin
    if (Array.isArray(testCases) && testCases.length > 0) {
      const outputs = [];
      for (const tc of testCases) {
        const inputStr = (tc?.input ?? "") + "\n";
        const { stdout } = await runProcess(outputPath, [], {
          stdinData: inputStr,
        });
        outputs.push(stdout.trim());
      }
      return outputs.join("|");
    }

    // Otherwise, run without stdin and return full stdout
    const { stdout } = await runProcess(outputPath, []);
    return stdout; // full stdout, e.g., "[0,1]|[1,2]|[0,1]"
  }

  throw new Error("Unsupported language");
};
