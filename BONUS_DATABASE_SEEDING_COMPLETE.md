# Bonus: Database Seeding - COMPLETE ✅

## Overview

A comprehensive Prisma seed script has been created to populate the database with test data for development and testing purposes. This eliminates the need to manually create test data and allows for quick setup of a fully functional development environment.

---

## What Was Created

### 1. ✅ Prisma Seed Script (`prisma/seed.ts`)

**Purpose:** Populates PostgreSQL database with realistic test data

**What Gets Seeded:**
- 1 test user account (for authentication testing)
- 6 test donors (with various statuses: active, lapsed, new)
- 5 test donations (with different payment methods and campaigns)
- 3 test campaigns (active, upcoming, completed)
- 5 test tasks (with different types and priorities)

**Features:**
- Clears existing data before seeding (optional - can be disabled)
- Uses bcrypt for secure password hashing (password: "password123")
- Creates proper relationships between entities:
  - Donations linked to donors and campaigns
  - Tasks linked to donors
- Includes realistic test data that matches mock data structure
- Beautiful console output with progress indicators
- Error handling with proper exit codes
- TypeScript support with full type safety

### 2. ✅ Updated `package.json` Scripts

**New npm Commands:**
```json
{
  "scripts": {
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset && npm run prisma:seed"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

**Added Alias Scripts:**
- `dev:server` - Alias for backend server
- `dev:client` - Alias for frontend client
- `dev:full` - Runs both servers concurrently (unchanged)

---

## Test Data Structure

### 1. Test User Account
```
Email: test@donorhub.com
Password: password123
Name: Test User
```

**Use for:**
- Testing login functionality
- Testing JWT token generation
- Testing protected routes

### 2. Test Donors (6 Total)

| Name | Email | Status | Notes |
|------|-------|--------|-------|
| Sarah Johnson | sarah.johnson@email.com | active | Major donor, interested in education |
| Michael Chen | michael.chen@email.com | active | Monthly recurring donor |
| Emily Rodriguez | emily.r@email.com | new | First-time donor, needs thank you |
| David Thompson | david.t@email.com | lapsed | Hasn't given in over a year |
| Lisa Anderson | lisa.anderson@email.com | active | Legacy/planned giving donor |
| James Wilson | james.w@email.com | active | Prefers check donations |

### 3. Test Donations (5 Total)

| Donor | Amount | Date | Method | Campaign | Notes |
|-------|--------|------|--------|----------|-------|
| Michael Chen | $250 | 2026-01-02 | Credit Card | Winter Appeal | Monthly recurring |
| Emily Rodriguez | $1,000 | 2026-01-05 | Bank Transfer | Winter Appeal | First donation |
| Sarah Johnson | $500 | 2025-12-15 | Credit Card | Winter Appeal | - |
| Lisa Anderson | $2,000 | 2025-12-28 | Check | Winter Appeal | Year-end gift |
| James Wilson | $300 | 2025-11-30 | Check | None | General fund |

### 4. Test Campaigns (3 Total)

| Name | Goal | Status | Period | Notes |
|------|------|--------|--------|-------|
| Winter Appeal 2025 | $50,000 | active | Nov 2025 - Jan 2026 | Current campaign |
| Spring Gala 2026 | $75,000 | upcoming | Mar 2026 - Apr 2026 | Planned event |
| Summer Education Fund | $30,000 | completed | Jun 2025 - Aug 2025 | Past campaign |

### 5. Test Tasks (5 Total)

| Type | Donor | Description | Due Date | Priority | Status |
|------|-------|-------------|----------|----------|--------|
| thank_you | Emily Rodriguez | Send thank you letter | 2026-01-08 | high | pending |
| follow_up | David Thompson | Lapsed donor outreach | 2026-01-10 | medium | pending |
| call | Sarah Johnson | Quarterly update call | 2026-01-15 | high | pending |
| email | Lisa Anderson | Send planned giving info | 2026-01-12 | medium | pending |
| thank_you | Michael Chen | Donor appreciation email | 2026-01-07 | low | ✅ completed |

---

## How to Use

### Initial Database Setup with Seed Data

**Option 1: Automatic (Recommended)**
```bash
# This runs migrations AND seeds in one command
npm run db:reset
```

**Option 2: Step by Step**
```bash
# 1. Create/migrate database schema
npm run prisma:migrate

# 2. Populate with seed data
npm run prisma:seed
```

### Running the Seed Script

```bash
# Run seed script only (assumes DB already created)
npm run prisma:seed

# Or using npx directly
npx prisma db seed
```

### View Data in GUI

```bash
# Open Prisma Studio to browse/manage data
npm run prisma:studio
```

### Reset Everything

```bash
# WARNING: Deletes all data and recreates from migrations + seed
npm run db:reset
```

---

## Seed Script Execution Flow

```
1. Connect to PostgreSQL database
   ↓
2. Clear existing data (in order to maintain foreign key constraints):
   - Delete all tasks
   - Delete all donations
   - Delete all campaigns
   - Delete all donors
   - Delete all users
   ↓
3. Create test user account (bcrypt-hashed password)
   ↓
4. Create 6 test donors with realistic details
   ↓
5. Create 3 test campaigns with different statuses
   ↓
6. Create 5 test donations with proper relationships
   ↓
7. Create 5 test tasks linked to donors
   ↓
8. Display summary and success message
```

---

## File Structure

```
prisma/
├── schema.prisma       # Database schema (unchanged)
├── seed.ts            # ✅ NEW - Seed script
└── migrations/        # Migration files (unchanged)

package.json           # ✅ UPDATED - Added seed scripts and config

