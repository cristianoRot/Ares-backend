# Ares Backend API

Professional RESTful API for the Ares game, built with Node.js, Express, and Firebase.

**Production URL:** `https://api.aresofficial.net`  
**Version:** 2.0.0  
**Last Updated:** October 20, 2025

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
  - [Response Format](#response-format)
  - [Error Codes](#error-codes)
  - [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Unity Integration](#unity-integration)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Features

- Scalable MVC Architecture
- Firebase Auth & Firestore Integration
- Input Validation
- Centralized Error Handling
- Professional API Responses
- Request Logging
- CORS Enabled

---

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Firebase project with Firestore enabled
- npm or yarn

### Installation

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`

For development with auto-reload:
```bash
npm run dev
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Firebase Configuration (Required)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=3000
NODE_ENV=production
CORS_ORIGIN=*
BASE_URL=https://api.aresofficial.net
```

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Project Settings** > **Service Accounts**
4. Click **"Generate new private key"**
5. Download the JSON file
6. Extract `project_id`, `client_email`, and `private_key` values

**Important:** The `private_key` must keep `\n` as literal text (not actual newlines) in `.env`

---

## Project Structure

```
Ares-backend/
├── config/
│   └── firebase.js              # Firebase configuration
├── src/
│   ├── controllers/             # HTTP request handlers
│   ├── services/                # Business logic
│   ├── models/                  # Data models
│   ├── routes/                  # Route definitions
│   ├── middlewares/             # Custom middleware
│   └── utils/                   # Utility functions
├── server.js                    # Application entry point
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## API Reference

### Base URL

Production: `https://api.aresofficial.net`  
Local: `http://localhost:3000`

### Response Format

#### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

#### Error Response

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

### Error Codes

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
| `ADMIN_ERROR` | Admin operation error |
| `UNAUTHORIZED` | Missing or invalid authentication token |
| `INVALID_TOKEN` | Invalid or expired authentication token |
| `FORBIDDEN` | Admin privileges required |
| `MISSING_CREDENTIALS` | Email and password are required |
| `INVALID_CREDENTIALS` | Invalid email or password |
| `MISSING_EMAIL` | targetUserEmail is required |

#### Firebase Auth Error Codes

| Code | Description |
|------|-------------|
| `auth/email-already-exists` | Email is already registered |
| `auth/invalid-email` | Invalid email address |
| `auth/username-already-exists` | Username is already taken |
| `auth/weak-password` | Password is too weak (min 6 characters) |

### Endpoints

#### Health Check

**GET** `/`

Returns API information and available endpoints.

```bash
curl https://api.aresofficial.net/
```

Response:
```json
{
  "success": true,
  "message": "Welcome to Ares API",
  "version": "2.0.0",
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
  }
}
```

---

**GET** `/health`

Health check endpoint.

```bash
curl https://api.aresofficial.net/health
```

---

#### User Registration

**POST** `/auth/register`

Register a new user with email, password, and username.

**Validation Rules:**
- `email`: Valid email format required
- `password`: Minimum 6 characters
- `username`: Minimum 3 characters

**Request:**
```bash
curl -X POST https://api.aresofficial.net/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@example.com",
    "password": "securepass123",
    "username": "player1"
  }'
```

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
      "friendRequests": []
    }
  }
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
  }
}
```

---

#### Get User by UID

**GET** `/auth/user/:uid`

Retrieve user data by Firebase UID.

```bash
curl https://api.aresofficial.net/auth/user/{uid}
```

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
    "friendRequests": []
  }
}
```

---

#### Get User by Username

**GET** `/auth/user/username/:username`

Retrieve user data by username.

```bash
curl https://api.aresofficial.net/auth/user/username/player1
```

---

#### Delete User

**DELETE** `/auth/user`

Delete a user and all associated data. Requires email and password verification.

**Request:**
```bash
curl -X DELETE https://api.aresofficial.net/auth/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "userpassword"
  }'
```

**Request Body:**
- `email` (string, required) - User email
- `password` (string, required) - User password

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
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

---

#### Admin - Get All Users

**POST** `/admin/users`

Get all users with their Firebase Auth data only (no Firestore profiles).

**Authentication Required:** Admin only (requires email and password in request body)

**Request:**
```bash
curl -X POST https://api.aresofficial.net/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword"
  }'
```

