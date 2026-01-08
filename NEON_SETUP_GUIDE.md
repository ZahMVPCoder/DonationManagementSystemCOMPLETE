# Using Neon PostgreSQL Database

This guide will help you set up your Donation Management System with Neon, a serverless PostgreSQL database.

## Step 1: Create a Neon Account

1. Go to https://neon.tech
2. Click **Sign Up** (you can use GitHub, Google, or email)
3. Create a free account (includes free tier with reasonable limits)

## Step 2: Create a Project

1. After signing up, click **Create Project**
2. Choose a project name: `donorhub` (or your preferred name)
3. Select **PostgreSQL 15** as the database version
4. Select your region (choose one closest to you or your users)
5. Click **Create Project**

Neon will automatically create:
- A default database named `neondb`
- A default role (user) named `neon_user`

## Step 3: Get Your Database Connection String

1. In the Neon console, go to your project
2. Click the **Connection** button (top right)
3. Make sure you're on the **Connection string** tab
4. Select **Prisma** from the dropdown (important!)
5. Copy the full connection string that starts with `postgresql://`

It will look something like:
```
postgresql://neon_user:password@ec2-xxx-xxx-xxx-xxx.compute-1.amazonaws.com/neondb?sslmode=require
```

## Step 4: Configure Your Environment

1. Open `.env` in your project root:
```bash
# Windows
notepad .env
```

2. Replace your current `DATABASE_URL` with the one from Neon:
```env
DATABASE_URL="postgresql://neon_user:your_password@your_host/neondb?sslmode=require"
JWT_SECRET="your-secret-key-here-make-it-at-least-32-characters-long"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

**IMPORTANT:** Never commit `.env` to Git (it's already in .gitignore)

## Step 5: Run Database Migrations

Your Prisma schema is already defined. Now apply it to Neon:

```bash
# Run migrations
npm run prisma:migrate

# If that doesn't work, try:
npx prisma migrate deploy
```

This will:
- Create all database tables (User, Donor, Donation, Campaign, Task)
- Set up relationships between tables
- Create indexes for performance

## Step 6: Seed Test Data (Optional)

Populate your database with test data:

```bash
npm run prisma:seed
```

This will create:
- 1 test user (test@donorhub.com / password123)
- 6 test donors
- 5 test donations
- 3 test campaigns
- 5 test tasks

## Step 7: Verify Connection

Test that everything works:

```bash
npx prisma studio
```

This opens a GUI where you can see all your data. If it connects successfully, you're all set!

## Step 8: Start Your App

Now you can start developing with Neon as your database:

```bash
# Start backend and frontend together
npm run dev:full

# Or separately:
npm run dev:server     # Terminal 1
npm run dev:client     # Terminal 2
```

## Neon Features

**Free Tier Includes:**
- 5 projects
- 3 GB storage per project
- Serverless compute (auto-scales)
- 1 read-only replica
- Point-in-time recovery (7 days)
- Branching for development/testing

**For Production:**
- Upgrade to paid plan when needed
- Get dedicated compute with more resources
- Pay only for what you use

## Common Issues

### "Connection refused"
- Check your DATABASE_URL is correct
- Make sure you copied the entire string including `?sslmode=require`
- Verify Neon project is active

### "Permission denied"
- The password in your connection string might be wrong
- Reset the role password in Neon console (Settings → Roles)
- Copy the new connection string

### "SSL error"
- Make sure `?sslmode=require` is at the end of your URL
- Don't remove it - Neon requires SSL

## Using Neon for Production (Vercel/Railway)

When deploying, add `DATABASE_URL` to your hosting platform's environment variables:

**For Railway Backend:**
1. Go to Railway dashboard
2. Select your project
3. Go to Variables
4. Add: `DATABASE_URL` = (your Neon connection string)

**For Vercel Frontend:**
- Frontend doesn't need DATABASE_URL directly
- Just make sure VITE_API_URL points to your backend

## Next Steps

1. ✅ Create Neon account & project
2. ✅ Get connection string
3. ✅ Add to `.env`
4. ✅ Run migrations
5. ✅ Seed data (optional)
6. ✅ Start developing
7. Deploy to Vercel + Railway

You're ready to develop with a real PostgreSQL database! 🚀
