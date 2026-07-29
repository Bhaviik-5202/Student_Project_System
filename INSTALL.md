# 📦 Installation Guide

This guide provides step-by-step instructions for setting up the **Student Project Management System** locally for development and testing.

---

## 📋 Prerequisites

Before starting, ensure you have installed:

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or a MongoDB Atlas cloud URI.
- **Git**: For cloning the repository.

---

## 🛠️ Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/student-project-management-system.git
cd student-project-management-system
```

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

Open `.env` in your text editor and configure:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/student_project_system
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
```

---

### 3. Frontend Setup

```bash
# Open a new terminal window and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

Open `.env` in your text editor and configure:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

### 4. Running the Application

#### Start the Backend Server:

```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

#### Start the Frontend Client:

```bash
cd frontend
npm run dev
# Client starts on http://localhost:5173
```

---

## 🧪 Running Tests

To run integration tests on the backend API:

```bash
cd backend
npm test
```

To run linting checks on the frontend client:

```bash
cd frontend
npm run lint
```

To test the production build:

```bash
cd frontend
npm run build
```

---

## ❓ Troubleshooting Common Setup Issues

- **MongoDB Connection Failed**: Verify MongoDB service is running locally (`mongod`) or check network firewall settings if using MongoDB Atlas.
- **CORS Error**: Ensure `CORS_ORIGIN` in `backend/.env` matches your frontend dev URL (e.g. `http://localhost:5173`).
- **Port Conflict**: Change `PORT` in `backend/.env` if port 5000 is occupied.
