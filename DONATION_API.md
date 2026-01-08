# Donation API Endpoints Documentation

## Overview

The Donation API provides endpoints for managing donations, including automatic thank-you task creation when donations are recorded.

## Base URL
```
http://localhost:5000/api/donations
```

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### 1. Get All Donations

**Endpoint:** `GET /donations`

**Description:** Retrieve all donations with optional filtering and pagination

**Query Parameters:**
- `donorId` (optional): Filter by donor ID
- `campaignId` (optional): Filter by campaign ID
- `method` (optional): Filter by donation method
- `limit` (optional): Results per page (default: 10, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/donations?donorId=1&limit=20&offset=0"
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

**Description:** Retrieve a single donation with complete details

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

**Field Details:**
- `amount` (required): Donation amount (must be positive number)
- `date` (required): ISO date format (YYYY-MM-DD)
- `method` (required): Donation method (e.g., "credit card", "bank transfer", "cash")
- `donorId` (required): ID of the donor
- `campaignId` (optional): ID of associated campaign
- `recurring` (optional): Boolean, default false
- `notes` (optional): Additional notes

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
    "campaignId": 1,
    "notes": "Online donation"
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
    "notes": "Online donation",
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
When a donation is created, the system automatically creates a task:
- **Type:** thank-you
- **Description:** Send thank you message for donation
- **Due Date:** 7 days from creation
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
  "date": "2026-01-06",
  "method": "bank transfer",
  "campaignId": 2,
  "recurring": true,
  "thanked": true,
  "notes": "Updated notes"
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:5000/api/donations/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "thanked": true,
    "notes": "Thank you sent"
  }'
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
    "notes": "Thank you sent",
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
- If donation was linked to a campaign, the campaign's "raised" amount is decremented by the donation amount
- Related thank-you task remains (not automatically deleted)

**Error Responses:**
- `400 Bad Request`: Invalid donation ID
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Donation not found
- `500 Internal Server Error`: Server error

---

## Automatic Workflows

### Thank-You Task Creation

When a donation is created via `POST /donations`, the system automatically:

1. **Creates the donation record**
2. **Creates a thank-you task** with:
   - Type: `thank-you`
   - Description: "Send thank you message for donation"
   - Due Date: 7 days from creation
   - Priority: High
   - Completed: false

This helps track follow-up communications with donors.

### Campaign Amount Update

When a donation is created with a `campaignId`:
- The campaign's `raised` amount is incremented by the donation amount
- When a donation is deleted, the campaign's `raised` amount is decremented

---

## Filter Examples

### Get donations for specific donor:
```bash
GET /donations?donorId=1
```

### Get donations for specific campaign:
```bash
GET /donations?campaignId=5
```

### Get donations by method:
```bash
GET /donations?method=credit%20card
```

### Combined filters with pagination:
```bash
GET /donations?donorId=1&method=bank%20transfer&limit=25&offset=0
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Successful GET or PATCH |
| `201` | Created - Successful POST |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Missing/invalid token |
| `404` | Not Found - Resource doesn't exist |
| `500` | Server Error - Internal error |

---

## Data Types

### Amount
- Type: Number
- Format: Positive decimal (e.g., 500.00)
- Validation: Must be > 0

### Date
- Type: String
- Format: ISO 8601 (YYYY-MM-DD)
- Examples: "2026-01-07", "2026-12-25"

### Method
- Type: String
- Examples: "credit card", "bank transfer", "cash", "check"
- Case-insensitive

### Recurring
- Type: Boolean
- Default: false
- Indicates if donation is part of a recurring pattern

### Thanked
- Type: Boolean
- Default: false
- Indicates if donor has been thanked

---

## Best Practices

1. **Always filter by donorId when appropriate** to reduce data transfer
2. **Check task creation status** in response to confirm thank-you task was created
3. **Use PATCH to update `thanked` status** after sending thank-you communication
4. **Link donations to campaigns** for better tracking and automatic budget updates
5. **Use pagination** for large datasets (don't fetch all donations at once)

---

## Integration Example

```bash
# 1. Get all donations for a donor
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/donations?donorId=1"

# 2. Create a new donation
DONATION=$(curl -X POST http://localhost:5000/api/donations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 250,
    "date": "2026-01-07",
    "method": "credit card",
    "donorId": 1,
    "campaignId": 1
  }')

# 3. Extract donation ID
DONATION_ID=$(echo $DONATION | jq -r '.data.id')

# 4. Mark donation as thanked (after sending thank-you)
curl -X PATCH http://localhost:5000/api/donations/$DONATION_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"thanked": true}'
```