**Request Body:**
- `email` (string, required) - Admin user email
- `password` (string, required) - Admin user password

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "total": 150,
    "users": [
      {
        "uid": "qMlicKBQItcYCssl5nEo7r6Qccb2",
        "email": "player@example.com",
        "emailVerified": true,
        "displayName": "player1",
        "disabled": false,
        "metadata": {
          "creationTime": "2025-10-20T12:00:00.000Z",
          "lastSignInTime": "2025-10-20T15:30:00.000Z"
        },
        "customClaims": {
          "admin": false
        }
      }
    ],
    "stats": {
      "total": 150,
      "emailVerified": 120,
      "emailNotVerified": 30,
      "disabled": 2,
      "admin": 5
    }
  }
}
```

---

#### Admin - Get Users Count

**POST** `/admin/users/count`

Get total number of registered users (faster than getting all users).

**Authentication Required:** Admin only (requires email and password in request body)

**Request:**
```bash
curl -X POST https://api.aresofficial.net/admin/users/count \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword"
  }'
```

**Request Body:**
- `email` (string, required) - Admin user email
- `password` (string, required) - Admin user password

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users count retrieved successfully",
  "data": {
    "count": 150
  }
}
```

---

#### Admin - Set Admin Privileges

**POST** `/admin/set-admin`

Grant or revoke admin privileges for a user. Only accessible by existing admins.

**Authentication Required:** Admin only (requires email and password in request body)

**Request:**
```bash
curl -X POST https://api.aresofficial.net/admin/set-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword",
    "targetUserEmail": "user@example.com",
    "isAdmin": true
  }'
```

**Request Body:**
- `email` (string, required) - Admin user email (must be admin)
- `password` (string, required) - Admin user password
- `targetUserEmail` (string, required) - Email of user to grant/revoke admin privileges
- `isAdmin` (boolean, required) - `true` to grant admin, `false` to revoke

**Success Response (200):**
```json
{
  "success": true,
  "message": "Admin privileges granted successfully for user@example.com",
  "data": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "admin": true
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with email user@example.com not found"
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

---

#### Admin - Delete User

**DELETE** `/admin/user`

Delete a user and all associated data. Only accessible by existing admins.

**Authentication Required:** Admin only (requires email and password in request body)

**Request:**
```bash
curl -X DELETE https://api.aresofficial.net/admin/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword",
    "targetUserEmail": "user@example.com"
  }'
```

**Request Body:**
- `email` (string, required) - Admin user email (must be admin)
- `password` (string, required) - Admin user password
- `targetUserEmail` (string, required) - Email of user to delete

**Success Response (200):**
```json
{
  "success": true,
  "message": "User user@example.com deleted successfully",
  "data": {
    "uid": "firebase-user-id",
    "email": "user@example.com"
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

---

#### Admin - Disable/Enable User

**POST** `/admin/user/disable`

Disable or enable a user account. Only accessible by existing admins.

**Authentication Required:** Admin only (requires email and password in request body)

**Request:**
```bash
curl -X POST https://api.aresofficial.net/admin/user/disable \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword",
    "targetUserEmail": "user@example.com",
    "disabled": true
  }'
```

**Request Body:**
- `email` (string, required) - Admin user email (must be admin)
- `password` (string, required) - Admin user password
- `targetUserEmail` (string, required) - Email of user to disable/enable
- `disabled` (boolean, required) - `true` to disable, `false` to enable

**Success Response (200):**
```json
{
  "success": true,
  "message": "User user@example.com disabled successfully",
  "data": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "disabled": true
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

---

#### Admin - Update User

**POST** `/admin/user/update`

Update user profile data in Firestore only (coins, xp, kills, etc.). Only accessible by existing admins.

**Authentication Required:** Admin only (requires email and password in request body)

**Request:**
```bash
curl -X POST https://api.aresofficial.net/admin/user/update \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword",
    "targetUserEmail": "user@example.com",
    "coins": 10000,
    "xp": 5000,
    "kills": 100,
    "deaths": 50,
    "matches": 25,
    "skinTag": 5
  }'
```

**Request Body:**
- `email` (string, required) - Admin user email (must be admin)
- `password` (string, required) - Admin user password
- `targetUserEmail` (string, required) - Email of user to update
- `coins` (number, optional) - Update coins
- `xp` (number, optional) - Update experience points
- `kills` (number, optional) - Update kills count
- `deaths` (number, optional) - Update deaths count
- `matches` (number, optional) - Update matches count
- `skinTag` (number, optional) - Update skin tag
- `friends` (array, optional) - Update friends list
- `guns` (array, optional) - Update guns list
- `friendRequests` (array, optional) - Update friend requests list

**Note:** Include only the fields you want to update. All profile fields are optional, but at least one must be provided.

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "profile": {
      "username": "player1",
      "coins": 10000,
      "xp": 5000,
      "kills": 100,
      "deaths": 50,
      "matches": 25,
      "skinTag": 5,
      "updatedAt": "2025-10-20T12:00:00.000Z"
    }
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

**Example: Update only coins**
```bash
curl -X POST https://api.aresofficial.net/admin/user/update \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword",
    "targetUserEmail": "user@example.com",
    "coins": 50000
  }'
