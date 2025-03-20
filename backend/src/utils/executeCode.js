import { exec } from "child_process";

export const executeCode = (code, language) => {
    return new Promise((resolve, reject) => {
        let command;
        if (language === "python") command = `python3 -c "${code}"`;
        else if (language === "javascript") command = `node -e "${code}"`;
        else return reject("Unsupported language");

        exec(command, (err, stdout, stderr) => {
            if (err) return reject(stderr);
            resolve(stdout);
        });
    });
};
