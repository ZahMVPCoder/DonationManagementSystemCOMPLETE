# Campaign CRUD API Endpoints

Complete reference for all campaign management endpoints with automatic raised amount calculation from linked donations.

---

## Overview

Campaign endpoints allow you to create, retrieve, update, and manage fundraising campaigns. The `raised` amount is calculated dynamically by summing all donations linked to each campaign.

**Base URL:** `http://localhost:5000/api/campaigns`

**Authentication:** All endpoints require JWT token in `Authorization: Bearer <token>` header

---

## Endpoints

### 1. Get All Campaigns

**GET** `/api/campaigns`

Retrieve all campaigns with donation counts and dynamically calculated raised amounts.

**Query Parameters:**
- `limit` (number, optional): Items per page. Default: 10, Max: 100
- `offset` (number, optional): Pagination offset. Default: 0
- `status` (string, optional): Filter by status: `active`, `completed`, `paused`

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/campaigns?limit=10&offset=0&status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200):**
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
    },
    {
      "id": "camp_789012",
      "name": "Education Initiative",
      "description": "Scholarships for underprivileged students",
      "goal": 100000,
      "raised": 78500,
      "startDate": "2025-06-01",
      "endDate": "2026-06-01",
      "status": "active",
      "donationCount": 127,
      "createdAt": "2025-06-01T09:15:00.000Z",
      "updatedAt": "2026-01-07T14:22:00.000Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 2
  }
}
```

**Error Responses:**
- `500`: Server error

---

### 2. Get Single Campaign with Donations

**GET** `/api/campaigns/:id`

Retrieve a single campaign with complete donation history and dynamically calculated raised amount.

**URL Parameters:**
- `id` (string, required): Campaign ID

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/campaigns/camp_123456" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200):**
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
      },
      {
        "id": "don_002",
        "amount": 500,
        "date": "2026-01-06",
        "method": "bank_transfer",
        "donorId": "donor_456",
        "thanked": false
      }
    ],
    "createdAt": "2026-01-07T10:00:00.000Z",
    "updatedAt": "2026-01-07T15:30:00.000Z"
  }
}
```

**Error Responses:**
- `404`: Campaign not found
- `500`: Server error

---

### 3. Create Campaign

**POST** `/api/campaigns`

Create a new fundraising campaign. Initial `raised` amount will be 0.

**Request Body (CreateCampaignRequest):**
```json
{
  "name": "Campaign Name",
  "description": "Campaign description (optional)",
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
- `status` (string): Campaign status: `active`, `completed`, `paused`. Default: `active`

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
    "endDate": "2026-03-31",
    "status": "active"
  }'
```

**Success Response (201):**
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

**Error Responses:**
- `400`: Invalid input
  - Missing required fields
  - Invalid goal (must be positive)
  - Invalid date format (must be YYYY-MM-DD)
  - Invalid status value
- `500`: Server error

---

### 4. Update Campaign

**PATCH** `/api/campaigns/:id`

Update campaign details. Any field not provided will remain unchanged.

**URL Parameters:**
- `id` (string, required): Campaign ID

**Request Body (UpdateCampaignRequest):**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "goal": 60000,
  "startDate": "2026-01-01",
  "endDate": "2026-03-31",
  "status": "paused"
}
```

**Optional Fields:**
- `name` (string): Campaign name
- `description` (string): Campaign description
- `goal` (number): Fundraising goal (must be positive)
- `startDate` (string): Start date in YYYY-MM-DD format
- `endDate` (string): End date in YYYY-MM-DD format
- `status` (string): Campaign status: `active`, `completed`, `paused`

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

**Success Response (200):**
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
- `400`: Invalid input
  - Invalid goal (must be positive)
  - Invalid date format
  - Invalid status value
- `404`: Campaign not found
- `500`: Server error

---

## Dynamic Raised Calculation

The `raised` field is calculated dynamically from all donations linked to the campaign:

```
raised = SUM(donation.amount WHERE donation.campaignId = campaign.id)
```

**Key Points:**
- Calculated in real-time when fetching campaign data
- Updated automatically when donations are created/deleted
- Includes all donations regardless of `thanked` status
- Does not require separate campaign budget storage

**How It Works:**
1. When you GET a campaign, donations are retrieved
2. Amounts are summed to calculate total raised
3. `raised` field is included in the response
4. When a donation is created/deleted, the campaign's raised amount automatically updates

---

## Filter Examples

### Get Active Campaigns Only
```bash
curl -X GET "http://localhost:5000/api/campaigns?status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Paused Campaigns
```bash
curl -X GET "http://localhost:5000/api/campaigns?status=paused" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Completed Campaigns
```bash
curl -X GET "http://localhost:5000/api/campaigns?status=completed" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Pagination - Get Next Page
```bash
curl -X GET "http://localhost:5000/api/campaigns?limit=10&offset=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Related Operations

### Get All Donations for a Campaign
Use [GET /api/donations](./DONATION_API.md#filter-examples) with `campaignId` filter:
```bash
curl -X GET "http://localhost:5000/api/donations?campaignId=camp_123456" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Donation for Campaign
Use [POST /api/donations](./DONATION_API.md#3-create-donation) with `campaignId`:
```bash
curl -X POST "http://localhost:5000/api/donations" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "date": "2026-01-07",
    "method": "credit_card",
    "donorId": "donor_123",
    "campaignId": "camp_123456"
  }'
```

---

## HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET/PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Campaign ID doesn't exist |
| 500 | Server Error | Unexpected error |

---

## Best Practices

### 1. Always Provide Date Format
```json
{
  "startDate": "2026-01-01",
  "endDate": "2026-03-31"
}
```

### 2. Validate Campaign Status Before Updating
Valid statuses: `active`, `completed`, `paused`

### 3. Check Goal vs Raised
Monitor campaign progress by comparing `goal` and `raised`:
```javascript
const progressPercent = (campaign.raised / campaign.goal) * 100;
```

### 4. Use Pagination for Large Campaign Lists
```bash
curl -X GET "http://localhost:5000/api/campaigns?limit=50&offset=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Filter by Status for Campaign Lists
```bash
curl -X GET "http://localhost:5000/api/campaigns?status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Integration Example

### Create Campaign and Add Donations
```bash
# 1. Create campaign
CAMPAIGN=$(curl -s -X POST "http://localhost:5000/api/campaigns" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Relief",
    "goal": 50000,
    "startDate": "2026-01-01"
  }')

CAMPAIGN_ID=$(echo $CAMPAIGN | jq -r '.data.id')

# 2. Add donation (auto-updates campaign.raised)
curl -X POST "http://localhost:5000/api/donations" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "date": "2026-01-07",
    "method": "credit_card",
    "donorId": "donor_123",
    "campaignId": "'$CAMPAIGN_ID'"
  }'

# 3. Check campaign progress (raised now includes donation)
curl -X GET "http://localhost:5000/api/campaigns/$CAMPAIGN_ID" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

---

## Common Use Cases

### Track Campaign Progress
```bash
# Get all active campaigns with current raised amounts
curl -X GET "http://localhost:5000/api/campaigns?status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### View Campaign Details with Donation History
```bash
# Get specific campaign with all linked donations
curl -X GET "http://localhost:5000/api/campaigns/camp_123456" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Pause a Campaign
```bash
curl -X PATCH "http://localhost:5000/api/campaigns/camp_123456" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "paused"}'
```

### Update Campaign Goal
```bash
curl -X PATCH "http://localhost:5000/api/campaigns/camp_123456" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"goal": 75000}'
```
