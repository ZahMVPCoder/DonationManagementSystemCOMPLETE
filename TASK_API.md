# Task CRUD API Endpoints

Complete reference for all task management endpoints with filtering and status tracking.

---

## Overview

Task endpoints allow you to create, retrieve, update, and manage follow-up tasks for donors. Tasks are automatically created when donations are received (as thank-you tasks) and can also be manually created for other purposes like reminders and follow-ups.

**Base URL:** `http://localhost:5000/api/tasks`

**Authentication:** All endpoints require JWT token in `Authorization: Bearer <token>` header

---

## Endpoints

### 1. Get All Tasks

**GET** `/api/tasks`

Retrieve all tasks with filtering by status, priority, and donor.

**Query Parameters:**
- `limit` (number, optional): Items per page. Default: 10, Max: 100
- `offset` (number, optional): Pagination offset. Default: 0
- `completed` (boolean, optional): Filter by completion status: `true` or `false`
- `priority` (string, optional): Filter by priority: `low`, `medium`, `high`
- `donorId` (string, optional): Filter by specific donor

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/tasks?completed=false&priority=high&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "task_001",
      "type": "thank-you",
      "description": "Send thank you letter for $1000 donation",
      "donorId": "donor_123",
      "donorName": "John Doe",
      "dueDate": "2026-01-14",
      "priority": "high",
      "completed": false,
      "createdAt": "2026-01-07T10:00:00.000Z",
      "updatedAt": "2026-01-07T10:00:00.000Z"
    },
    {
      "id": "task_002",
      "type": "follow-up",
      "description": "Follow up on monthly commitment",
      "donorId": "donor_456",
      "donorName": "Jane Smith",
      "dueDate": "2026-01-15",
      "priority": "medium",
      "completed": false,
      "createdAt": "2026-01-06T09:30:00.000Z",
      "updatedAt": "2026-01-06T09:30:00.000Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 25
  }
}
```

---

### 2. Get Single Task

**GET** `/api/tasks/:id`

Retrieve a single task with complete donor information.

**URL Parameters:**
- `id` (string, required): Task ID

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/tasks/task_001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "task_001",
    "type": "thank-you",
    "description": "Send thank you letter for $1000 donation",
    "donorId": "donor_123",
    "donorName": "John Doe",
    "donorEmail": "john@example.com",
    "dueDate": "2026-01-14",
    "priority": "high",
    "completed": false,
    "createdAt": "2026-01-07T10:00:00.000Z",
    "updatedAt": "2026-01-07T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `404`: Task not found
- `500`: Server error

---

### 3. Create Task

**POST** `/api/tasks`

Create a new task for a donor.

**Request Body (CreateTaskRequest):**
```json
{
  "type": "thank-you",
  "description": "Send thank you letter for $1000 donation",
  "donorId": "donor_123",
  "dueDate": "2026-01-14",
  "priority": "high"
}
```

**Required Fields:**
- `type` (string): Task type (e.g., "thank-you", "reminder", "follow-up", custom)
- `description` (string): Task description
- `donorId` (string): ID of the donor this task relates to

**Optional Fields:**
- `dueDate` (string): Due date in YYYY-MM-DD format
- `priority` (string): Priority level: `low`, `medium`, `high`. Default: `medium`

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/tasks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "thank-you",
    "description": "Send thank you letter for donation",
    "donorId": "donor_123",
    "dueDate": "2026-01-14",
    "priority": "high"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "task_001",
    "type": "thank-you",
    "description": "Send thank you letter for donation",
    "donorId": "donor_123",
    "donorName": "John Doe",
    "donorEmail": "john@example.com",
    "dueDate": "2026-01-14",
    "priority": "high",
    "completed": false,
    "createdAt": "2026-01-07T10:00:00.000Z",
    "updatedAt": "2026-01-07T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid input (missing fields, invalid date format, invalid priority)
- `404`: Donor not found
- `500`: Server error

---

### 4. Update Task

**PATCH** `/api/tasks/:id`

Update task details. Any field not provided will remain unchanged.

**URL Parameters:**
- `id` (string, required): Task ID

**Request Body (UpdateTaskRequest):**
```json
{
  "type": "reminder",
  "description": "Updated description",
  "dueDate": "2026-01-21",
  "priority": "medium",
  "completed": true
}
```

**Optional Fields:**
- `type` (string): Task type
- `description` (string): Task description
- `dueDate` (string): Due date in YYYY-MM-DD format
- `priority` (string): Priority: `low`, `medium`, `high`
- `completed` (boolean): Mark task as completed/incomplete

**Example Request:**
```bash
curl -X PATCH "http://localhost:5000/api/tasks/task_001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true,
    "priority": "low"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "task_001",
    "type": "thank-you",
    "description": "Send thank you letter for donation",
    "donorId": "donor_123",
    "donorName": "John Doe",
    "donorEmail": "john@example.com",
    "dueDate": "2026-01-14",
    "priority": "low",
    "completed": true,
    "createdAt": "2026-01-07T10:00:00.000Z",
    "updatedAt": "2026-01-07T15:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid input (invalid date format, invalid priority, empty description)
- `404`: Task not found
- `500`: Server error

---

### 5. Delete Task

