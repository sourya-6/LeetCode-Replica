// import { writeFile, unlink, mkdir } from "fs/promises";
// import { generateJavaScriptWrapper } from "./utils/generateJavaScriptCodeWrapper.js";
// import { generatePythonWrapper } from "./utils/generatePythonCodeWrapper.js";
// import { executeCode } from "./utils/executeCode.js";
// import { v4 as uuid } from "uuid";
// import path from "path";
// import { Redis } from "@upstash/redis";
// import { updateUserStats } from "./services/stats.service.js";

// // 🔧 Redis client (Upstash)
// const redisClient = new Redis({
//   url: "https://loyal-beetle-26064.upstash.io",
//   token: "AWXQAAIjcDEzZTljMDZmOGIyZmQ0MDBlODY4MTNlMTAyZTBmMmVkZnAxMA",
// });

// console.log("✅ Upstash Redis ready");
// console.log("🚀 Worker started...");

// const JOB_QUEUE = "jobQueue";
// const POLL_INTERVAL = 1000;
// const TEMP_DIR = "./temp";

// const languageExtensions = {
//   python: "py",
//   javascript: "js",
//   cpp: "cpp",
//   java: "java",
//   typescript: "ts",
//   c: "c",
//   csharp: "cs",
//   ruby: "rb",
//   go: "go",
//   rust: "rs",
//   php: "php",
//   swift: "swift",
//   kotlin: "kt",
//   scala: "scala",
//   r: "r",
//   perl: "pl",
//   dart: "dart",
//   bash: "sh",
//   lua: "lua",
//   julia: "jl",
// };

// try {
//   await mkdir(TEMP_DIR, { recursive: true });
//   console.log("📁 Temp directory ready.");
// } catch (err) {
//   console.error("❌ Failed to create temp directory", err.message);
//   process.exit(1);
// }

// async function processJob(job) {
//   const {
//     language,
//     code,
//     functionName = "func",
//     testCases = [],
//     userId,
//     problemId,
//   } = job;
//   console.log("job ra these one", job);
//   const jobId = job.id || uuid();

//   const extension = languageExtensions[language];
//   if (!extension) {
//     return { success: false, error: `❌ Unsupported language: ${language}` };
//   }

//   const fileName = `temp_${jobId}.${extension}`;
//   const filePath = path.join(TEMP_DIR, fileName);

//   let wrappedCode = code;

//   if (language === "python") {
//     try {
//       wrappedCode = generatePythonWrapper({
//         userCode: code,
//         testCases,
//         functionName,
//       });
//       console.log("🐍 Python code wrapped.", wrappedCode);
//     } catch (err) {
//       return {
//         success: false,
//         error: "🔥 Error wrapping Python code: " + err.message,
//       };
//     }
//   }

//   if (language === "javascript") {
//     try {
//       wrappedCode = generateJavaScriptWrapper({
//         userCode: code,
//         testCases,
//         functionName,
//       });
//       console.log("📦 JavaScript code wrapped.");
//     } catch (err) {
//       return {
//         success: false,
//         error: "🔥 Error wrapping JS code: " + err.message,
//       };
//     }
//   }

//   try {
//     await writeFile(filePath, wrappedCode);
//     const rawOutput = await executeCode(filePath, language);
//     await unlink(filePath);

//     let parsedOutput;
//     try {
//       parsedOutput = JSON.parse(rawOutput);
//     } catch (err) {
//       return {
//         success: false,
//         error: "⚠️ Invalid JSON from user code",
//         rawOutput,
//       };
//     }

//     const isAccepted = parsedOutput.failedCount === 0;

//     return {
//       success: true,
//       output: parsedOutput,
//       isAccepted,
//       userId,
//       problemId,
//     };
//   } catch (err) {
//     return { success: false, error: "💥 Execution error: " + err.message };
//   }
// }

// async function pollQueue() {
//   while (true) {
//     try {
//       const jobData = await redisClient.lpop(JOB_QUEUE);

//       if (!jobData) {
//         await new Promise((res) => setTimeout(res, POLL_INTERVAL));
//         continue;
//       }

//       let job;
//       try {
//         job = JSON.parse(jobData);
//       } catch (err) {
//         console.error("❌ Failed to parse job data:", jobData);
//         continue;
//       }
//       console.log(`⚙️  Executing job: ${job.id}`);

//       const result = await processJob(job);

//       // 💾 Store result
//       await redisClient.set(`result:${job.id}`, JSON.stringify(result));

//       if (!result.success) {
//         console.error(
//           `❌ Job ${job.id} failed:\n`,
//           result.error || result.rawOutput
//         );
//       } else {
//         console.log(`✅ Job ${job.id} succeeded:\n`, result.output);

