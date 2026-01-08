# Deployment Guide: DonorHub to Vercel

## 🚀 Quick Deployment (10 minutes)

This guide covers deploying DonorHub to Vercel with both frontend and backend components.

### ⚠️ Important Note
Vercel works best for static frontend hosting. For a full-stack app, we'll deploy:
- **Frontend (React)** → Vercel (recommended)
- **Backend (Express.js)** → Railway, Render, or another Node.js host

---

## Option 1: Frontend Only (Quick Start)

### Step 1: Prepare Frontend for Deployment

```bash
# Build frontend
npm run build

# This creates a 'dist' folder ready for Vercel
```

### Step 2: Deploy to Vercel (via Web)

1. Go to https://vercel.com/new
2. Click "Deploy" (you'll need to sign up or login)
3. Select "Import Git Repository"
4. Connect your GitHub repository (or paste Git URL)
5. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Add Environment Variables:
   ```
   VITE_API_URL=http://localhost:5000/api    (for local testing)
   # Later update to your production backend URL
   ```
7. Click "Deploy"

### Step 3: Update Backend URL

After backend is deployed, update the frontend:

```bash
# Go to Vercel Dashboard → Project Settings → Environment Variables
# Update VITE_API_URL to your backend URL (see Option 2)
```

---

## Option 2: Full Stack Deployment (Recommended)

### Part A: Deploy Backend to Railway

Railway is perfect for Express.js Node applications and integrates with PostgreSQL (Neon).

#### 1. Prepare Backend

```bash
# Ensure all environment variables are configured in .env
# Test locally: npm run dev:server
```

#### 2. Deploy via Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub"
5. Connect your repository
6. Railway will detect Node.js project automatically
7. Configure environment variables:
   - `DATABASE_URL` - Your Neon PostgreSQL URL
   - `JWT_SECRET` - Strong random secret
   - `NODE_ENV` - Set to "production"
   - `PORT` - Leave default (Railway assigns automatically)
   - `FRONTEND_URL` - Your Vercel frontend URL (for CORS)

#### 3. Database Setup

```bash
# Railway handles Node.js, but you need PostgreSQL
# Option A: Use your existing Neon database
#   - Just provide DATABASE_URL in Railway env vars

# Option B: Add PostgreSQL plugin in Railway
#   - Railway Dashboard → Project → Add Service → PostgreSQL
#   - Railway auto-provides DATABASE_URL
```

#### 4. Run Migrations

```bash
# After Railway deployment, migrations run automatically OR
# Connect to your Railway app and run:
npm run prisma:migrate -- --skip-generate
```

#### 5. Seed Database (Optional)

```bash
# Either seed in Railway CLI or run locally against deployed DB
npm run prisma:seed
```

**Railway Backend URL:** Will be provided in Railway Dashboard
Example: `https://donorhub-production.up.railway.app`

### Part B: Deploy Frontend to Vercel

#### 1. Deploy Frontend

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variables:
   ```
   VITE_API_URL=https://donorhub-production.up.railway.app/api
   ```
5. Click "Deploy"

**Vercel Frontend URL:** Provided after deployment
Example: `https://donorhub.vercel.app`

### Part C: Update Backend CORS

Go back to Railway Dashboard and update:
```
FRONTEND_URL=https://donorhub.vercel.app
```

Redeploy backend by pushing a commit or manually triggering deploy.

---

## Option 3: Deploy Both to Vercel (Advanced)

Vercel supports serverless Node.js via `api/` folder. Not recommended for Express apps but possible.

⚠️ **Limitations:**
- Limited to Vercel's file system restrictions
- Not ideal for Express.js
- Better to use Option 2

---

## Step-by-Step: Railway Deployment (Detailed)

### 1. Create Railway Account

```
https://railway.app → Sign Up with GitHub
```

### 2. Create New Project

```
Dashboard → New Project → Deploy from GitHub
```

### 3. Select Repository

Connect your GitHub repository containing DonorHub

### 4. Configure Build

Railway auto-detects Node.js. Confirm:
- **Root Directory:** `/` (if monorepo, set to `.`)
- **Build Command:** `npm run build` OR leave blank
- **Start Command:** `npm run server` OR `node server/index.js`

### 5. Add Environment Variables

In Railway Dashboard → Variables:

```
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
JWT_SECRET=your-strong-random-secret-key
NODE_ENV=production
FRONTEND_URL=https://donorhub.vercel.app
```

### 6. Deploy

Click "Deploy" → Railway builds and starts your app

### 7. Get Your Backend URL

```
Railway Dashboard → Project → Deployments → Public URL
Example: https://donorhub-production.up.railway.app
```

---

## Vercel Deployment Checklist

- [ ] GitHub repository is public or Vercel has access
- [ ] `package.json` has all dependencies listed
- [ ] Build command works locally: `npm run build`
- [ ] Frontend builds to `dist/` folder
- [ ] Environment variables configured in Vercel Dashboard
- [ ] `VITE_API_URL` points to your backend
- [ ] Backend URL is accessible from the internet

---

## Environment Variables for Each Platform

### Local Development (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=local-test-secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### Frontend (Vercel - .env.local)
```
VITE_API_URL=https://your-backend-domain/api
VITE_APP_NAME=DonorHub
VITE_APP_VERSION=1.0.0
```

### Backend (Railway)
```
DATABASE_URL=postgresql://...
JWT_SECRET=production-strong-secret
NODE_ENV=production
FRONTEND_URL=https://your-vercel-domain
PORT=(Railway assigns automatically)
```

---

## Testing After Deployment

### 1. Test Frontend

```
https://your-vercel-domain
# Should load without errors
# Should redirect to /login if not authenticated
```

### 2. Test Backend Health

```bash
curl https://your-railway-backend/api/health
# Response: {"status":"OK","timestamp":"..."}
```

### 3. Test Authentication

```bash
curl -X POST https://your-railway-backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@donorhub.com","password":"password123"}'
# Should return token
```

### 4. Test Protected Routes

```bash
# With token from login
curl -X GET https://your-railway-backend/api/donors \
  -H "Authorization: Bearer <TOKEN>"
# Should return donors list
```

### 5. Test in Browser

```
1. Go to frontend URL
2. Login: test@donorhub.com / password123
3. Test Dashboard, Donors, Donations, etc.
4. Create a new donor
5. Log a donation
6. View tasks
```

---

## Troubleshooting

### Frontend shows "Cannot connect to API"

```
1. Check VITE_API_URL is correct in Vercel env vars
2. Verify backend is running on Railway
3. Check backend FRONTEND_URL includes frontend domain
4. Verify no CORS errors in browser console
5. Test backend directly with curl
```

### "Database connection failed"

```
1. Verify DATABASE_URL is correct
2. Check PostgreSQL/Neon is accessible
3. Confirm JWT_SECRET matches in backend
4. Check migrations ran successfully
5. View Railway logs: Railway Dashboard → Logs
```

### "Port already in use"

```
1. Railway assigns port automatically (ignore PORT env var)
2. Use Railway's provided URL
3. Don't hardcode port 5000
```

### Build fails on Vercel

```
1. Check build logs: Vercel Dashboard → Deployments → Logs
2. Ensure npm run build works locally
3. Check all dependencies in package.json
4. Verify .gitignore doesn't exclude important files
```

---

## Update Process

### After Making Changes Locally

```bash
# 1. Commit and push to GitHub
git add .
git commit -m "Update feature"
git push origin main

# 2. Vercel auto-deploys from main branch
# 3. Check deployment in Vercel Dashboard

# 4. For backend changes on Railway
# - Same process, push to GitHub
# - Railway auto-redeploys from main
```

---

## Security Notes

⚠️ **Never commit `.env` files**
- Keep secrets in `.env` (local only)
- Add to `.gitignore` (already done)
- Use platform's environment variables (Vercel, Railway)

⚠️ **Use strong JWT_SECRET in production**
```bash
# Generate strong secret:
openssl rand -base64 32
```

⚠️ **HTTPS only in production**
- Vercel: Automatic HTTPS
- Railway: Automatic HTTPS

---

## Deployment Summary

| Component | Platform | Status |
|-----------|----------|--------|
| Frontend (React) | Vercel | ✅ Recommended |
| Backend (Express) | Railway | ✅ Recommended |
| Database | Neon PostgreSQL | ✅ Already setup |
| Auth (JWT) | Backend | ✅ Integrated |

---

## Quick Deploy Command

Once configured:

```bash
# Everything is automatic after git push!
git push origin main
# Vercel + Railway auto-deploy
# Check dashboards for deployment status
```

---

## Next Steps

1. **Create Vercel Account:** https://vercel.com
2. **Create Railway Account:** https://railway.app
3. **Deploy Frontend:** Follow "Option 2 Part B"
4. **Deploy Backend:** Follow "Option 2 Part A"
5. **Test Everything:** Use the testing checklist
6. **Share URLs:** Frontend and Backend URLs

---

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Your deployed app ready for testing! 🚀

---

**Ready to deploy? Let's go!** 🎉
