# Authentication API Documentation

## Overview
This document describes the authentication endpoints for the DonorHub donation management system.

## Base URL
```
http://localhost:5000/api
```

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

## Authentication Header

For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Example:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/api/protected-endpoint
```

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
5. **CORS:** Currently allows all origins (configure in production)

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
