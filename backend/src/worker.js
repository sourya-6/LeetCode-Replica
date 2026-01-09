import { writeFile, unlink, mkdir } from "fs/promises";
import { generateJavaScriptWrapper } from "./utils/generateJavaScriptCodeWrapper.js";
import { generatePythonWrapper } from "./utils/generatePythonCodeWrapper.js";
import { executeCode } from "./utils/executeCode.js";
import { v4 as uuid } from "uuid";
import path from "path";
import { createClient } from "redis";
import { updateUserStats } from "./services/stats.service.js";

// 🔧 Redis client - Local Docker Redis
const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = process.env.REDIS_PORT || "6379";
const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
  socket: {
    reconnectStrategy: (retries) => (retries < 10 ? retries * 100 : false),
  },
});

// 🔌 Connect to Redis
redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

await redisClient.connect();

// 🚀 Worker status
console.log("🚀 Worker started...");

const JOB_QUEUE = "jobQueue";
const POLL_INTERVAL = 1000;
const TEMP_DIR = "./temp";

// ✅ Extension map
const languageExtensions = {
  python: "py",
  javascript: "js",
  cpp: "cpp",
  java: "java",
  typescript: "ts",
  c: "c",
  csharp: "cs",
  ruby: "rb",
  go: "go",
  rust: "rs",
  php: "php",
  swift: "swift",
  kotlin: "kt",
  scala: "scala",
  r: "r",
  perl: "pl",
  dart: "dart",
  bash: "sh",
  lua: "lua",
  julia: "jl",
};

// 📁 Ensure temp directory exists
try {
  await mkdir(TEMP_DIR, { recursive: true });
  console.log("📁 Temp directory ready.");
} catch (err) {
  console.error("❌ Failed to create temp directory", err.message);
  process.exit(1);
}

async function processJob(job) {
  const {
    language,
    code,
    functionName = "func",
    testCases = [],
    userId,
    problemId,
  } = job;
  console.log("job ra these one", job);
  const jobId = job.id || uuid();

  // 🔥 Validate language
  const extension = languageExtensions[language];
  if (!extension) {
    return { success: false, error: `❌ Unsupported language: ${language}` };
  }

  const fileName = `temp_${jobId}.${extension}`;
  const filePath = path.join(TEMP_DIR, fileName);

  let wrappedCode = code;

  // 🐍 Wrap Python test logic
  if (language === "python") {
    try {
      wrappedCode = generatePythonWrapper({
        userCode: code,
        testCases,
        functionName,
      });
      console.log("🐍 Python code wrapped.", wrappedCode);
    } catch (err) {
      return {
        success: false,
        error: "🔥 Error wrapping Python code: " + err.message,
      };
    }
  }

  // 📦 Wrap JavaScript test logic
  if (language === "javascript") {
    try {
      wrappedCode = generateJavaScriptWrapper({
        userCode: code,
        testCases,
        functionName,
      });
      console.log("📦 JavaScript code wrapped.");
    } catch (err) {
      return {
        success: false,
        error: "🔥 Error wrapping JS code: " + err.message,
      };
    }
  }

  try {
    await writeFile(filePath, wrappedCode);

    // ⚙️ Execute Code
    // Pass testCases to allow compiled languages (e.g., C++) to read stdin per case
    const rawOutput = await executeCode(filePath, language, testCases);

    // 🧹 Cleanup
    await unlink(filePath);

    // 📦 Parse result
    let parsedOutput;
    try {
      console.log("rawOutput", rawOutput);
      // Try JSON first (Python, JavaScript)
      parsedOutput = JSON.parse(rawOutput);
    } catch (err) {
      // If JSON parsing fails, try pipe-separated format (C++, Java, etc.)
      console.log("📌 JSON parsing failed, trying pipe-separated format...");
      try {
        const outputsRaw = (rawOutput ?? "").trim();
        const outputs = outputsRaw.length
          ? outputsRaw.split("|").map((s) => s.trim())
          : [];

        const testResults = testCases.map((testCase, i) => {
          const out = outputs[i] ?? "";
          const passed = out === testCase.expectedOutput;
          return {
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            output: out,
            passed,
          };
        });

        const passedCount = testResults.filter((t) => t.passed).length;
        const failedCount = testResults.length - passedCount;

        parsedOutput = {
          passedCount,
          failedCount,
          testResults,
        };
      } catch (parseErr) {
        return {
          success: false,
          error: "⚠️ Invalid JSON from user code",
          rawOutput,
        };
      }
    }

    // Determine if the submission is accepted
    const isAccepted = parsedOutput.failedCount === 0;

    // Return output and isAccepted flag
    return {
      success: true,
      output: parsedOutput,
      isAccepted,
      userId,
      problemId,
    };
  } catch (err) {
    return { success: false, error: "💥 Execution error: " + err.message };
  }
}

async function pollQueue() {
  while (true) {
    try {
      const jobData = await redisClient.lPop(JOB_QUEUE);

      if (!jobData) {
        await new Promise((res) => setTimeout(res, POLL_INTERVAL));
        continue;
      }

      const job = JSON.parse(jobData);
      console.log(`⚙️  Executing job: ${job.id}`);

      const result = await processJob(job);

      // Store result in Redis
      await redisClient.set(`result:${job.id}`, JSON.stringify(result));

      if (!result.success) {
        console.error(
          `❌ Job ${job.id} failed:\n`,
          result.error || result.rawOutput
        );
      } else {
        console.log(`✅ Job ${job.id} succeeded:\n`, result.output);

        // ⭐ Update user stats
        console.log(result.userId, "vachindhi mama");
        // if (result.userId ) {
        //   console.log("just get into  it")
        //   try {
        //     await updateUserStats(result.userId,  result.isAccepted);
        //     console.log(`📊 Stats updated for user ${result.userId}`);
        //   } catch (err) {
        //     console.error(`❌ Failed to update stats: ${err.message}`);
        //   }
        // }
      }
    } catch (err) {
      console.error("🔥 Worker Error:", err);
    }
  }
}

pollQueue();
