# Student Project System

A comprehensive full-stack application for managing academic projects, facilitating collaboration between students and faculty, and tracking project lifecycles end-to-end.

## Project Structure

- **[frontend](./frontend)**: React 18 SPA built with Vite, Tailwind CSS, and Framer Motion — runs on **http://localhost:3000**
- **[backend](./backend)**: Node.js/Express REST API with MongoDB/Mongoose — runs on **http://localhost:5000**

## Key Features

- **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for Students, Faculty (Supervisors), and Admins.
- **Project Lifecycle Management**: Proposals, timelines, milestones, and deliverables tracked in one place.
- **Email OTP Verification**: Secure account registration with email verification.
- **Password Reset**: Secure, token-based forgot-password flow with time-limited email links.
- **Collaboration Tools**: Integrated meeting scheduling, resource sharing, and notifications.
- **Analytics Dashboard**: Visual charts and metrics for project progress and performance.

## Getting Started

### Prerequisites

- Node.js v16+
- MongoDB (local or Atlas)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Student Project System"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env   # fill in your values
   npm run dev            # starts on http://localhost:5000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env   # set VITE_API_URL=http://localhost:5000/api/v1
   npm run dev            # starts on http://localhost:3000
   ```

## Technologies Used

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, React Router v6
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer
- **Tools**: ESLint, Prettier, PostCSS

## License

This project is licensed under the MIT License.
