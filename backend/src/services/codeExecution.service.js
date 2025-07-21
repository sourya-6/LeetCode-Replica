import { createClient } from "redis";
import { v4 as uuid } from "uuid";

// const redisClient = createClient({ url: "redis://redis:6379" });
// const redisClient = createClient({
//   url: "redis://default:AWXQAAIjcDEzZTljMDZmOGIyZmQ0MDBlODY4MTNlMTAyZTBmMmVkZnAxMA@loyal-beetle-26064.upstash.io:6379"
// });
import { Redis } from '@upstash/redis'
const redisClient = new Redis({
  url: 'https://loyal-beetle-26064.upstash.io',
  token: 'AWXQAAIjcDEzZTljMDZmOGIyZmQ0MDBlODY4MTNlMTAyZTBmMmVkZnAxMA',
})
// await redisClient.connect();

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
