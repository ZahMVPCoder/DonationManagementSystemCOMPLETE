# DonorHub API Documentation

## Overview
Complete API documentation for the DonorHub donation management system.

## Base URL
```
http://localhost:5000/api
```

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Donor CRUD Endpoints](#donor-crud-endpoints)
3. [Donation CRUD Endpoints](#donation-crud-endpoints)
4. [Campaign CRUD Endpoints](#campaign-crud-endpoints)
5. [Task CRUD Endpoints](#task-crud-endpoints)
6. [Authentication Header](#authentication-header)
7. [Error Handling](#error-handling)

---

## Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /auth/register`

**Description:** Register a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `409 Conflict`: User with email already exists
- `500 Internal Server Error`: Server error

---

### 2. Login User
**Endpoint:** `POST /auth/login`

**Description:** Login and receive authentication token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid email or password
- `500 Internal Server Error`: Server error

---

### 3. Logout User
**Endpoint:** `POST /auth/logout`

**Description:** Logout (primarily for client-side token removal)

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Donor CRUD Endpoints

### 1. Get All Donors
**Endpoint:** `GET /donors`

**Description:** Get all donors with optional search and filtering

**Query Parameters:**
- `search` (optional): Search by donor name or email
- `status` (optional): Filter by status (active, lapsed, new)
- `limit` (optional): Number of results per page (default: 10, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/donors?search=john&status=active&limit=20&offset=0"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1-555-0123",
      "status": "active",
      "notes": "Major donor",
      "createdAt": "2026-01-07T10:30:00Z",
      "updatedAt": "2026-01-07T10:30:00Z",
      "_count": {
        "donations": 5
      }
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error

---

### 2. Get Single Donor
**Endpoint:** `GET /donors/:id`

**Description:** Get a single donor with complete donation and task history

**Path Parameters:**
- `id` (required): Donor ID

**Example Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/donors/1"
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "status": "active",
    "notes": "Major donor",
    "createdAt": "2026-01-07T10:30:00Z",
    "updatedAt": "2026-01-07T10:30:00Z",
    "donations": [
      {
        "id": 1,
        "amount": 500.00,
        "date": "2026-01-05T00:00:00Z",
        "method": "credit card",
        "recurring": false,
        "thanked": true,
        "notes": "Holiday donation",
        "campaign": {
          "id": 1,
          "name": "Annual Fund 2026"
        }
      }
    ],
    "tasks": [
      {
        "id": 1,
        "type": "thank-you",
        "description": "Send thank you letter",
        "dueDate": "2026-01-10T00:00:00Z",
        "priority": "high",
        "completed": false
      }
    ],
    "_count": {
      "donations": 5,
      "tasks": 2
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid donor ID
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Donor not found
- `500 Internal Server Error`: Server error

---

### 3. Create Donor
**Endpoint:** `POST /donors`

**Description:** Create a new donor

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-555-0456",
  "status": "new",
  "notes": "Referred by John Smith"
}
```

**Response (201 Created):**
```json
{
  "message": "Donor created successfully",
  "data": {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1-555-0456",
    "status": "new",
    "notes": "Referred by John Smith",
    "createdAt": "2026-01-07T11:00:00Z",
    "updatedAt": "2026-01-07T11:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid status
- `401 Unauthorized`: Missing or invalid token
- `409 Conflict`: Donor with this email already exists
- `500 Internal Server Error`: Server error

---

### 4. Update Donor
**Endpoint:** `PATCH /donors/:id`

**Description:** Update donor information

**Path Parameters:**
- `id` (required): Donor ID

**Request Body:**
```json
{
  "status": "active",
  "phone": "+1-555-0789"
}
```

**Response (200 OK):**
```json
{
  "message": "Donor updated successfully",
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1-555-0789",
    "status": "active",
    "notes": "Major donor",
    "createdAt": "2026-01-07T10:30:00Z",
    "updatedAt": "2026-01-07T11:15:00Z",
    "_count": {
      "donations": 5,
      "tasks": 2
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid donor ID or invalid status
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Donor not found
- `409 Conflict`: Email already in use by another donor
- `500 Internal Server Error`: Server error

---

### 5. Delete Donor
**Endpoint:** `DELETE /donors/:id`

**Description:** Delete a donor and all related donations and tasks

**Path Parameters:**
- `id` (required): Donor ID

**Example Request:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/donors/1"
```

**Response (200 OK):**
```json
{
  "message": "Donor deleted successfully",
  "data": {
    "deletedId": 1,
    "deletedName": "John Smith",
    "relatedDeletions": {
      "donations": 5,
      "tasks": 2
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid donor ID
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Donor not found
- `500 Internal Server Error`: Server error

---

## Donation CRUD Endpoints

### 1. Get All Donations
**Endpoint:** `GET /donations`

**Description:** Get all donations with optional filtering and pagination

**Query Parameters:**
- `donorId` (optional): Filter by donor ID
- `campaignId` (optional): Filter by campaign ID
- `method` (optional): Filter by donation method
- `limit` (optional): Results per page (default: 10, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/donations?donorId=1&limit=20"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "amount": 500.00,
      "date": "2026-01-05T00:00:00Z",
      "method": "credit card",
      "recurring": false,
      "thanked": false,
      "notes": "Holiday donation",
      "createdAt": "2026-01-07T10:30:00Z",
      "updatedAt": "2026-01-07T10:30:00Z",
      "donorId": 1,
      "donor": {
        "id": 1,
        "name": "John Smith",
        "email": "john@example.com"
      },
      "campaignId": 1,
      "campaign": {
        "id": 1,
        "name": "Annual Fund 2026",
        "goal": 10000.00,
        "raised": 5000.00
      }
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error

---

### 2. Get Single Donation
**Endpoint:** `GET /donations/:id`

**Description:** Get a single donation with complete details

**Path Parameters:**
- `id` (required): Donation ID

**Example Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/donations/1"
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "amount": 500.00,
    "date": "2026-01-05T00:00:00Z",
    "method": "credit card",
    "recurring": false,
    "thanked": false,
    "notes": "Holiday donation",
    "createdAt": "2026-01-07T10:30:00Z",
    "updatedAt": "2026-01-07T10:30:00Z",
    "donorId": 1,
    "donor": {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1-555-0123",
      "status": "active"
    },
    "campaignId": 1,
    "campaign": {
      "id": 1,
      "name": "Annual Fund 2026",
      "goal": 10000.00,
      "raised": 5000.00,
      "status": "active"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid donation ID
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Donation not found
- `500 Internal Server Error`: Server error

---

### 3. Create Donation
**Endpoint:** `POST /donations`

**Description:** Create a new donation and automatically create a thank-you task

**Request Body:**
```json
{
  "amount": 250.50,
  "date": "2026-01-07",
  "method": "bank transfer",
  "donorId": 1,
  "campaignId": 1,
  "recurring": false,
  "notes": "Monthly donation"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500.00,
    "date": "2026-01-07",
    "method": "credit card",
    "donorId": 1,
    "campaignId": 1
  }'
```

**Response (201 Created):**
```json
{
  "message": "Donation created successfully",
  "data": {
    "id": 5,
    "amount": 500.00,
    "date": "2026-01-07T00:00:00Z",
    "method": "credit card",
    "recurring": false,
    "thanked": false,
    "notes": null,
    "createdAt": "2026-01-07T11:00:00Z",
    "updatedAt": "2026-01-07T11:00:00Z",
    "donorId": 1,
    "donor": {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com"
    },
    "campaignId": 1,
    "campaign": {
      "id": 1,
      "name": "Annual Fund 2026"
    }
  },
  "taskCreated": true,
  "taskInfo": {
    "type": "thank-you",
    "description": "Send thank you message for donation",
    "dueDate": "2026-01-14T00:00:00Z"
  }
}
```

**Auto-Created Task:**
- **Type:** thank-you
- **Description:** Send thank you message for donation
- **Due Date:** 7 days from donation creation
- **Priority:** High
- **Status:** Not completed

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid data
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Donor or campaign not found
- `500 Internal Server Error`: Server error

---

### 4. Update Donation
**Endpoint:** `PATCH /donations/:id`

**Description:** Update donation information

**Path Parameters:**
- `id` (required): Donation ID

**Request Body (All fields optional):**
```json
{
  "amount": 750.00,
  "thanked": true,
  "notes": "Thank you sent via email"
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:5000/api/donations/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"thanked": true}'
```

**Response (200 OK):**
```json
{
  "message": "Donation updated successfully",
  "data": {
    "id": 1,
    "amount": 500.00,
    "date": "2026-01-05T00:00:00Z",
    "method": "credit card",
    "recurring": false,
    "thanked": true,
    "notes": "Thank you sent via email",
    "createdAt": "2026-01-07T10:30:00Z",
    "updatedAt": "2026-01-07T11:15:00Z",
    "donorId": 1,
    "donor": {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com"
    },
    "campaignId": 1,
    "campaign": {
      "id": 1,
      "name": "Annual Fund 2026"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid donation ID or invalid data
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Donation or campaign not found
- `500 Internal Server Error`: Server error

---

### 5. Delete Donation
**Endpoint:** `DELETE /donations/:id`

**Description:** Delete a donation and revert campaign raised amount

**Path Parameters:**
- `id` (required): Donation ID

**Example Request:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/donations/1"
```

**Response (200 OK):**
```json
{
  "message": "Donation deleted successfully",
  "data": {
    "deletedId": 1,
    "amount": 500.00,
    "campaignReverted": true
  }
}
```

**Side Effects:**
- Donation record is deleted
- If linked to campaign, campaign raised amount is decremented
- Related thank-you task remains (not deleted)

**Error Responses:**
- `400 Bad Request`: Invalid donation ID
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Donation not found
- `500 Internal Server Error`: Server error

---

## Authentication Header

For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Example:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/api/donors
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Description of the error"
}
```

### HTTP Status Codes
- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists (e.g., duplicate email)
- `500 Internal Server Error`: Server error

---

## Token Details

- **Duration:** 7 days
- **Type:** JWT (JSON Web Token)
- **Algorithm:** HS256

---

## Security Notes

1. **Password Hashing:** All passwords are hashed using bcrypt with a salt round of 10
2. **Token Expiration:** Tokens automatically expire after 7 days
3. **HTTPS:** Use HTTPS in production
4. **JWT Secret:** Change the `JWT_SECRET` environment variable in production
5. **CORS:** Configure CORS appropriately for your frontend domain
6. **Cascade Deletes:** Deleting a donor will cascade delete all related donations and tasks

---

## Campaign CRUD Endpoints

All campaign endpoints require JWT authentication.

### 1. Get All Campaigns

**Endpoint:** `GET /campaigns`

**Query Parameters:**
- `limit` (number, max 100): Default 10
- `offset` (number): Default 0
- `status` (string): Filter by `active`, `completed`, or `paused`

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/campaigns?status=active&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "camp_123456",
      "name": "Emergency Relief Fund",
      "description": "Helping families affected by natural disasters",
      "goal": 50000,
      "raised": 32500,
      "startDate": "2026-01-01",
      "endDate": "2026-03-31",
      "status": "active",
      "donationCount": 45,
      "createdAt": "2026-01-07T10:00:00.000Z",
      "updatedAt": "2026-01-07T15:30:00.000Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 5
  }
}
```

### 2. Get Single Campaign with Donations

**Endpoint:** `GET /campaigns/:id`

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/campaigns/camp_123456" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "camp_123456",
    "name": "Emergency Relief Fund",
    "description": "Helping families affected by natural disasters",
    "goal": 50000,
    "raised": 32500,
    "startDate": "2026-01-01",
    "endDate": "2026-03-31",
    "status": "active",
    "donationCount": 45,
    "donations": [
      {
        "id": "don_001",
        "amount": 1000,
        "date": "2026-01-07",
        "method": "credit_card",
        "donorId": "donor_123",
        "thanked": true
      }
    ],
    "createdAt": "2026-01-07T10:00:00.000Z",
    "updatedAt": "2026-01-07T15:30:00.000Z"
  }
}
```

### 3. Create Campaign

**Endpoint:** `POST /campaigns`

**Request Body:**
```json
{
  "name": "Emergency Relief Fund",
  "description": "Helping families affected by natural disasters",
  "goal": 50000,
  "startDate": "2026-01-01",
  "endDate": "2026-03-31",
  "status": "active"
}
```

**Required Fields:**
- `name` (string): Campaign name
- `goal` (number): Fundraising goal (must be positive)
- `startDate` (string): Start date in YYYY-MM-DD format

**Optional Fields:**
- `description` (string): Campaign description
- `endDate` (string): End date in YYYY-MM-DD format
- `status` (string): `active`, `completed`, or `paused`. Default: `active`

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/campaigns" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Relief Fund",
    "description": "Helping families affected by natural disasters",
    "goal": 50000,
    "startDate": "2026-01-01",
    "endDate": "2026-03-31"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "camp_123456",
    "name": "Emergency Relief Fund",
    "description": "Helping families affected by natural disasters",
    "goal": 50000,
    "raised": 0,
    "startDate": "2026-01-01",
    "endDate": "2026-03-31",
    "status": "active",
    "donationCount": 0,
    "createdAt": "2026-01-07T10:00:00.000Z",
    "updatedAt": "2026-01-07T10:00:00.000Z"
  }
}
```

### 4. Update Campaign

**Endpoint:** `PATCH /campaigns/:id`

**Request Body (all fields optional):**
```json
{
  "name": "Updated Name",
  "goal": 60000,
  "status": "paused"
}
```

**Example Request:**
```bash
curl -X PATCH "http://localhost:5000/api/campaigns/camp_123456" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": 60000,
    "status": "paused"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "camp_123456",
    "name": "Emergency Relief Fund",
    "description": "Helping families affected by natural disasters",
    "goal": 60000,
    "raised": 32500,
    "startDate": "2026-01-01",
    "endDate": "2026-03-31",
    "status": "paused",
    "donationCount": 45,
    "donations": [...],
    "createdAt": "2026-01-07T10:00:00.000Z",
    "updatedAt": "2026-01-07T16:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data (invalid goal, date format, status)
- `404 Not Found`: Campaign does not exist
- `500 Server Error`: Unexpected error

### Dynamic Raised Calculation

The `raised` field is **calculated dynamically** from all donations linked to the campaign:

```
raised = SUM(donation.amount WHERE donation.campaignId = campaign.id)
```

- Updates automatically when donations are created/deleted
- Includes all donations regardless of `thanked` status
- No separate budget field needed

---

## Task CRUD Endpoints

All task endpoints require JWT authentication.

### 1. Get All Tasks

**Endpoint:** `GET /tasks`

**Query Parameters:**
- `limit` (number, max 100): Default 10
- `offset` (number): Default 0
- `completed` (boolean): Filter by completion status
- `priority` (string): Filter by `low`, `medium`, or `high`
- `donorId` (string): Filter by specific donor

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/tasks?completed=false&priority=high" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
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
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 25
  }
}
```

### 2. Get Single Task

**Endpoint:** `GET /tasks/:id`

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/tasks/task_001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
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

### 3. Create Task

**Endpoint:** `POST /tasks`

**Request Body:**
```json
{
  "type": "thank-you",
  "description": "Send thank you letter for donation",
  "donorId": "donor_123",
  "dueDate": "2026-01-14",
  "priority": "high"
}
```

**Required Fields:**
- `type` (string): Task type (e.g., "thank-you", "reminder", "follow-up")
- `description` (string): Task description
- `donorId` (string): Donor ID

**Optional Fields:**
- `dueDate` (string): Due date in YYYY-MM-DD format
- `priority` (string): `low`, `medium`, or `high`. Default: `medium`

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/tasks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "thank-you",
    "description": "Send thank you letter",
    "donorId": "donor_123",
    "dueDate": "2026-01-14",
    "priority": "high"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "task_001",
    "type": "thank-you",
    "description": "Send thank you letter",
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

### 4. Update Task

**Endpoint:** `PATCH /tasks/:id`

**Request Body (all fields optional):**
```json
{
  "description": "Updated description",
  "priority": "medium",
  "completed": true
}
```

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

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "task_001",
    "type": "thank-you",
    "description": "Send thank you letter",
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

### 5. Delete Task

**Endpoint:** `DELETE /tasks/:id`

**Example Request:**
```bash
curl -X DELETE "http://localhost:5000/api/tasks/task_001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200 OK):**
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
- `400 Bad Request`: Invalid input data (invalid date format, empty description, invalid priority)
- `404 Not Found`: Task or donor does not exist
- `500 Server Error`: Unexpected error

### Auto-Created Thank-You Tasks

When you create a donation, a thank-you task is automatically created:
- **Type:** `thank-you`
- **Priority:** `high`
- **Due Date:** 7 days from donation date
- **Automatically linked to donor**

Retrieve and manage these auto-created tasks using the task endpoints.

---

## Running the Server

```bash
# Development with auto-reload
npm run server

# Run frontend and server concurrently
npm run dev:full

# Prisma database management
npm run prisma:migrate  # Create/run migrations
npm run prisma:studio   # View database GUI
```

---

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://user:password@host/db"
JWT_SECRET="your-secret-key"
PORT=5000
```
