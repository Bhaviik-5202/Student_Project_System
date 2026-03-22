# System Architecture Design

The **Student Project Management System** is built on a modern full-stack architecture designed for academic collaboration and oversight.

## 🏗️ High-Level Overview

```mermaid
graph TD
    subgraph Frontend [React Web Application]
        UI[User Interface - Tailwind CSS]
        Hooks[Custom Hooks - useAuth]
        Services[API Services - Axios]
    end

    subgraph Backend [Node.js / Express API]
        Auth[JWT Authentication]
        Routes[REST API Routes]
        Controller[Controllers]
        Service[Business Logic Layer]
        Repo[Data Repositories]
    end

    subgraph Database [MongoDB]
        Users[(User Data)]
        Projects[(Project Records)]
        Audit[(Audit Logs)]
    end

    UI <--> Hooks
    Hooks <--> Services
    Services <--> |HTTP/JSON + JWT| Auth
    Auth --> Routes
    Routes --> Controller
    Controller --> Service
    Service --> Repo
    Repo <--> Database
```

## 🔐 Security Architecture

- **Authentication**: JWT-based session management with encrypted token storage.
- **Authorization**: Strict Role-Based Access Control (RBAC) across all protected endpoints.
- **Data Protection**:
  - **Password Hashing**: Bcrypt with adaptive salt rounds.
  - **Secure Headers**: Implementation of **Helmet.js** to mitigate common web vulnerabilities.
  - **Rate Limiting**: Protection against brute-force attacks via `express-rate-limit`.
- **Auditability**: Comprehensive logging of critical system actions (logins, deletions, status changes) in the **Audit Logs**.

## 🚀 Scalability Considerations

- **Stateless API**: The backend is stateless, allowing for horizontal scaling behind a load balancer.
- **Lazy Loading**: Frontend uses React memoization and code-splitting to maintain performance as the project repository grows.
- **Layered Design**: The strict separation between business logic (Services) and data access (Repositories) allows for easier unit testing and future-proofing.
