# 🔍 LeetCode Replica Backend - Code Scan Report

**Date:** December 17, 2025  
**Project:** LeetCode Replica  
**Scanned:** `d:\fun talk\projects\leetCode Replica\backend`

---

## 📋 Executive Summary

Found **12 significant issues** across the codebase that need attention, ranging from security concerns to code quality problems.

---

## 🚨 CRITICAL ISSUES

### 1. **Unused/Incorrect NPM Dependency** ⚠️

**File:** [package.json](package.json)  
**Line:** 18  
**Issue:** `"child_process": "^1.0.2"` is installed as a dependency  
**Problem:**

- `child_process` is a Node.js built-in module, NOT an npm package
- Installing it from npm is incorrect and can cause version conflicts
- The npm package is unmaintained and different from the built-in module

**Fix:**

```json
// Remove from dependencies:
// "child_process": "^1.0.2",

// Correct usage in code:
import { exec } from "child_process"; // Built-in, no installation needed
```

---

### 2. **Unused Built-in Modules as Dependencies** ⚠️

**File:** [package.json](package.json)  
**Lines:** 17, 25  
**Issue:** `"fs": "^0.0.1-security"` and `"util": "^0.12.5"` are installed as npm packages  
**Problem:**

- Both `fs` and `util` are Node.js built-in modules
- Should NOT be in npm dependencies
- Can cause module resolution conflicts

**Fix:**

```json
// Remove from dependencies:
// "fs": "^0.0.1-security",
// "util": "^0.12.5",
```

---

### 3. **Missing Environment Variables** ⚠️

**File:** [src/utils/executeCode.js](src/utils/executeCode.js)  
**Issue:** Uses hardcoded system commands without environment validation  
**Problem:**

- No check if `python3`, `node`, or `g++` are installed on the system
- Will crash if required tools are not available
- Docker container may not have these pre-installed

**Recommended Fix:**

```javascript
// Add validation before executing
const validateDependencies = async () => {
  const deps = { python3: 'python', node: 'node', g++: 'g++' };
  for (const [tool, cmd] of Object.entries(deps)) {
    try {
      await execPromise(`which ${tool}`);
    } catch {
      throw new Error(`${tool} not found. Install it first.`);
    }
  }
};
```

---

### 4. **SQL Injection / Command Injection Vulnerability** 🔴

