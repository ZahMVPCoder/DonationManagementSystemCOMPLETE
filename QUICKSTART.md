# 🚀 Quick Start Guide

Get DonorHub running in 5 minutes!

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- PostgreSQL database (Neon configured)
- Environment variables configured

---

## Step 0: Setup Environment Variables

**First time setup?** Configure environment variables:

```bash
# Backend setup
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
nano .env  # or use your favorite editor

# Frontend setup
cp .env.local.example .env.local
# Usually defaults work for local development
```

📖 **Detailed instructions?** See [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md)

---

## Step 1: Install Dependencies

```bash
npm install
```

---

## Step 2: Verify Database Configuration

Check `.env` has your Neon PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@ep-example.us-east-1.aws.neon.tech/dbname?sslmode=require"
JWT_SECRET="your-secret-key"
```

---

## Step 3: Run Database Migrations

```bash
npm run prisma:migrate
```

---

## Step 4: Start Backend (Terminal 1)

```bash
npm run server
```

Wait for: `Server running on http://localhost:5000`

---

## Step 5: Start Frontend (Terminal 2)

```bash
npm run dev
```

Wait for: `ready in X ms`

---

## Step 6: Open Application

```
http://localhost:5173
```

---

## Step 7: Register & Login

- Click "Sign Up" or register link
- Email: any valid email
- Password: 6+ characters
- Submit

---

## Done! 🎉

You should now see the Dashboard.

---

## Available Routes

| Route | Purpose |
|-------|---------|
| `/login` | Login/Register page |
| `/` | Dashboard |
| `/donors` | Donor list |
| `/donors/new` | Create donor |
| `/donors/:id` | Donor profile |
| `/donations` | Donations list |
| `/donations/new` | Create donation |
| `/campaigns` | Campaign list |
| `/tasks` | Task management |

---

## API Endpoints

All available at `http://localhost:5000/api`

### Example Calls

**List Donors:**
```bash
curl -X GET http://localhost:5000/api/donors \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Create Donation:**
```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "date": "2026-01-07",
    "method": "credit_card",
    "donorId": "donor_123"
  }'
```

---

## Troubleshooting

### Error: Cannot find database
**Solution:** Check `.env` DATABASE_URL is correct

### Error: CORS error
**Solution:** Verify backend is running on port 5000

### Error: Blank page
**Solution:** Check browser console for errors

### Can't login
**Solution:** Register new account first

---

## Key Commands

```bash
# Development (both servers)
npm run dev:full

# Backend only
npm run server

# Frontend only
npm run dev

# Database
npm run prisma:migrate      # Run migrations
npm run prisma:studio       # Open database UI

# Production
npm run build               # Build frontend
npm run preview             # Preview build
```

---

## File Structure

```
src/
  ├── components/          # React components
  ├── contexts/           # Auth context
  ├── utils/
  │   └── api.ts          # API utility ⭐
  ├── styles/             # CSS files
  └── main.tsx            # Entry point

server/
  ├── routes/             # API endpoints
  ├── middleware/         # Auth verification
  ├── types/              # TypeScript interfaces
  └── index.ts            # Express app

prisma/
  └── schema.prisma       # Database schema
```

---

## Important Files

- **[COMPONENT_INTEGRATION.md](COMPONENT_INTEGRATION.md)** - How to integrate components
- **[FRONTEND_API_QUICK_REF.md](FRONTEND_API_QUICK_REF.md)** - API usage examples
- **[API_DOCS_COMPLETE.md](API_DOCS_COMPLETE.md)** - Complete API reference

---

## Next Steps

1. ✅ Get application running
2. 📋 Integrate components (see COMPONENT_INTEGRATION.md)
3. 🧪 Test all features
4. 🚀 Deploy to production

---

## Getting Help

1. Check component integration guide
2. Look at API quick reference
3. Check Network tab in DevTools
4. Look at browser console for errors
5. Verify .env configuration

---

## Success Criteria

✅ Backend running on localhost:5000  
✅ Frontend running on localhost:5173  
✅ Can register new user  
✅ Can login  
✅ Dashboard loads  

---

## You're All Set! 🎉

DonorHub is ready to use. Start integrating components or go straight to using the application.

For detailed integration instructions, see **COMPONENT_INTEGRATION.md**
