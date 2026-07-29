# 🚀 Production Deployment Guide

This guide details recommended production deployment strategies for the **Student Project Management System**.

---

## 🏗️ Deployment Architecture

```text
  [ Client Browser ]
         │
         ├──► Frontend: Vercel / Netlify / Cloudflare Pages (React / Vite Static Assets)
         │
         └──► Backend: Render / Railway / AWS EC2 (Express Node.js REST API)
                    │
                    └──► Database: MongoDB Atlas (Managed Cloud Database)
```

---

## 🌐 1. Database Deployment (MongoDB Atlas)

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user with read/write permissions.
3. Add IP access rules (`0.0.0.0/0` or specific server IPs).
4. Obtain your connection string:
   `mongodb+srv://<username>:<password>@cluster.mongodb.net/student_project_system`

---

## 🖥️ 2. Backend Deployment (Render / Railway / Docker)

### Option A: Render / Railway

1. Connect your repository to **Render** or **Railway**.
2. Set Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Configure Environment Variables:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/student_project_system
JWT_SECRET=use_a_long_random_64_char_key
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=https://your-frontend-domain.vercel.app
MAX_FILE_SIZE=52428800
```

---

## ⚡ 3. Frontend Deployment (Vercel / Netlify)

### Option A: Vercel

1. Import the repository in **Vercel**.
2. Set Framework Preset to **Vite**.
3. Set Root Directory to `frontend`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable:

```env
VITE_API_URL=https://your-backend-api.onrender.com/api/v1
```

---

## 🛡️ Production Security Best Practices

- Enable SSL/TLS (HTTPS) for both frontend and backend.
- Ensure `JWT_SECRET` is at least 64 random characters long.
- Restrict `CORS_ORIGIN` strictly to your production domain.
- Set `NODE_ENV=production` to enable automatic error stack hiding and security middleware optimization.
- Set up regular database backup snapshots in MongoDB Atlas.
