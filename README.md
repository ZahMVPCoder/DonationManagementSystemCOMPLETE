
# 🎁 Donation Management System - DonorHub

A comprehensive full-stack donation management platform built with React, Express.js, TypeScript, and PostgreSQL. Perfect for nonprofits, charities, and organizations managing donor relationships and fundraising campaigns.

**Based on:** [Figma Design](https://www.figma.com/design/sZry9Gc4joJpjeZ91g1AIt/Donation-Management-System)

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Neon PostgreSQL account (or any PostgreSQL database)

### Setup (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env          # Backend config
cp .env.local.example .env.local  # Frontend config

# Edit .env with your database credentials
# See ENV_SETUP_GUIDE.md for detailed instructions

# 3. Run database migrations
npm run prisma:migrate

# 4. Start development servers
npm run dev
```

✅ Backend runs on: http://localhost:5000
✅ Frontend runs on: http://localhost:5173

For detailed setup instructions, see [QUICKSTART.md](QUICKSTART.md)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](QUICKSTART.md) | 5-minute setup guide |
| [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) | Environment variables explained |
| [API_DOCS_COMPLETE.md](API_DOCS_COMPLETE.md) | API endpoints & usage |
| [CODE_OVERVIEW.md](CODE_OVERVIEW.md) | Architecture & structure |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Implementation status |

---

## 🏗️ Project Structure

```
donation-management-system/
├── server/              # Express.js backend
│   ├── routes/         # API endpoints
│   ├── middleware/      # Auth & utilities
│   └── index.ts        # Server entry point
├── src/                # React frontend
│   ├── components/     # UI components
│   ├── contexts/       # State management
│   ├── utils/          # API client & helpers
│   └── main.tsx        # Frontend entry point
├── prisma/             # Database schema
├── .env               # Backend config (keep secret!)
├── .env.local         # Frontend config
└── package.json       # Dependencies
```

---

## 🎯 Key Features

✅ **User Authentication** - JWT-based login & registration  
✅ **Donor Management** - Create, update, track donor profiles  
✅ **Donation Tracking** - Log donations with campaigns & payment methods  
✅ **Campaign Management** - Create campaigns with progress tracking  
✅ **Task Management** - Auto-generated thank-you and follow-up tasks  
✅ **Dashboard** - Real-time metrics and donor insights  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Type-Safe** - Built with TypeScript throughout  

---

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start both servers (Concurrently)
npm run dev:server      # Start Express backend only
npm run dev:client      # Start React frontend only

# Database
npm run prisma:migrate  # Create database from schema
npm run prisma:studio   # Open Prisma Studio GUI

# Production
npm run build           # Build frontend for production
npm run preview         # Preview production build
npm run server:prod     # Start backend in production mode

# Testing (if configured)
npm test                # Run test suite
npm run test:watch      # Run tests in watch mode
```

---

## 🔐 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...    # Neon database connection
JWT_SECRET=your-secret-key       # Authentication secret (32+ chars)
PORT=5000                        # Server port
NODE_ENV=development             # Environment
FRONTEND_URL=http://localhost:5173  # CORS origin
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api  # Backend API URL
VITE_APP_NAME=DonorHub                   # App name
VITE_APP_VERSION=1.0.0                   # App version
```

📖 See [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) for complete instructions.

---

## 🔌 API Overview

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user (protected)

### Donor Endpoints
- `GET /api/donors` - List all donors (with search/filter)
- `POST /api/donors` - Create new donor
- `GET /api/donors/:id` - Get donor details
- `PATCH /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Delete donor

### Donation Endpoints
- `GET /api/donations` - List donations
- `POST /api/donations` - Create donation (triggers thank-you task)
- `GET /api/donations/:id` - Get donation details
- `PATCH /api/donations/:id` - Update donation

### Campaign Endpoints
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get campaign with donations
- `PATCH /api/campaigns/:id` - Update campaign

### Task Endpoints
- `GET /api/tasks` - List tasks (with filtering)
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id/complete` - Mark task complete

📖 Full API documentation: [API_DOCS_COMPLETE.md](API_DOCS_COMPLETE.md)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Backend** | Express.js + TypeScript |
| **Database** | PostgreSQL (Neon) + Prisma ORM |
| **Auth** | JWT + bcrypt |
| **Styling** | Tailwind CSS + shadcn/ui |
| **HTTP** | Axios |
| **Routing** | React Router v6 |

---

## 📊 Implementation Status

**Completed (100%)**
- ✅ Step 1: Database schema & Prisma setup
- ✅ Step 2: Authentication API
- ✅ Step 3-4: Donor & Donation CRUD with workflows
- ✅ Step 5: Campaign management with dynamic calculations
- ✅ Step 6: Task management with auto-creation
- ✅ Step 7: Frontend authentication & API integration
- ✅ Step 8: Component integration with real API data
- ✅ Step 9: Environment variables configuration

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for detailed progress.

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# If failed, check:
# 1. DATABASE_URL is correct in .env
# 2. Password contains special chars? URL encode them
# 3. Neon project is active (not paused)
```

### Frontend API Errors
```bash
# Check:
# 1. Backend running? npm run dev:server
# 2. VITE_API_URL correct in .env.local
# 3. CORS origin matches (FRONTEND_URL in backend .env)
# 4. Restart frontend: Ctrl+C and npm run dev:client
```

### Port Already in Use
```bash
# Change port in .env (e.g., PORT=5001)
# Or kill existing process on port 5000
```

See [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md#troubleshooting) for more solutions.

---

## 🤝 Contributing

This is a complete implementation of the donation management system. For modifications:

1. Follow TypeScript and React best practices
2. Maintain existing code structure
3. Test API changes with provided endpoints
4. Update documentation if adding new features

---

## 📄 License

This project is provided as-is for educational and organizational purposes.

---

## 📞 Support

For questions or issues:
1. Check [QUICKSTART.md](QUICKSTART.md) for setup help
2. Review [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) for configuration
3. See [API_DOCS_COMPLETE.md](API_DOCS_COMPLETE.md) for API usage
4. Check [PROJECT_STATUS.md](PROJECT_STATUS.md) for implementation details

---

**Ready to get started?** → [QUICKSTART.md](QUICKSTART.md)
  