# Step 9: Environment Variables Setup Guide

## Overview

This guide walks you through setting up the environment variables for both the backend Express server and the frontend React application. Proper environment configuration is critical for development and production deployment.

---

## Backend Environment Variables (.env)

### Location
File: `.env` (in project root)

### Required Variables

#### 1. **DATABASE_URL** (Required)
```
DATABASE_URL=postgresql://user:password@ep-example.us-east-1.aws.neon.tech/dbname?sslmode=require
```

**Purpose:** PostgreSQL connection string for Prisma ORM

**How to Get:**
1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project or select existing
3. Copy the connection string from Dashboard
4. Replace `password` with your actual password
5. Append `?sslmode=require` to the end

**Example:**
```
DATABASE_URL=postgresql://neondb_owner:nPassword123@ep-green-butterfly-123.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### 2. **JWT_SECRET** (Required)
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Purpose:** Secret key for signing JWT authentication tokens

**Security Requirements:**
- Minimum 32 characters
- Mix of uppercase, lowercase, numbers, and special characters
- Must be different from example value in production
- Store securely (never hardcode)

**Generate a Secure Secret:**
```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Minimum 0 -Maximum 256)}))
```

**Example:**
```
JWT_SECRET=aB3fG7kL9mN2pQ5sT8vW1xY4zC6dE0hJ
```

#### 3. **PORT** (Optional)
```
PORT=5000
```

**Purpose:** Port for Express server to listen on

**Default:** 5000

**Common Ports:**
- Development: 5000
- Production: 443 or 80 (with reverse proxy)

#### 4. **NODE_ENV** (Optional)
```
NODE_ENV=development
```

**Purpose:** Application environment

**Valid Values:**
- `development` - Verbose logging, error details shown
- `test` - Testing environment, minimal logs
- `production` - Optimized, minimal logging, error handling

**Default:** development

#### 5. **FRONTEND_URL** (Required for CORS)
```
FRONTEND_URL=http://localhost:5173
```

**Purpose:** Frontend origin allowed to make API requests (CORS configuration)

**Values:**
- Development: `http://localhost:5173`
- Production: `https://yourdomain.com`

---

## Frontend Environment Variables (.env.local)

### Location
File: `.env.local` (in project root)

### Required Variables

#### 1. **VITE_API_URL** (Required)
```
VITE_API_URL=http://localhost:5000/api
```

**Purpose:** Backend API base URL for all frontend requests

**Values:**
- Development: `http://localhost:5000/api`
- Production: `https://api.yourdomain.com/api`

#### 2. **VITE_APP_NAME** (Optional)
```
VITE_APP_NAME=DonorHub
```

**Purpose:** Application name for display in UI

#### 3. **VITE_APP_VERSION** (Optional)
```
VITE_APP_VERSION=1.0.0
```

**Purpose:** Application version for display/tracking

---

## Setup Instructions

### Initial Setup (Development)

1. **Backend Setup:**
   ```bash
   # Copy example template
   cp .env.example .env
   
   # Edit .env with your values
   nano .env
   # or use your editor:
   # code .env (VS Code)
   # vim .env (Vi/Vim)
   ```

2. **Frontend Setup:**
   ```bash
   # Copy example template
   cp .env.local.example .env.local
   
   # Edit .env.local (usually defaults are fine for local development)
   nano .env.local
   ```

3. **Verify Configuration:**
   ```bash
   # Make sure both .env and .env.local exist
   ls -la .env* 
   
   # Should see:
   # .env
   # .env.example
   # .env.local
   # .env.local.example
   ```

4. **Start the Application:**
   ```bash
   # Start backend server
   npm run dev:server
   
   # In another terminal, start frontend
   npm run dev
   ```

---

## Environment Variable Security Best Practices

### ✅ DO

- ✅ Use `.env.example` and `.env.local.example` as templates
- ✅ Store actual secrets in `.env` and `.env.local` (local only)
- ✅ Regenerate `JWT_SECRET` for each production environment
- ✅ Use environment-specific connection strings
- ✅ Rotate secrets periodically
- ✅ Use strong, random values for secrets
- ✅ Document required variables in `.env.example`

### ❌ DON'T

- ❌ Commit `.env` or `.env.local` files to version control
- ❌ Hardcode secrets in source code
- ❌ Use the same JWT_SECRET in development and production
- ❌ Share `.env` files via email or chat
- ❌ Use weak or predictable secret values
- ❌ Log sensitive environment variables
- ❌ Push production credentials to any public repository

---

## Production Deployment

### Using Environment Management Services

**Option 1: Cloud Provider (Recommended)**
- Vercel (Vercel env dashboard)
- Railway (Railway environment settings)
- Heroku (Heroku Config Vars)
- AWS (Secrets Manager / Parameter Store)

**Option 2: .env File on Server**
```bash
# On your production server
# 1. Create .env file securely
# 2. Set restrictive permissions
sudo chmod 600 .env

# 3. Never store in public directories
# 4. Use environment variables from your deployment platform when possible
```

### Production Checklist

- [ ] Generate new strong JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Use production database URL (Neon, RDS, etc.)
- [ ] Configure FRONTEND_URL with your domain
- [ ] Set VITE_API_URL to production API endpoint
- [ ] Use HTTPS for all URLs
- [ ] Store secrets in your deployment platform's secret management
- [ ] Never commit .env files
- [ ] Rotate secrets regularly
- [ ] Monitor secret access logs

---

## Troubleshooting

### ❌ "DATABASE_URL not found"
**Solution:** Make sure `.env` file exists in project root and has DATABASE_URL variable

### ❌ "JWT_SECRET is undefined"
**Solution:** Check JWT_SECRET is set in `.env` and server restarted after changes

### ❌ "CORS error - origin not allowed"
**Solution:** 
- Verify FRONTEND_URL matches frontend origin exactly
- Check frontend is running on correct port (default 5173)
- Restart backend server after changing FRONTEND_URL

### ❌ "Cannot connect to database"
**Solution:**
1. Verify DATABASE_URL is correct
2. Check password is properly escaped (special chars)
3. Test connection: `psql $DATABASE_URL`
4. Ensure Neon project is active (not paused)

### ❌ "VITE_API_URL not working"
**Solution:**
- Ensure VITE_API_URL ends with `/api`
- Verify backend is running on the specified PORT
- Check frontend .env.local is reloaded (restart dev server)

---

## Summary of Files

| File | Purpose | Commit? | Contains Secrets? |
|------|---------|---------|-------------------|
| `.env` | Backend secrets & config | ❌ NO | ✅ YES |
| `.env.example` | Backend template | ✅ YES | ❌ NO |
| `.env.local` | Frontend config | ❌ NO | ❌ NO |
| `.env.local.example` | Frontend template | ✅ YES | ❌ NO |

---

## Next Steps

After setting up environment variables:

1. ✅ Backend configured with DATABASE_URL and JWT_SECRET
2. ✅ Frontend configured with VITE_API_URL
3. ✅ Both .env files in .gitignore
4. Run: `npm install` (if not done)
5. Run: `npm run dev` (start both servers)
6. Test API endpoints: `http://localhost:5000/api`
7. Test frontend: `http://localhost:5173`

See `QUICKSTART.md` for full setup instructions.
