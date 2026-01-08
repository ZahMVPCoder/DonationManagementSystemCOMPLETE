# Quick Reference - API Endpoints

## Base URL
```
http://localhost:5000/api
```

## All Donor Endpoints (Require JWT Token)

### List Donors
```bash
GET /donors
GET /donors?search=john
GET /donors?status=active
GET /donors?limit=20&offset=0
GET /donors?search=jane&status=lapsed&limit=50
```

### Get Single Donor
```bash
GET /donors/1
GET /donors/123
```

### Create Donor
```bash
POST /donors
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-555-0123",
  "status": "new",
  "notes": "Optional notes"
}
```

### Update Donor
```bash
PATCH /donors/1
{
  "status": "active",
  "phone": "+1-555-0456",
  "notes": "Updated notes"
}
```

### Delete Donor
```bash
DELETE /donors/1
```

---

## All Donation Endpoints (Require JWT Token)

### List Donations
```bash
GET /donations
GET /donations?donorId=1
GET /donations?campaignId=5
GET /donations?method=credit%20card
GET /donations?donorId=1&limit=20&offset=0
```

### Get Single Donation
```bash
GET /donations/1
GET /donations/42
```

### Create Donation (Auto-creates thank-you task)
```bash
POST /donations
{
  "amount": 500.00,
  "date": "2026-01-07",
  "method": "credit card",
  "donorId": 1,
  "campaignId": 1,
  "recurring": false,
  "notes": "Optional donation notes"
}
```

### Update Donation
```bash
PATCH /donations/1
{
  "thanked": true,
  "notes": "Thank you sent"
}
```

### Delete Donation
```bash
DELETE /donations/1
```

---

## Authentication Endpoints (Public)

### Register
```bash
POST /auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe"
}
```

### Login
```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

### Logout
```bash
POST /auth/logout
```

---

## Using with curl

### Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Use Token for Requests
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/donors
```

### Create Donation with Token
```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "status": "active"
  }'
```

---

## Query Parameters

### Search & Filter
- `search` - Search name/email
- `status` - Filter by status (active, lapsed, new)
- `limit` - Results per page (default: 10, max: 100)
- `offset` - Pagination offset (default: 0)

### Valid Status Values
- `new` - New donor
- `active` - Active donor
- `lapsed` - Lapsed donor (inactive)

---

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success message",
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### Error Response
```json
{
  "error": "Error description"
}
```

---

## HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (no/invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Server Error

---

## All Campaign Endpoints (Require JWT Token)

### List Campaigns
```bash
GET /campaigns
GET /campaigns?status=active
GET /campaigns?status=completed
GET /campaigns?limit=20&offset=0
```

### Get Single Campaign
```bash
GET /campaigns/camp_123456
```

### Create Campaign
```bash
POST /campaigns
{
  "name": "Emergency Relief Fund",
  "description": "Helping families affected by natural disasters",
  "goal": 50000,
  "startDate": "2026-01-01",
  "endDate": "2026-03-31",
  "status": "active"
}
```

### Update Campaign
```bash
PATCH /campaigns/camp_123456
{
  "goal": 60000,
  "status": "paused"
}
```

---

## Using with curl

All endpoints require JWT token. Get token from login:

```bash
# 1. Login
TOKEN=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }' | jq -r '.token')

# 2. Use token in requests
curl -X GET "http://localhost:5000/api/campaigns" \
  -H "Authorization: Bearer $TOKEN"

curl -X GET "http://localhost:5000/api/donors" \
  -H "Authorization: Bearer $TOKEN"

curl -X GET "http://localhost:5000/api/donations" \
  -H "Authorization: Bearer $TOKEN"

curl -X GET "http://localhost:5000/api/tasks" \
  -H "Authorization: Bearer $TOKEN"
```

---

## All Task Endpoints (Require JWT Token)

### List Tasks
```bash
GET /tasks
GET /tasks?completed=false
GET /tasks?priority=high
GET /tasks?donorId=donor_123
GET /tasks?completed=false&priority=high&limit=20
```

### Get Single Task
```bash
GET /tasks/task_001
```

### Create Task
```bash
POST /tasks
{
  "type": "thank-you",
  "description": "Send thank you letter",
  "donorId": "donor_123",
  "dueDate": "2026-01-14",
  "priority": "high"
}
```

### Update Task
```bash
PATCH /tasks/task_001
{
  "completed": true,
  "priority": "low"
}
```

### Delete Task
```bash
DELETE /tasks/task_001
```

---

## Development Commands

```bash
# Start server
npm run server

# Start frontend + server
npm run dev:full

# Database
npm run prisma:migrate
npm run prisma:studio

# Test API
bash test-api.sh
```
