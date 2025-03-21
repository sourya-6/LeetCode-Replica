import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379", // 🔥 Use 'redis' instead of 'localhost'
});

redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

(async () => {
  try {
    await redisClient.connect();
    console.log(
      "✅ Redis Connected to",
      process.env.REDIS_URL || "redis://redis:6379"
    );
  } catch (error) {
    console.error("❌ Redis Connection Failed", error);
  }
})();

export default redisClient;