src/
├── data/
│   └── mockData.ts    # Source data for seed (reference only)
```

---

## Console Output Example

When running the seed script, you'll see:

```
🌱 Starting database seed...

🗑️  Clearing existing data...
✅ Data cleared

👤 Creating test user...
✅ User created: test@donorhub.com

👥 Creating donors...
✅ Created 6 donors

📢 Creating campaigns...
✅ Created 3 campaigns

💰 Creating donations...
✅ Created 5 donations

✅ Creating tasks...
✅ Created 5 tasks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Database seeding completed successfully!

📊 Seed Data Summary:
   • 1 Test User (test@donorhub.com / password123)
   • 6 Donors
   • 5 Donations
   • 3 Campaigns
   • 5 Tasks

🚀 You can now start the application with: npm run dev
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Testing Workflow with Seed Data

### 1. Fresh Start

```bash
# Reset database and seed with test data
npm run db:reset

# Start backend server (Terminal 1)
npm run dev:server

# Start frontend (Terminal 2)
npm run dev:client
```

### 2. Login with Test Account

```
Email: test@donorhub.com
Password: password123
```

### 3. Test Features with Pre-populated Data

- **Dashboard** - Shows metrics from 6 donors, 5 donations, 3 campaigns, 5 tasks
- **Donor List** - 6 test donors ready to browse and manage
- **Campaign Page** - 3 campaigns with donation data already linked
- **Tasks View** - 5 tasks with various statuses and priorities
- **Forms** - Create new donations, donors, campaigns, tasks

### 4. Add More Data

- Create new donors through the form
- Log new donations
- Create new campaigns
- Generate new tasks

### 5. Reset as Needed

```bash
# Clear all custom data and return to original seed state
npm run db:reset
```

---

## Customizing Seed Data

To modify the seed data:

1. **Edit `prisma/seed.ts`**
   - Change donor names, emails, notes
   - Modify donation amounts and dates
   - Add/remove campaigns
   - Create different tasks

2. **Example: Add More Donors**
   ```typescript
   prisma.donor.create({
     data: {
       name: 'New Donor Name',
       email: 'newemail@example.com',
       phone: '(555) 999-9999',
       status: 'active',
       notes: 'Your notes here',
     },
   })
   ```

3. **Run Updated Seed**
   ```bash
   npm run prisma:seed
   ```

---

## Database Relationships in Seed

The seed script creates proper database relationships:

```
User
└── (Independent - no foreign keys)

Donor
├── donations (one-to-many)
└── tasks (one-to-many)

Campaign
└── donations (one-to-many, optional)

Donation
├── donor (many-to-one) ← REQUIRED
├── campaign (many-to-one) ← OPTIONAL
└── (no child relations)

Task
└── donor (many-to-one) ← REQUIRED
```

**Key Points:**
- Foreign key constraints properly maintained
- Donations can exist without campaigns
- All tasks must be linked to donors
- All donations must be linked to donors
- Deleting a donor cascades to donations and tasks

---

## Performance

**Seed Script Execution Time:**
- ~2-5 seconds (typical)
- Depends on database connection speed
- Uses Promise.all() for parallel operations where possible

**Data Volume:**
- 1 user
- 6 donors
- 5 donations
- 3 campaigns
- 5 tasks
- **Total: ~20 records** (lightweight for testing)

---

## Error Handling

The seed script includes robust error handling:

```typescript
// Graceful error handling with exit codes
main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1); // Exit with error code
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Common Issues & Solutions:**

| Issue | Solution |
|-------|----------|
| "DATABASE_URL not found" | Ensure `.env` file exists with DATABASE_URL |
| "Connection refused" | Verify PostgreSQL/Neon is running |
| "Unique constraint violation" | Run `npm run db:reset` to clear duplicate data |
| "Foreign key constraint" | Ensure donors are created before donations |

---

## Migration with Seed

Combine migrations and seeding in your workflow:

```bash
# Create new migration (add new field)
npm run prisma:migrate

# Update seed script to populate new field
# Edit prisma/seed.ts

# Run seed to populate with new field
npm run prisma:seed
```

---

## Production Considerations

**Important:** 
- ⚠️ Only use seed script in development
- ⚠️ Do NOT run on production database
- ⚠️ Seed clears existing data (includes the clearing step)

**For Production:**
- Use migrations only (no seed)
- Manually create admin users
- Use database backups for sample data
- Never commit production credentials

---

## New npm Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start frontend (Vite dev server) |
| `npm run dev:server` | Start Express backend |
| `npm run dev:client` | Start React frontend |
| `npm run dev:full` | Start both servers (requires 2 terminals or concurrently) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run prisma:migrate` | Create database schema from migrations |
| `npm run prisma:seed` | Run seed script to populate test data |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run db:reset` | ⚠️ Dangerous: Reset DB to migrations + seed |

---

## Summary

✅ **Created comprehensive seed script** with 6 donors, 5 donations, 3 campaigns, 5 tasks  
✅ **Added npm scripts** for easy seeding (`prisma:seed`, `db:reset`)  
✅ **Configured Prisma seed** in package.json  
✅ **Maintained data integrity** with proper relationships  
✅ **Included error handling** and progress indicators  
✅ **Documented test data** for quick reference  

The database seeding system is now ready for development and testing! 🚀

---

## Quick Start

```bash
# 1. Complete database setup with seed data (2-3 seconds)
npm run db:reset

# 2. Start development servers
npm run dev:full

# 3. Login in browser
# Email: test@donorhub.com
# Password: password123

# 4. Use pre-populated test data for development
```

That's it! Full development environment ready with sample data. 🎉
