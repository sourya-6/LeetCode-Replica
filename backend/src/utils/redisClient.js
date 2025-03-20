import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

(async () => {
    try {
        await redisClient.connect();
        console.log("✅ Redis Connected");
    } catch (error) {
        console.error("❌ Redis Connection Failed", error);
    }
})();

export default redisClient;