```

**Example: Update multiple fields**
```bash
curl -X POST https://api.aresofficial.net/admin/user/update \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword",
    "targetUserEmail": "user@example.com",
    "coins": 100000,
    "xp": 20000,
    "kills": 500
  }'
```

---

## Data Models

### User Profile (Firestore Collection: `users`)

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

### Username Mapping (Firestore Collection: `usernames`)

```typescript
{
  uid: string,               // Firebase user ID
  createdAt: string          // ISO 8601 timestamp
}
```

---

## Unity Integration

### Example: Register User from Unity

```csharp
using UnityEngine.Networking;
using System.Collections;
using Newtonsoft.Json;

public IEnumerator RegisterUser(string email, string password, string username)
{
    var data = new {
        email = email,
        password = password,
        username = username
    };
    
    string json = JsonConvert.SerializeObject(data);
    byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
    
    using (UnityWebRequest www = new UnityWebRequest("https://api.aresofficial.net/auth/register", "POST"))
    {
        www.uploadHandler = new UploadHandlerRaw(bodyRaw);
        www.downloadHandler = new DownloadHandlerBuffer();
        www.SetRequestHeader("Content-Type", "application/json");
        
        yield return www.SendWebRequest();
        
        if (www.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("User registered: " + www.downloadHandler.text);
        }
        else
        {
            Debug.LogError("Error: " + www.error);
        }
    }
}
```

---

## Deployment

### Deploy to Render

1. Connect GitHub Repository to Render
2. Set Environment Variables in Render dashboard:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `NODE_ENV=production`
   - `PORT=3000`
3. Deploy automatically on push to `main` branch

**Important:** The `FIREBASE_PRIVATE_KEY` must include `\n` as literal characters:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n
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

## Security

- Environment variables for sensitive data
- Server-side input validation
- Firebase Admin SDK for secure operations

**TODO:**
- Implement JWT authentication middleware
- Add rate limiting
- Enable HTTPS in production

---

## Roadmap

- JWT authentication middleware
- Login endpoint
- Password reset endpoint
- Friends system endpoints
- Achievements system
- Rate limiting
- API versioning
- WebSocket support for real-time features
- Unit and integration tests

---

## Security

This repository does NOT contain any sensitive data:
- No Firebase credentials
- No API keys
- No environment variables

All sensitive configuration must be added by the user in a `.env` file (which is gitignored).

**Important:** Never commit your `.env` file or Firebase credentials to version control.

### Admin Authentication

Admin endpoints require email and password authentication with admin custom claim:

1. **Set Admin Claim:** Use the script in `admin/set_admin.js` to grant admin privileges to a user
2. **Send Credentials:** Include email and password in request body
3. **Verify:** Backend verifies credentials and checks admin claim

**Request Format:**
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Setting Admin Claim:**
```bash
node admin/set_admin.js
# Enter user email and set admin to true
```

**Environment Variable (Optional but Recommended):**
For enhanced security with password verification, add to `.env`:
```env
FIREBASE_WEB_API_KEY=your-firebase-web-api-key
```

You can find your Web API Key in Firebase Console > Project Settings > General > Your apps

---

## License

MIT License - See [LICENSE](./LICENSE) file for details.

---

## Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## Support

For issues or questions, open an issue on GitHub or contact the development team.
