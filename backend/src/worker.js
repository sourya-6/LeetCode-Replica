import redisClient from "./utils/redisClient.js";
import { exec } from "child_process";

async function processJobs() {
    console.log("Worker started...");
    
    while (true) {
        const jobData = await redisClient.lpop("jobQueue");
        if (!jobData) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before checking again
            continue;
        }

        const { jobId, code, language } = JSON.parse(jobData);
        console.log(`Executing job: ${jobId}`);

        let command;
        if (language === "python") {
            command = `python3 -c "${code}"`;
        } else if (language === "javascript") {
            command = `node -e "${code}"`;
        } else {
            await redisClient.set(`jobResults:${jobId}`, "Error: Unsupported language");
            continue;
        }

        exec(command, async (err, stdout, stderr) => {
            if (err) {
                await redisClient.set(`jobResults:${jobId}`, `Error: ${stderr}`);
            } else {
                await redisClient.set(`jobResults:${jobId}`, stdout);
            }
        });
    }
}

processJobs();
