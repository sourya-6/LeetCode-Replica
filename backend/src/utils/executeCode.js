import { exec } from "child_process";
import util from "util";
import path from "path";
import fs from "fs";

const execPromise = util.promisify(exec);

export const executeCode = async (filePath, language) => {
  let command = "";

  if (language === "python") {
    command = `python3 ${filePath}`;
  } else if (language === "javascript") {
    command = `node ${filePath}`;
  } else if (language === "cpp") {
    const outputPath = filePath.replace(/\.cpp$/, ".out");
    command = `g++ ${filePath} -o ${outputPath} && ${outputPath}`;
  } else {
    throw new Error("Unsupported language");
  }

  try {
    const { stdout, stderr } = await execPromise(command, { timeout: 5000 });

    if (stderr) {
      throw new Error(stderr);
    }

    const lines = stdout.trim().split("\n");
    const lastLine = lines[lines.length - 1];
    return lastLine;
  } catch (error) {
    throw new Error(error.message || "Execution failed");
  }
};