**File:** [src/utils/executeCode.js](src/utils/executeCode.js#L8-L20)  
**Issue:** User code execution using `exec()` with unsanitized file paths  
**Problem:**

```javascript
command = `python3 ${filePath}`; // Vulnerable to path injection!
```

- Attacker can inject shell commands via filePath
- Example: `filePath = "test.py && rm -rf /"`
- Uses `exec()` instead of safer `spawn()` which parses shell

**Fix:**

```javascript
import { spawn } from "child_process";

// Use spawn instead of exec
const executeCode = async (filePath, language) => {
  let command,
    args = [];

  if (language === "python") {
    command = "python3";
    args = [filePath];
  }

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { timeout: 5000 });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => (stdout += data));
    child.stderr.on("data", (data) => (stderr += data));
    child.on("close", (code) => {
      if (code !== 0) reject(new Error(stderr));
      else resolve(stdout.trim());
    });
  });
};
```

---

## ⚠️ HIGH PRIORITY ISSUES

### 5. **Hardcoded Secrets Still in Code** 🔐

**File:** [src/worker.js](src/worker.js#L11-L14) (Commented Out)  
**Issue:** Upstash Redis credentials visible in commented code
**Problem:**

```javascript
// const redisClient = new Redis({
//   url: "https://loyal-beetle-26064.upstash.io",
//   token: "AWXQAAIjcDEzZTljMDZmOGIyZmQ0MDBlODY4MTNlMTAyZTBmMmVkZnoxMA",
// });
```

- Even commented code should not contain secrets
- Can be exposed in git history
- Already visible in this scan

**Fix:**

- Remove commented code entirely
- Use environment variables for all credentials
- Run `git filter-branch` to remove from history (done previously)

---

### 6. **Missing Error Handler Middleware** ⚠️

**File:** [src/app.js](src/app.js#L40)  
**Issue:** No error handling middleware at the end
**Problem:**

```javascript
export { app };
// No error handler middleware!
```

- Unhandled errors in async routes won't have proper error responses
- Stack traces exposed to clients in some scenarios

**Fix:**

```javascript
// Add at the end of app.js
app.use((err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    statusCode: status,
    message: message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

export { app };
```

---

### 7. **Weak Password Hashing** 🔐

**File:** [src/models/user.models.js](src/models/user.models.js#L45)  
**Issue:** Default bcrypt rounds might be too low
**Problem:**

```javascript
this.password = await bcrypt.hash(this.password, 10);
```

- While 10 rounds is acceptable, industry standard is 12+
- Slower machines may salt with lower values

**Recommended Fix:**

```javascript
this.password = await bcrypt.hash(this.password, 12);
```

---

### 8. **Verbose Debug Logging** 🐛

**File:** [src/index.js](src/index.js#L4), [src/controllers/codeExecution.controller.js](src/controllers/codeExecution.controller.js#L12), [src/utils/executeCode.js](src/utils/executeCode.js#L29)  
**Issue:** Multiple `console.log()` statements left in production code  
**Problem:**

```javascript
console.log("hey"); // Line 4 in index.js
console.log(userId, "Getting into it"); // Logging user IDs
console.log("hey"); // Redundant logs
```

- Performance impact from logging to stdout
- Can leak sensitive information
- Makes logs hard to parse

**Fix:**

- Use a proper logging library (winston, pino, bunyan)
- Remove debug console.log statements
- Keep only error/warning logs in production

---

### 9. **Missing Input Validation** ✔️

**File:** [src/controllers/user.controller.js](src/controllers/user.controller.js#L10-L13)  
**Issue:** Incomplete email validation
**Problem:**

```javascript
// const validateEmail = validateEmail(email);  // Commented out!
// if(!validateEmail){
//   throw new ApiError(400, "Invalid email!");
// }
```

- Email validation is commented and not working
- Only checks for non-empty strings

**Fix:**

```javascript
import validator from "email-validator"; // or use regex

if (!validator.validate(email)) {
  throw new ApiError(400, "Invalid email format!");
}
```

---

### 10. **Weak CORS Configuration** 🌐

**File:** [src/app.js](src/app.js#L8-L13)  
**Issue:** Overly permissive CORS with multiple origins including third-party APIs
**Problem:**

```javascript
origin: ["http://localhost:5173", "https://www.paypal.com", "https://www.sandbox.paypal.com","https://leet-code-replica.vercel.app"],
```

- PayPal domains don't need backend CORS access
- Should use environment variables
- Hardcoded production domain visible

**Fix:**

```javascript
const ALLOWED_ORIGINS = process.env.CORS_ORIGINS?.split(",") || [
  "http://localhost:5173",
  "https://leet-code-replica.vercel.app",
];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

---

## 📝 MEDIUM PRIORITY ISSUES

### 11. **Missing Request Rate Limiting** ⏱️

**Issue:** No rate limiting middleware
**Problem:**

- Code execution endpoint can be abused
- No protection against brute force attacks
- No quota per user

**Recommended Fix:**

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from "express-rate-limit";

const codeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many code submissions, try again later",
});

router.post("/submit", codeLimiter, executeCodeController);
```

---

### 12. **Missing .gitkeep Files with Empty Directories** 📁

**Issue:** Several empty directories have `.gitkeep` but some don't track properly

- `src/controllers/` - OK (has .gitkeep)
- `src/routes/` - OK (has .gitkeep)
- Need consistent treatment

---

## ✅ POSITIVE FINDINGS

- ✅ Good use of `asyncHandler` for error handling
- ✅ Proper JWT implementation with token generation
- ✅ Good schema design with timestamps
- ✅ Docker configuration improved with env_file
- ✅ `.env` file properly excluded from git
- ✅ Multer configuration for file uploads

---

## 🔧 QUICK FIX PRIORITY LIST

1. **URGENT:** Remove built-in module dependencies (fs, util, child_process)
2. **URGENT:** Replace `exec()` with `spawn()` for code execution
3. **HIGH:** Remove/fix commented credentials in worker.js
4. **HIGH:** Add error handler middleware to app.js
5. **HIGH:** Fix email validation in registerUser
6. **HIGH:** Update CORS configuration to use env variables
7. **MEDIUM:** Remove debug console.log statements
8. **MEDIUM:** Add rate limiting to code submission
9. **MEDIUM:** Increase bcrypt rounds to 12
10. **LOW:** Add input validation library

---

## 📦 Dockerfile Improvements Needed

Current Dockerfile installs `uuid` twice:

```dockerfile
RUN npm install
RUN npm install uuid  # Redundant! Already in package.json
```

**Fix:**

```dockerfile
FROM node:18-alpine  # Use alpine for smaller image
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production  # Use ci instead of install
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
```

---

## 🎯 Next Steps

1. Create a new branch: `git checkout -b fix/security-issues`
2. Apply critical fixes first
3. Test thoroughly with: `docker compose up --build`
4. Run security audit: `npm audit`
5. Create pull request with fixes
