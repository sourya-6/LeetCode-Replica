import { createClient } from "redis";
import { v4 as uuid } from "uuid";

const redisClient = createClient({ url: "redis://redis:6379" });
await redisClient.connect();

export const submitCode = async (userId, code, language, functionName, testCases) => {
  const jobId = uuid();
  const job = {
    id: jobId,
    userId,
    code,
    language,
    functionName,
    testCases,
  };

  await redisClient.rPush("jobQueue", JSON.stringify(job));
  return jobId;
};

export const getCodeExecutionResult = async (jobId) => {
  const result = await redisClient.get(`result:${jobId}`);
  return result ? JSON.parse(result) : null;
};