//         if (result.userId) {
//           try {
//             await updateUserStats(result.userId, result.isAccepted);
//             console.log(`📊 Stats updated for user ${result.userId}`);
//           } catch (err) {
//             console.error(`❌ Failed to update stats: ${err.message}`);
//           }
//         }
//       }
//     } catch (err) {
//       console.error("🔥 Worker Error:", err);
//     }
//   }
// }

// pollQueue();

// import { writeFile, unlink, mkdir } from "fs/promises";
// import { generateJavaScriptWrapper } from "./utils/generateJavaScriptCodeWrapper.js";
// import { Problem } from "./models/problem.model.js";
// import { v4 as uuid } from "uuid";
// import path from "path";
// import { executeCode } from "./utils/executeCode.js";
// import { generatePythonWrapper } from "./utils/generatePythonCodeWrapper.js";
// import { createClient } from "redis";
// //import { updateUserStats } from "./src/services/stats.service.js";

// // 🔧 Redis client
// const redisClient = createClient({
//   url: "redis://redis:6379",
// });

// // 🔌 Connect to Redis
// if (!redisClient.isOpen) {
//   try {
//     await redisClient.connect();
//     console.log("✅ Redis Connected");
//   } catch (err) {
//     console.error("❌ Redis connection failed:", err.message);
//     process.exit(1);
//   }
// }

// // 🚀 Worker status
// console.log("🚀 Worker started...");

// const JOB_QUEUE = "jobQueue";
// const POLL_INTERVAL = 1000;
// const TEMP_DIR = "./temp";

// // ✅ Extension map
// const languageExtensions = {
//   python: "py",
//   javascript: "js",
//   cpp: "cpp",
//   java: "java",
//   typescript: "ts",
//   c: "c",
//   csharp: "cs",
//   ruby: "rb",
//   go: "go",
//   rust: "rs",
//   php: "php",
//   swift: "swift",
//   kotlin: "kt",
//   scala: "scala",
//   r: "r",
//   perl: "pl",
//   dart: "dart",
//   bash: "sh",
//   lua: "lua",
//   julia: "jl",
// };

// // 📁 Ensure `temp` directory exists
// try {
//   await mkdir(TEMP_DIR, { recursive: true });
//   console.log("📁 Temp directory ready.");
// } catch (err) {
//   console.error("❌ Failed to create temp directory", err.message);
//   process.exit(1);
// }

// async function processJob(job) {
//   const {
//     language,
//     code,
//     functionName = "func",
//     testCases = [],
//     userId,
//     // problemId,
//   } = job;
//   const jobId = job.id || uuid();

//   // 🔥 Validate language
//   const extension = languageExtensions[language];
//   if (!extension) {
//     return { success: false, error: `❌ Unsupported language: ${language}` };
//   }

//   const fileName = `temp_${jobId}.${extension}`;
//   const filePath = path.join(TEMP_DIR, fileName);

//   let wrappedCode = code;

//   // 🐍 Wrap Python test logic
//   if (language === "python") {
//     try {
//       wrappedCode = generatePythonWrapper({
//         userCode: code,
//         testCases,
//         functionName,
//       });
//       console.log("🐍 Python code wrapped.", wrappedCode);
//     } catch (err) {
//       return {
//         success: false,
//         error: "🔥 Error wrapping Python code: " + err.message,
//       };
//     }
//   }

//   if (language === "javascript") {
//     try {
//       wrappedCode = generateJavaScriptWrapper({
//         userCode: code,
//         testCases,
//         functionName,
//       });
//       console.log("📦 JavaScript code wrapped.");
//     } catch (err) {
//       return {
//         success: false,
//         error: "🔥 Error wrapping JS code: " + err.message,
//       };
//     }
//   }

//   try {
//     await writeFile(filePath, wrappedCode);

//     // ⚙️ Execute Code
//     const rawOutput = await executeCode(filePath, language);

//     // 🧹 Cleanup
//     await unlink(filePath);

//     // 📦 Parse result
//     let parsedOutput;
//     try {
//       parsedOutput = JSON.parse(rawOutput);
//     } catch (err) {
//       return {
//         success: false,
//         error: "⚠️ Invalid JSON from user code",
//         rawOutput,
//       };
//     }
//     console.log('going to fetch the problem id')
//     console.log("User ID",userId);
//     const problem = await Problem.findById(userId);
//     console.log('problem id fetched')
//     console.log(problem)

//     const totalTests = parsedOutput.passedCount + parsedOutput.failedCount;
//     // const scorePerTest = (problem?.maxScore || 100) / totalTests;
//     // parsedOutput.score = Math.round(scorePerTest * parsedOutput.passedCount);
//     if (totalTests > 0) {
//       const scorePerTest = (problem?.maxScore || 100) / totalTests;
//       parsedOutput.score = Math.round(scorePerTest * parsedOutput.passedCount);
//     } else {
//       parsedOutput.score = 0;
//     }

//     // Determine if the submission is accepted
//     const isAccepted = parsedOutput.failedCount === 0;

