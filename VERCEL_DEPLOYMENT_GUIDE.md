# Deploying to Vercel (Frontend + Backend)

This guide covers deploying your entire DonorHub application to Vercel using serverless functions for the backend.

## Architecture

**Traditional Approach (what we had):**
```
Frontend (Vite) → Backend Server (Express)
localhost:5173 → localhost:5000
```

**Vercel Approach (what we're doing):**
```
Frontend (React) → Backend Serverless Functions
donorhub.vercel.app → api.donorhub.vercel.app/api/*
```

All on the same Vercel deployment! 🎉

## Step 1: Restructure Your Project for Vercel

Vercel detects serverless functions in an `api/` folder at the root. Let's restructure:

### Create the API folder structure:

```bash
# From project root
mkdir -p api
```

Your structure will become:
```
api/
  ├── auth.ts
  ├── donors.ts
  ├── donations.ts
  ├── campaigns.ts
  ├── tasks.ts
  └── index.ts (main handler)
src/
  └── ... (React components)
```

## Step 2: Create Vercel Serverless Handler

**Create `api/index.ts`** (this is your Express app as a serverless function):

```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from '../server/routes/auth.js';
import donorRoutes from '../server/routes/donors.js';
import donationRoutes from '../server/routes/donations.js';
import campaignRoutes from '../server/routes/campaigns.js';
import taskRoutes from '../server/routes/tasks.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Catch-all error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Export as serverless handler
export default app;
```

## Step 3: Update vercel.json

Replace your current `vercel.json` with:

```json
{
  "buildCommand": "npm run build",
  "framework": "vite",
  "env": {
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret",
    "FRONTEND_URL": "@frontend_url"
  }
}
```

## Step 4: Update Frontend API URL

**Update `src/utils/api.ts`:**

Change the API base URL based on environment:

```typescript
// For local development: localhost:5000
// For production: same domain (Vercel serverless functions)
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV 
    ? 'http://localhost:5000/api'
    : '/api'  // Relative path in production
);
```

**Create `.env.local` for development:**

```env
VITE_API_URL=http://localhost:5000/api
```

No need to change `.env.example` - it defaults to relative paths in production.

## Step 5: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Select your GitHub repository
4. Configure settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Add Environment Variables:
   ```
   DATABASE_URL = postgresql://neondb_owner:...@ep-fancy-sun.us-east-1.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET = your-strong-random-secret-key-32-chars-minimum
   FRONTEND_URL = https://your-project.vercel.app
   NODE_ENV = production
   ```

6. Click **Deploy**

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts and add environment variables
```

## Step 6: Verify Deployment

1. **Frontend loads:** `https://your-project.vercel.app`
   - Should see Login page
   
2. **Backend API responds:** Check logs in Vercel dashboard
   - Test with: `curl https://your-project.vercel.app/api/health`
   
3. **Database connected:** Try logging in with test credentials
   - Email: `test@donorhub.com`
   - Password: `password123`

## Step 7: Database Seeding in Production (Optional)

If you want to seed your production database:

```bash
# Locally, with production DATABASE_URL
DATABASE_URL="your-neon-url" npm run prisma:seed
```

Or do it once in Vercel build with a custom script (advanced).

## Troubleshooting

### "Cannot find module 'server/routes/auth.js'"
- Make sure all imports in `api/index.ts` use correct relative paths
- Import from `../server/routes/auth.js` (with `.js` extension)

### "Database connection failed"
- Verify `DATABASE_URL` is set in Vercel Environment Variables
- Check Neon console that connection string is correct
- Make sure Neon IP whitelist includes Vercel (should be automatic)

### "Login fails but API health check works"
- Check `JWT_SECRET` is set and matches locally
- Verify database has seeded data
- Check browser console for CORS errors

### "Frontend can't reach backend API"
- Make sure `VITE_API_URL` is NOT set in production (use relative `/api`)
- Check network tab in browser DevTools
- Verify `FRONTEND_URL` environment variable is correct

## Local Development Still Works

Run locally as before:

```bash
npm run dev:full
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/api`
- No changes needed to local workflow!

## Auto-Deployment

Every time you push to GitHub:
```
git push origin main
  ↓
Vercel detects change
  ↓
Builds project
  ↓
Deploys frontend + serverless functions
  ↓
Your app is live! 🚀
```

## Next Steps

1. ✅ Create `api/index.ts` with serverless handler
2. ✅ Update `vercel.json` configuration
3. ✅ Update frontend `VITE_API_URL`
4. ✅ Push to GitHub
5. ✅ Connect to Vercel & deploy
6. ✅ Add environment variables
7. ✅ Test login and features
8. ✅ Watch the logs in Vercel dashboard

You're now ready for production! 🎉
