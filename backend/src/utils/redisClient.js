import { createClient } from "redis";
import { Redis } from '@upstash/redis'
// const redisClient = createClient({
//   url: process.env.REDIS_URL || "redis://redis:6379",
// });
// const redisClient = createClient({
//   url: "redis://default:AWXQAAIjcDEzZTljMDZmOGIyZmQ0MDBlODY4MTNlMTAyZTBmMmVkZnAxMA@loyal-beetle-26064.upstash.io:6379"
// });
const redisClient = new Redis({
  url: 'https://loyal-beetle-26064.upstash.io',
  token: 'AWXQAAIjcDEzZTljMDZmOGIyZmQ0MDBlODY4MTNlMTAyZTBmMmVkZnAxMA',
})
redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

(async () => {
  try {
    // await redisClient.connect();
    console.log("✅ Redis Connected");
  } catch (error) {
    console.error("❌ Redis Connection Failed", error);
  }
})();

export default redisClient;
