# 📦 Local Development & Installation Guide

This guide provides step-by-step instructions for setting up the **Student Project Management System** locally for development, testing, and evaluation.

---

## 📋 Prerequisites

Ensure you have installed:

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB server (`mongodb://localhost:27017`) or MongoDB Atlas cloud URI
- **Git**: For cloning the repository

---

## 🛠️ Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Bhaviik-5202/Student_Project_System.git
cd Student_Project_System
```

---

### 2. Backend API Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

Open `.env` in your text editor and fill in your local settings:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/student_project_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173

# Email Transport (Nodemailer SMTP / Brevo / Resend)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FROM_EMAIL=no-reply@studentproject.edu
FROM_NAME=Student Project System
```

---

### 3. Frontend SPA Setup

```bash
# In a new terminal window, navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

Open `.env` in your text editor and set:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

### 4. Running the Development Applications

#### Start Backend API Server:
```bash
cd backend
npm run dev
```
*API Server starts at `http://localhost:5000` (Swagger UI at `http://localhost:5000/api-docs`)*

#### Start Frontend Client:
```bash
cd frontend
npm run dev
```
*Web Client starts at `http://localhost:5173`*

---

## 🧪 Quality Assurance & Test Verification

### Run Backend Integration Tests (Mocha / Chai / Supertest)
```bash
cd backend
npm test
```
*Executes all 40 automated backend integration test cases.*

### Run Frontend ESLint Checks
```bash
cd frontend
npm run lint
```
*Ensures 0 syntax errors or warnings.*

### Test Frontend Production Build
```bash
cd frontend
npm run build
npm run preview
```

---

## ❓ Troubleshooting Common Setup Issues

- **MongoDB Connection Error**: Check if MongoDB service is running locally (`mongod`) or verify network access/IP whitelist on MongoDB Atlas.
- **CORS Blocked**: Confirm `CORS_ORIGIN` in `backend/.env` matches your frontend origin (e.g. `http://localhost:5173`).
- **SMTP Authentication Failed**: Generate an App Password in your Google Account security settings if using Gmail SMTP, or use Brevo/Resend API keys.
