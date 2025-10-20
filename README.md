# Ares Backend API

Professional RESTful API for the Ares game, built with Node.js, Express, and Firebase.

## 🚀 Features

- ✅ **Scalable MVC Architecture** - Clean, maintainable code structure
- ✅ **Firebase Integration** - Auth & Firestore database
- ✅ **Input Validation** - Robust server-side validation
- ✅ **Error Handling** - Centralized error management
- ✅ **Professional API Responses** - Standardized JSON responses
- ✅ **Request Logging** - Detailed HTTP request logs
- ✅ **CORS Enabled** - Ready for frontend integration

---

## 📦 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Firebase project with Firestore enabled
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables (see below)

# Start server
npm start

# Development mode with auto-reload
npm run dev
```

Server will run on `http://localhost:3000`

---

## ⚙️ Configuration

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
3. Navigate to **Project Settings** → **Service Accounts**
4. Click **"Generate new private key"**
5. Download the JSON file
6. Extract `project_id`, `client_email`, and `private_key` values

**Note:** The `private_key` must keep `\n` as literal text (not actual newlines) when added to `.env`

---

## 📡 API Endpoints

Base URL: `https://api.aresofficial.net`

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/user/:uid` | GET | Get user by UID |
| `/auth/user/username/:username` | GET | Get user by username |
| `/auth/user/:uid` | DELETE | Delete user |

### Health Check

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/health` | GET | Health check |
| `/status` | GET | Server status |

---

## 📝 API Examples

### Register User

```bash
curl -X POST https://api.aresofficial.net/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@example.com",
    "password": "securepass123",
    "username": "player1"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "firebase-generated-uid",
    "email": "player@example.com",
    "username": "player1",
    "profile": {
      "coins": 0,
      "xp": 0,
      "kills": 0,
      "deaths": 0,
      "matches": 0,
      "friends": [],
      "guns": []
    }
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

### Get User

```bash
# By UID
curl https://api.aresofficial.net/auth/user/{uid}

# By Username
curl https://api.aresofficial.net/auth/user/username/player1
```

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 📁 Project Structure

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
├── env.example                  # Environment template
├── README.md                    # This file
└── API_DOCUMENTATION.md         # Complete API docs
```

---

## 🚢 Deployment

### Deploy to Render

1. **Connect GitHub Repository** to Render
2. **Set Environment Variables** in Render dashboard:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `NODE_ENV=production`
   - `PORT=3000`

3. **Deploy** - Automatic on push to `main` branch

### Environment Variables on Render

The `FIREBASE_PRIVATE_KEY` must include `\n` as literal characters:

```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n
```

---

## 🗄️ Database Structure

### Firestore Collections

**users** - User profiles
```json
{
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
```

**usernames** - Username to UID mapping
```json
{
  "uid": "firebase-user-id",
  "createdAt": "2025-10-20T12:00:00.000Z"
}
```

---

## 🎮 Unity Integration

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

## 🛡️ Security

- ✅ Environment variables for sensitive data
- ✅ Server-side input validation
- ✅ Firebase Admin SDK for secure operations
- ⚠️ TODO: Implement JWT authentication middleware
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Enable HTTPS in production

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

---

## 🚧 Roadmap

- [ ] JWT authentication middleware
- [ ] Login endpoint
- [ ] Password reset endpoint
- [ ] Friends system endpoints
- [ ] Achievements system
- [ ] Rate limiting
- [ ] API versioning
- [ ] WebSocket support for real-time features
- [ ] Unit and integration tests

---

## 📄 License

ISC

---

## 📞 Support

For API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

**Production URL:** https://api.aresofficial.net  
**Version:** 2.0.0  
**Last Updated:** October 20, 2025
