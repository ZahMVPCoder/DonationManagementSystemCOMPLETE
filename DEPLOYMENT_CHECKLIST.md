# Quick Deployment Checklist

## Pre-Deployment (Local)

- [ ] All code committed to GitHub
- [ ] `.env` file exists and is git-ignored
- [ ] `npm install` runs without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run dev:full` works locally
- [ ] Database migrations are up to date
- [ ] Seed data exists: `npm run prisma:seed`
- [ ] Test login works: test@donorhub.com / password123
- [ ] All API endpoints tested with Postman/curl
- [ ] No console errors in browser
- [ ] No console errors in backend terminal

## Frontend Deployment (Vercel)

**Account Setup:**
- [ ] Create Vercel account at https://vercel.com
- [ ] Connect GitHub account to Vercel
- [ ] Give Vercel access to your repository

**Project Configuration:**
- [ ] Import project from GitHub in Vercel
- [ ] Set Build Command: `npm run build`
- [ ] Set Output Directory: `dist`
- [ ] Set Install Command: `npm install`

**Environment Variables (Vercel Dashboard):**
- [ ] Add `VITE_API_URL` = (temporary: `http://localhost:5000/api`)
- [ ] Deploy project

**After Deployment:**
- [ ] Copy Vercel URL (e.g., `https://donorhub.vercel.app`)
- [ ] Test frontend loads without errors
- [ ] Check browser console for errors

## Backend Deployment (Railway)

**Account Setup:**
- [ ] Create Railway account at https://railway.app
- [ ] Connect GitHub account to Railway
- [ ] Give Railway access to your repository

**Project Configuration:**
- [ ] Create new Railway project
- [ ] Connect GitHub repository
- [ ] Confirm Node.js detected
- [ ] Set Start Command: `npm run server`

**Environment Variables (Railway Dashboard):**
- [ ] Add `DATABASE_URL` = (your Neon PostgreSQL URL)
- [ ] Add `JWT_SECRET` = (strong random secret, 32+ chars)
- [ ] Add `NODE_ENV` = `production`
- [ ] Add `FRONTEND_URL` = (your Vercel frontend URL)
- [ ] Deploy project

**Database Setup:**
- [ ] Verify PostgreSQL connection works
- [ ] Run migrations: Contact Railway support or run locally
- [ ] Seed database: `npm run prisma:seed` (optional)

**After Deployment:**
- [ ] Copy Railway backend URL (e.g., `https://donorhub-prod.up.railway.app`)
- [ ] Test health endpoint: `curl https://your-backend/api/health`

## Cross-Integration

**Update Vercel Frontend:**
- [ ] Go to Vercel Project Settings → Environment Variables
- [ ] Update `VITE_API_URL` = (your Railway backend URL + `/api`)
- [ ] Redeploy from Vercel Dashboard

**Update Railway Backend:**
- [ ] Go to Railway Project Variables
- [ ] Verify `FRONTEND_URL` = (your Vercel frontend URL)
- [ ] Redeploy from Railway Dashboard

## Final Testing

**Browser Testing:**
- [ ] Frontend loads: `https://your-vercel-domain`
- [ ] Can navigate without errors
- [ ] Login page displays
- [ ] Can login with test@donorhub.com / password123
- [ ] Dashboard loads with data
- [ ] Can view Donors list
- [ ] Can create new Donor
- [ ] Can log Donation
- [ ] Can view Campaigns
- [ ] Can view Tasks

**API Testing:**
```bash
# Test backend health
curl https://your-backend-domain/api/health

# Test login
curl -X POST https://your-backend-domain/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@donorhub.com","password":"password123"}'

# Test protected route (use token from login)
curl -X GET https://your-backend-domain/api/donors \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Network Testing:**
- [ ] Frontend loads from anywhere (test on mobile)
- [ ] API calls succeed from frontend
- [ ] No CORS errors in browser console
- [ ] Authentication persists across page refreshes

## Post-Deployment

**Documentation:**
- [ ] Save deployment URLs
- [ ] Document environment variables used
- [ ] Create deployment log

**Monitoring:**
- [ ] Check Vercel deployment logs weekly
- [ ] Monitor Railway backend logs
- [ ] Watch for 401/500 errors

**Future Updates:**
- [ ] Every `git push main` triggers auto-deploy
- [ ] Test in staging before production pushes
- [ ] Keep backups of production database
- [ ] Monitor database connection limits

---

## Deployment URLs Template

```
Frontend (Vercel):
https://[your-frontend-domain].vercel.app

Backend (Railway):
https://[your-backend-domain].up.railway.app

API Base:
https://[your-backend-domain].up.railway.app/api
```

---

## Quick Command Reference

```bash
# Test locally before deploying
npm run build              # Test frontend build
npm run dev:server        # Test backend
npm run prisma:seed       # Verify seeding works

# After deployment
# Push changes to GitHub
git push origin main       # Triggers auto-deploy on both platforms

# Check deployment status
# Vercel: https://vercel.com/dashboard
# Railway: https://railway.app/project/...
```

---

## Estimated Times

| Task | Time |
|------|------|
| Vercel setup & frontend deploy | 5 minutes |
| Railway setup & backend deploy | 10 minutes |
| Cross-integration & updates | 5 minutes |
| Testing everything | 10 minutes |
| **Total** | **~30 minutes** |

---

**You're ready to deploy!** 🚀
