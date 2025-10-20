# Ares API Documentation

Complete API reference for the Ares Backend.

**Base URL:** `https://api.aresofficial.net`  
**Version:** 2.0.0  
**Format:** JSON

---

## Table of Contents

- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Codes](#error-codes)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [User Registration](#user-registration)
  - [Get User by UID](#get-user-by-uid)
  - [Get User by Username](#get-user-by-username)
  - [Delete User](#delete-user)
- [Data Models](#data-models)

---

## Authentication

Currently, all endpoints are public. JWT authentication will be implemented in a future version.

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description"
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input data |
| `USER_NOT_FOUND` | User does not exist |
| `MISSING_UID` | User UID is required |
| `MISSING_USERNAME` | Username is required |
| `ENDPOINT_NOT_FOUND` | The requested endpoint does not exist |
| `SERVICE_UNAVAILABLE` | Database is not available |
| `INTERNAL_ERROR` | Internal server error |
| `AUTH_ERROR` | Authentication/authorization error |

### Firebase Auth Error Codes

| Code | Description |
|------|-------------|
| `auth/email-already-exists` | Email is already registered |
| `auth/invalid-email` | Invalid email address |
| `auth/username-already-exists` | Username is already taken |
| `auth/weak-password` | Password is too weak (min 6 characters) |

---

## Endpoints

### Health Check

**GET** `/`

Returns API information and available endpoints.

**Response:**
```json
{
  "success": true,
  "message": "Welcome to Ares API",
  "version": "2.0.0",
  "baseUrl": "https://api.aresofficial.net",
  "status": "online",
  "endpoints": {
    "health": "GET /health",
    "auth": {
      "register": "POST /auth/register",
      "getUser": "GET /auth/user/:uid",
      "getUserByUsername": "GET /auth/user/username/:username",
      "deleteUser": "DELETE /auth/user/:uid"
    }
  },
  "firebase": {
    "status": "connected",
    "connected": true
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

---

**GET** `/health`

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

---

### User Registration

**POST** `/auth/register`

Register a new user with email, password, and username.

**Request Body:**
```json
{
  "email": "player@example.com",
  "password": "securepass123",
  "username": "player1"
}
```

**Validation Rules:**
- `email`: Valid email format required
- `password`: Minimum 6 characters
- `username`: Minimum 3 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "qMlicKBQItcYCssl5nEo7r6Qccb2",
    "email": "player@example.com",
    "username": "player1",
    "profile": {
      "username": "player1",
      "email": "player@example.com",
      "coins": 0,
      "xp": 0,
      "kills": 0,
      "deaths": 0,
      "matches": 0,
      "skinTag": 0,
      "friends": [],
      "guns": [],
      "friendRequests": [],
      "createdAt": "2025-10-20T12:00:00.000Z",
      "updatedAt": "2025-10-20T12:00:00.000Z"
    }
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      "Invalid email address",
      "Password must be at least 6 characters",
      "Username must be at least 3 characters"
    ]
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

**Example:**
```bash
curl -X POST https://api.aresofficial.net/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@example.com",
    "password": "securepass123",
    "username": "player1"
  }'
```

---

### Get User by UID

**GET** `/auth/user/:uid`

Retrieve user data by Firebase UID.

**Parameters:**
- `uid` (path parameter): Firebase user ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "username": "player1",
    "email": "player@example.com",
    "coins": 0,
    "xp": 0,
    "kills": 0,
    "deaths": 0,
    "matches": 0,
    "skinTag": 0,
    "friends": [],
    "guns": [],
    "friendRequests": [],
    "createdAt": "2025-10-20T12:00:00.000Z",
    "updatedAt": "2025-10-20T12:00:00.000Z"
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

**Example:**
```bash
curl https://api.aresofficial.net/auth/user/qMlicKBQItcYCssl5nEo7r6Qccb2
```

---

### Get User by Username

**GET** `/auth/user/username/:username`

Retrieve user data by username.

**Parameters:**
- `username` (path parameter): User's username

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "username": "player1",
    "email": "player@example.com",
    "coins": 100,
    "xp": 500,
    "kills": 10,
    "deaths": 5,
    "matches": 15,
    "skinTag": 0,
    "friends": [],
    "guns": [0, 1, 2],
    "friendRequests": [],
    "createdAt": "2025-10-20T12:00:00.000Z",
    "updatedAt": "2025-10-20T12:30:00.000Z"
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

**Example:**
```bash
curl https://api.aresofficial.net/auth/user/username/player1
```

---

### Delete User

**DELETE** `/auth/user/:uid`

Delete a user and all associated data.

**Parameters:**
- `uid` (path parameter): Firebase user ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while deleting the user"
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

**Example:**
```bash
curl -X DELETE https://api.aresofficial.net/auth/user/qMlicKBQItcYCssl5nEo7r6Qccb2
```

---

## Data Models

### User Profile

```typescript
{
  username: string,           // User's unique username
  email: string,              // User's email address
  coins: number,              // In-game currency
  xp: number,                 // Experience points
  kills: number,              // Total kills
  deaths: number,             // Total deaths
  matches: number,            // Total matches played
  skinTag: number,            // Selected skin ID
  friends: string[],          // Array of friend UIDs
  guns: number[],             // Array of owned gun IDs
  friendRequests: string[],   // Array of pending friend request UIDs
  createdAt: string,          // ISO 8601 timestamp
  updatedAt: string           // ISO 8601 timestamp
}
```

### Username Mapping

```typescript
{
  uid: string,               // Firebase user ID
  createdAt: string          // ISO 8601 timestamp
}
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Invalid input data |
| `401` | Unauthorized - Authentication required |
| `403` | Forbidden - Access denied |
| `404` | Not Found - Resource not found |
| `500` | Internal Server Error - Server error |
| `503` | Service Unavailable - Service not available |

---

## Rate Limiting

Currently no rate limiting is implemented. This will be added in a future version.

---

## API Versioning

Current version: **v2.0.0**

Future versions will be accessible via URL prefix (e.g., `/v2/auth/register`)

---

## Support

For issues or questions, please refer to the [README](./README.md) or contact the development team.

---

**Last Updated:** October 20, 2025
