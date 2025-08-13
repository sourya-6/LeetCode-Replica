
---

#  CodeArena – MERN Stack Online Code Execution Platform

CodeArena is a **production-ready MERN stack online coding platform** with **real-time code execution**, **problem management**, **submission tracking**, and **multi-language support**.

---

## 🚀 Features Implemented

### 1. Authentication & User Management

* JWT authentication using **HTTP-only cookies** (access & refresh tokens)
* Email verification with OTP via **Nodemailer**
* Forgot/Reset password with OTP
* Google & Facebook social login support
* Welcome email on registration
* Logout & secure token handling

---

### 2. Problem Management

* Create, update, delete problems (Admin access)
* Add custom test cases
* Get all problems with pagination & filters

---

### 3. Code Execution

* Supports **JavaScript, Python, and C++**
* Docker-based isolated code execution
* Two modes:

  * **Run Code** → Executes only first 2 test cases instantly
  * **Submit Code** → Executes all test cases via Redis job queue
* Automatic output verification against expected results
* Stores execution results & stats in MongoDB

---

### 4. Submission Management

* Store user submissions with code, language, status, and results
* Retrieve all submissions for a problem
* Display passed/failed test case counts

---

### 5. Security & Middleware

* **ApiError** & **ApiResponse** for standardized error & success handling
* Authentication middleware
* Role-based access middleware
* Input validation
* Docker sandbox isolation for secure execution

---

## 🛠️ Tech Stack

**Frontend:**

* React (Vite)
* Redux Toolkit + redux-persist
* Tailwind CSS
* Shadcn UI
* Axios
* Monaco Editor (code editor)

**Backend:**

* Node.js + Express
* MongoDB + Mongoose
* Docker (sandbox execution)
* Redis (job queue)
* Nodemailer (emails)
* JWT (authentication)

---

## 📂 Project Structure

### Backend

```plaintext
backend/
├── src/
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── services/
│ └── db/
├── app.js
├── index.js
├── worker.js
├── Dockerfile
├── docker-compose.yml
```

### Frontend

```plaintext
frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── redux/
│ ├── utils/
│ ├── editors/
│ └── App.jsx
├── vite.config.js
├── package.json
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sourya-6/codearena.git
```

```bash
cd codearena
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend folder:

```plaintext
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codearena
JWT_SECRET=your_jwt_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
SMTP_HOST=smtp.yourservice.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:5173
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend folder:

```plaintext
VITE_API_URL=http://localhost:5000/api/v1
```

---

### 4. Running the App

Start Backend:

```bash
cd backend
npm run dev
```

Start Frontend:

```bash
cd frontend
npm run dev
```

---


