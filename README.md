# Student Project Management System

A comprehensive full-stack application for managing academic projects, facilitating collaboration between students and faculty, and tracking project lifecycles.

## Project Structure

- **[frontend](./frontend)**: React-based frontend application built with Vite, Tailwind CSS, and Framer Motion.
- **[backend](./backend)**: Node.js/Express backend API with MongoDB/Mongoose.

## Key Features

- **Role-Based Access Control (RBAC)**: Distinct interfaces for Students, Faculty (Supervisors), and Admin.
- **Project Tracking**: Manage project timelines, milestones, and deliverables.
- **Collaboration Tools**: Integrated chat, meeting scheduling, and resource sharing.
- **Real-time Notifications**: Stay updated with project progress and deadlines.
- **Analytics Dashboard**: Visual representation of project metrics and performance.

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (Running locally or via Atlas)
- npm or yarn

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
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, React Query, Lucide React.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Socket.io.
- **Tools**: ESLint, PostCSS, Vite.

## License

This project is licensed under the MIT License.
