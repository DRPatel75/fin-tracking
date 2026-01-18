# MERN Stack Deployment Guide

Follow these steps to deploy your "PERSONAL FINANCIAL TRACKING AND BUDGETING" application for free.

## 1. MongoDB Atlas (Database)
You already have your connection string:
`mongodb+srv://admin:admin123@financecluster.k3vxya9.mongodb.net/?appName=financeCluster`

---

## 2. Render (Backend Deployment)

1.  **Create a New Web Service** on [Render](https://render.com/).
2.  Connect your GitHub repository (ensure your `server` code is in the root or configure the base directory).
3.  **Settings**:
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
4.  **Environment Variables**:
    - `NODE_ENV`: `production`
    - `PORT`: `5000` (Render will override this, which is fine)
    - `MONGO_URI`: `mongodb+srv://admin:admin123@financecluster.k3vxya9.mongodb.net/?appName=financeCluster`
    - `JWT_SECRET`: `your_secure_secret_here`
    - `FRONTEND_URL`: `https://YOUR_VERCEL_APP_URL.vercel.app` (You'll get this in the next step)

---

## 3. Vercel (Frontend Deployment)

1.  **Create a New Project** on [Vercel](https://vercel.com/).
2.  Connect your GitHub repository.
3.  **Settings**:
    - **Framework Preset**: `Vite` (or Other if not detected)
    - **Root Directory**: `client`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
4.  **Environment Variables**:
    - `VITE_API_URL`: `https://YOUR_RENDER_APP_URL.onrender.com/api` (Copy this from your Render dashboard)

---

## 4. Final Integration

1.  Once Vercel gives you a URL (e.g., `https://fin-track.vercel.app`), go back to **Render** and update the `FRONTEND_URL` environment variable.
2.  Redeploy the Render service if it doesn't auto-update.
3.  Test the live site!

## Common Issues & Fixes
- **CORS Error**: Ensure `FRONTEND_URL` on Render exactly matches your Vercel URL (including `https://` but no trailing slash).
- **Blank Page on Vercel**: Ensure the `Root Directory` is set to `client` and `Output Directory` is `dist`.
- **Login Fails**: Check if `VITE_API_URL` is correct and includes `/api`.