//     // Return output and isAccepted flag
//     // return {
//     //   success: true,
//     //   output: parsedOutput,
//     //   isAccepted,
//     //   userId, // Pass userId and problemId to use in stats update
//     //   problemId,
//     // };
//     return {
//       success: true,
//       output: {
//         ...parsedOutput,
//         code,
//         language,
//       },
//       isAccepted,
//       userId,
//       // problemId,
//     };
//   } catch (err) {
//     return { success: false, error: "💥 Execution error: " + err.message };
//   }
// }

// async function pollQueue() {
//   while (true) {
//     try {
//       const jobData = await redisClient.lPop(JOB_QUEUE);

//       if (!jobData) {
//         await new Promise((res) => setTimeout(res, POLL_INTERVAL));
//         continue;
//       }

//       const job = JSON.parse(jobData);
//       console.log(`⚙️  Executing job: ${job.id}`);

//       const result = await processJob(job);

//       // Store result in Redis
//       await redisClient.set(`result:${job.id}`, JSON.stringify(result));

//       if (!result.success) {
//         console.error(
//           `❌ Job ${job.id} failed:\n`,
//           result.error || result.rawOutput
//         );
//       } else {
//         console.log(`✅ Job ${job.id} succeeded:\n`, result.output);

//         //  Update user stats if job was successful and has userId and problemId
//         if (result.success && result.userId ) {
//           try {
//             await updateUserStats(
//               result.userId,
//               // result.problemId,
//               result.isAccepted
//             );
//             console.log(`📊 Stats updated for user ${result.userId}`);
//           } catch (err) {
//             console.error(`❌ Failed to update stats: ${err.message}`);
//           }
//         }
//       }
//     } catch (err) {
//       console.error("🔥 Worker Error:", err);
//     }
//   }
// }

// // pollQueue();

import { writeFile, unlink, mkdir } from "fs/promises";
import { generateJavaScriptWrapper } from "./utils/generateJavaScriptCodeWrapper.js";
import { generatePythonWrapper } from "./utils/generatePythonCodeWrapper.js";
import { executeCode } from "./utils/executeCode.js";
import { v4 as uuid } from "uuid";
import path from "path";
import { createClient } from "redis";
import { updateUserStats } from "./services/stats.service.js"; // ✅ Uncommented
import { Redis } from '@upstash/redis'
// 🔧 Redis client
const redisClient = new Redis({
  url: 'https://loyal-beetle-26064.upstash.io',
  token: 'AWXQAAIjcDEzZTljMDZmOGIyZmQ0MDBlODY4MTNlMTAyZTBmMmVkZnAxMA',
})

// 🔌 Connect to Redis
if (!redisClient.isOpen) {
  try {
    // await redisClient.connect();
    console.log("✅ Redis Connected");
  } catch (err) {
    console.error("❌ Redis connection failed:", err.message);
    process.exit(1);
  }
}

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
  const { language, code, functionName = "func", testCases = [], userId, problemId } = job;
  console.log("job ra these one",job)
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
      wrappedCode = generatePythonWrapper({ userCode: code, testCases, functionName });
      console.log("🐍 Python code wrapped.", wrappedCode);
    } catch (err) {
      return { success: false, error: "🔥 Error wrapping Python code: " + err.message };
    }
  }

  // 📦 Wrap JavaScript test logic
  if (language === "javascript") {
    try {
      wrappedCode = generateJavaScriptWrapper({ userCode: code, testCases, functionName });
      console.log("📦 JavaScript code wrapped.");
    } catch (err) {
      return { success: false, error: "🔥 Error wrapping JS code: " + err.message };
    }
  }

  try {
    await writeFile(filePath, wrappedCode);

    // ⚙️ Execute Code
    const rawOutput = await executeCode(filePath, language);

    // 🧹 Cleanup
    await unlink(filePath);

    // 📦 Parse result
    let parsedOutput;
    try {
      console.log("rawOutput", rawOutput);
      parsedOutput = JSON.parse(rawOutput);
    } catch (err) {
      return {
        success: false,
        error: "⚠️ Invalid JSON from user code",
        rawOutput,
      };
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
      const jobData = await redisClient.lpop(JOB_QUEUE);

      if (!jobData) {
        await new Promise((res) => setTimeout(res, POLL_INTERVAL));
        continue;
      }
      console.log("jobData", typeof jobData);
      // const job = JSON.parse(jobData);
      
      const job = jobData;
      console.log(`⚙️  Executing job: ${job.id}`);

      const result = await processJob(job);

      // Store result in Redis
      await redisClient.set(`result:${job.id}`, JSON.stringify(result));

      if (!result.success) {
        console.error(`❌ Job ${job.id} failed:\n`, result.error || result.rawOutput);
      } else {
        console.log(`✅ Job ${job.id} succeeded:\n`, result.output);

        // ⭐ Update user stats
        console.log(result.userId ,"vachindhi mama",)
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
