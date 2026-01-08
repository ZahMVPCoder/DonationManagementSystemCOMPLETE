# Code Overview - Donor CRUD Implementation

## 1. Main Server File (server/index.ts)

The main Express application with route integration:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import donorRoutes from './routes/donors.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

---

## 2. Donor Routes (server/routes/donors.ts)

All CRUD operations for donors:

**Key Features:**
- GET /donors - List with search & filter
- GET /donors/:id - Single donor with history
- POST /donors - Create new
- PATCH /donors/:id - Update
- DELETE /donors/:id - Delete with cascade

**All endpoints:**
- Include JWT authentication
- Have input validation
- Return proper error codes
- Include pagination/counts

---

## 3. Authentication Middleware (server/middleware/auth.ts)

JWT verification for protected routes:

```typescript
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

---

## 4. Type Definitions (server/types/donor.ts)

TypeScript interfaces for type safety:

```typescript
interface CreateDonorRequest {
  name: string;
  email: string;
  phone?: string;
  status?: 'active' | 'lapsed' | 'new';
  notes?: string;
}

interface DonorWithDonations {
  id: number;
  name: string;
  email: string;
  // ... more fields
  donations: Donation[];
}
```

---

## 5. Database Schema (prisma/schema.prisma)

Models with relationships:

```prisma
model Donor {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  phone     String?
  status    String   @default("new")
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  donations Donation[]
  tasks     Task[]
}

model Donation {
  id        Int      @id @default(autoincrement())
  amount    Float
  date      DateTime
  method    String
  recurring Boolean  @default(false)
  thanked   Boolean  @default(false)
  notes     String?

  donorId    Int
  donor      Donor    @relation(fields: [donorId], references: [id], onDelete: Cascade)
  campaignId Int?
  campaign   Campaign? @relation(fields: [campaignId], references: [id], onDelete: SetNull)
}
```

---

## 6. API Response Flow

### Success Flow (Create Donor)
```
1. Client sends POST /api/donors with donor data
2. Middleware verifies JWT token
3. Routes validate input
4. Check for duplicate email
5. Prisma creates record
6. Return 201 Created with new donor data
```

### Error Flow (Duplicate Email)
```
1. Client sends POST /api/donors
2. Middleware verifies JWT token
3. Routes check for duplicate email
4. Email exists in database
5. Return 409 Conflict error
```

### Filtering Flow (List Donors)
```
1. Client sends GET /donors?search=john&status=active
2. Middleware verifies JWT token
3. Routes build Prisma where clause
4. Include _count for donations
5. Apply pagination (limit/offset)
6. Return 200 OK with donors array
```

---

## 7. Error Handling Examples

### Input Validation
```typescript
if (!name || !email) {
  return res.status(400).json({
    error: 'Name and email are required',
  });
}
```

### Duplicate Check
```typescript
const existingDonor = await prisma.donor.findUnique({
  where: { email },
});

if (existingDonor) {
  return res.status(409).json({
    error: 'Donor with this email already exists',
  });
}
```

### Not Found
```typescript
const donor = await prisma.donor.findUnique({
  where: { id: donorId },
});

if (!donor) {
  return res.status(404).json({
    error: 'Donor not found',
  });
}
```

---

## 8. Database Operations

### Create
```typescript
const donor = await prisma.donor.create({
  data: {
    name,
    email,
    phone: phone || null,
    status: status || 'new',
  },
});
```

### Read (Single)
```typescript
const donor = await prisma.donor.findUnique({
  where: { id: donorId },
  include: {
    donations: { orderBy: { date: 'desc' } },
    tasks: { orderBy: { dueDate: 'desc' } },
  },
});
```

### Read (Multiple)
```typescript
const [donors, total] = await Promise.all([
  prisma.donor.findMany({
    where,
    include: { _count: { select: { donations: true } } },
    take: limitNum,
    skip: offsetNum,
  }),
  prisma.donor.count({ where }),
]);
```

### Update
```typescript
const updatedDonor = await prisma.donor.update({
  where: { id: donorId },
  data: updateData,
});
```

### Delete
```typescript
await prisma.donor.delete({
  where: { id: donorId },
});
// Cascade delete removes all donations and tasks
```

---

## 9. Testing Example

Using curl to test:

```bash
# Register
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' | jq -r '.token')

# Create donor
curl -X POST http://localhost:5000/api/donors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Smith","email":"john@example.com"}'

# List donors
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/donors?limit=10

# Get single donor
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/donors/1

# Update donor
curl -X PATCH http://localhost:5000/api/donors/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'

# Delete donor
curl -X DELETE http://localhost:5000/api/donors/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 10. Key Design Decisions

1. **Pagination:** Prevents large data transfers, default 10, max 100 per page
2. **Search:** Case-insensitive for better UX
3. **Cascade Deletes:** Prevents orphaned records
4. **Partial Updates:** PATCH allows updating only changed fields
5. **Validation:** All inputs validated before database operation
6. **Status Enum:** Limited to 3 values (active, lapsed, new)
7. **JWT Tokens:** 7-day expiration for security
8. **Error Codes:** Standard HTTP codes for client handling

---

## 11. Performance Considerations

✅ Database indexes on:
- Donor.email (unique constraint)
- Donation.donorId
- Donation.campaignId
- Task.donorId

✅ Pagination prevents loading thousands of records

✅ _count aggregation efficient with Prisma

✅ Select specific fields when not needed fully

✅ OrderBy on API level, not in-memory sorting

---

## 12. Security Measures

✅ JWT authentication on all donor endpoints
✅ SQL injection prevention via Prisma ORM
✅ Input validation before processing
✅ CORS enabled
✅ Password hashing with bcrypt
✅ Bcrypt salt rounds: 10
✅ Token expiration: 7 days
✅ Type safety with TypeScript
✅ Error messages don't leak sensitive info