**DELETE** `/api/tasks/:id`

Delete a task.

**URL Parameters:**
- `id` (string, required): Task ID

**Example Request:**
```bash
curl -X DELETE "http://localhost:5000/api/tasks/task_001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": "task_001"
  }
}
```

**Error Responses:**
- `404`: Task not found
- `500`: Server error

---

## Task Types

Common task types include:
- `thank-you` - Auto-created when donation received
- `reminder` - Reminder to follow up with donor
- `follow-up` - Check on donor engagement
- `event` - Special event related task
- Custom types supported

---

## Filter Examples

### Get Pending (Incomplete) Tasks
```bash
curl -X GET "http://localhost:5000/api/tasks?completed=false" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get High Priority Tasks
```bash
curl -X GET "http://localhost:5000/api/tasks?priority=high" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Tasks for Specific Donor
```bash
curl -X GET "http://localhost:5000/api/tasks?donorId=donor_123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Pending High Priority Tasks
```bash
curl -X GET "http://localhost:5000/api/tasks?completed=false&priority=high" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Pagination - Get Next Page
```bash
curl -X GET "http://localhost:5000/api/tasks?limit=20&offset=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Auto-Created Tasks

### Thank-You Tasks
When you create a donation, a thank-you task is automatically created:

```bash
# Create donation
curl -X POST "http://localhost:5000/api/donations" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "date": "2026-01-07",
    "method": "credit_card",
    "donorId": "donor_123"
  }'

# Response includes: "taskCreated": true

# Auto-created task:
{
  "type": "thank-you",
  "description": "Send thank you for $1000 donation",
  "donorId": "donor_123",
  "dueDate": "2026-01-14",  // 7 days from now
  "priority": "high",
  "completed": false
}
```

You can then retrieve and complete these tasks:
```bash
# Get pending thank-you tasks
curl -X GET "http://localhost:5000/api/tasks?completed=false&priority=high" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Mark as completed
curl -X PATCH "http://localhost:5000/api/tasks/task_001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

---

## HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET/PATCH/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Task or donor ID doesn't exist |
| 500 | Server Error | Unexpected error |

---

## Best Practices

### 1. Sort by Due Date and Priority
List automatically sorts by:
1. Completion status (incomplete first)
2. Due date (earliest first)
3. Priority (high first)

### 2. Set Due Dates
```json
{
  "type": "thank-you",
  "description": "Send thank you",
  "donorId": "donor_123",
  "dueDate": "2026-01-14",
  "priority": "high"
}
```

### 3. Use Appropriate Priorities
- **High**: Time-sensitive, urgent tasks
- **Medium**: Regular follow-ups (default)
- **Low**: Informational, can wait

### 4. Mark Tasks Complete
```bash
curl -X PATCH "http://localhost:5000/api/tasks/task_001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### 5. Filter for Pending Work
```bash
# Get all pending high-priority tasks
curl -X GET "http://localhost:5000/api/tasks?completed=false&priority=high" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Integration Example

### Complete Task Workflow
```bash
# 1. Login
TOKEN=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}' | jq -r '.token')

# 2. Create donor
DONOR_ID=$(curl -s -X POST "http://localhost:5000/api/donors" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}' | jq -r '.data.id')

# 3. Create donation (auto-creates thank-you task)
curl -X POST "http://localhost:5000/api/donations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "date": "2026-01-07",
    "method": "credit_card",
    "donorId": "'$DONOR_ID'"
  }'

# 4. View pending tasks
curl -X GET "http://localhost:5000/api/tasks?completed=false&priority=high" \
  -H "Authorization: Bearer $TOKEN"

# 5. Get task details
TASK_ID=$(curl -s -X GET "http://localhost:5000/api/tasks?donorId=$DONOR_ID&completed=false" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id')

curl -X GET "http://localhost:5000/api/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN"

# 6. Mark task as completed
curl -X PATCH "http://localhost:5000/api/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 7. Create manual follow-up task
curl -X POST "http://localhost:5000/api/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "follow-up",
    "description": "Follow up on next monthly commitment",
    "donorId": "'$DONOR_ID'",
    "dueDate": "2026-02-07",
    "priority": "medium"
  }'
```

---

## Common Use Cases

### Track Pending Thank-You Tasks
```bash
curl -X GET "http://localhost:5000/api/tasks?type=thank-you&completed=false" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Overdue Tasks
```bash
# Filter by due date in past
curl -X GET "http://localhost:5000/api/tasks?completed=false" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" | jq '.data[] | select(.dueDate < "2026-01-07")'
```

### Get Tasks by Donor
```bash
curl -X GET "http://localhost:5000/api/tasks?donorId=donor_123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Dashboard Summary
```bash
# Pending high priority tasks
curl -X GET "http://localhost:5000/api/tasks?completed=false&priority=high&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Response Format

All task responses include:
- `id` - Unique task identifier
- `type` - Task type/category
- `description` - Task details
- `donorId` - Related donor ID
- `donorName` - Donor's name (from related donor)
- `donorEmail` - Donor's email (in GET/:id response)
- `dueDate` - Due date (YYYY-MM-DD format)
- `priority` - Priority level (low/medium/high)
- `completed` - Completion status (true/false)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
