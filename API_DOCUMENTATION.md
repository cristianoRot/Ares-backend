# Ares Backend API - Documentazione

## Indice
- [Panoramica](#panoramica)
- [Struttura del Progetto](#struttura-del-progetto)
- [Setup](#setup)
- [Endpoints](#endpoints)
- [Testing](#testing)

---

## Panoramica

Backend API professionale per Ares, costruito con Node.js, Express e Firebase Admin SDK.

**Versione:** 2.0.0  
**Architettura:** MVC (Model-View-Controller)

### Stack Tecnologico
- **Runtime:** Node.js >= 18.0.0
- **Framework:** Express.js
- **Database:** Firebase Firestore
- **Autenticazione:** Firebase Auth

---

## Struttura del Progetto

```
Ares-backend/
├── config/
│   └── firebase.js              # Configurazione Firebase
├── src/
│   ├── controllers/             # Controllers (logica HTTP)
│   │   └── auth.controller.js
│   ├── services/                # Services (business logic)
│   │   └── auth.service.js
│   ├── models/                  # Data models
│   │   └── User.model.js
│   ├── routes/                  # Route definitions
│   │   ├── index.js
│   │   └── auth.routes.js
│   ├── middlewares/             # Middleware functions
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│   │   └── validateFirebase.js
│   └── utils/                   # Utility functions
│       └── response.js
├── server.js                    # Entry point
├── package.json
├── .env                         # Environment variables
└── API_DOCUMENTATION.md
```

---

## Setup

### 1. Installare le dipendenze
```bash
npm install
```

### 2. Configurare Firebase
Crea un file `.env` nella root del progetto:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
BASE_URL=http://localhost:3000
```

### 3. Avviare il server

**Produzione:**
```bash
npm start
```

**Sviluppo (con auto-reload):**
```bash
npm run dev
```

---

## Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Welcome / Info
**GET** `/`

Restituisce informazioni sull'API e lista degli endpoints disponibili.

**Response:**
```json
{
  "message": "Benvenuto all'API di Ares",
  "version": "2.0.0",
  "status": "online",
  "firebaseStatus": "✅ connected",
  "endpoints": { ... }
}
```

---

### 2. Health Check
**GET** `/health`

Verifica lo stato dell'API.

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-10-20T10:30:00.000Z"
}
```

---

### 3. Registrazione Utente
**POST** `/auth/register`

Crea un nuovo utente con email, password e username.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "playerone"
}
```

**Validazione:**
- `email`: formato email valido
- `password`: minimo 6 caratteri
- `username`: minimo 3 caratteri

**Response Success (201):**
```json
{
  "success": true,
  "message": "Utente registrato con successo",
  "data": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "username": "playerone",
    "profile": {
      "username": "playerone",
      "email": "user@example.com",
      "coins": 0,
      "xp": 0,
      "kills": 0,
      "deaths": 0,
      "matches": 0,
      "skinTag": 0,
      "friends": [],
      "guns": [],
      "friendRequests": [],
      "createdAt": "2025-10-20T10:30:00.000Z",
      "updatedAt": "2025-10-20T10:30:00.000Z"
    }
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Email già registrata",
  "code": "auth/email-already-exists"
}
```

**Errori possibili:**
- `auth/email-already-exists` - Email già registrata
- `auth/invalid-email` - Email non valida
- `auth/username-already-exists` - Username già in uso
- `auth/weak-password` - Password troppo debole

---

### 4. Ottieni Utente per UID
**GET** `/auth/user/:uid`

Recupera i dati di un utente tramite il suo UID Firebase.

**Parametri:**
- `uid` (path parameter): UID dell'utente Firebase

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "username": "playerone",
    "email": "user@example.com",
    "coins": 0,
    "xp": 0,
    "kills": 0,
    "deaths": 0,
    "matches": 0,
    "skinTag": 0,
    "friends": [],
    "guns": [],
    "friendRequests": [],
    "createdAt": "2025-10-20T10:30:00.000Z",
    "updatedAt": "2025-10-20T10:30:00.000Z"
  }
}
```

---

### 5. Ottieni Utente per Username
**GET** `/auth/user/username/:username`

Recupera i dati di un utente tramite il suo username.

**Parametri:**
- `username` (path parameter): Username dell'utente

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "username": "playerone",
    "email": "user@example.com",
    "coins": 100,
    "xp": 500,
    ...
  }
}
```

---

### 6. Elimina Utente
**DELETE** `/auth/user/:uid`

Elimina un utente e tutti i suoi dati da Firebase Auth e Firestore.

**Parametri:**
- `uid` (path parameter): UID dell'utente Firebase

**Response Success (200):**
```json
{
  "success": true,
  "message": "Utente eliminato con successo"
}
```

---

## Testing

### Con cURL

#### 1. Registra un nuovo utente
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testplayer"
  }'
```

#### 2. Ottieni utente per UID
```bash
curl http://localhost:3000/auth/user/FIREBASE_UID
```

#### 3. Ottieni utente per username
```bash
curl http://localhost:3000/auth/user/username/testplayer
```

#### 4. Elimina utente
```bash
curl -X DELETE http://localhost:3000/auth/user/FIREBASE_UID
```

### Con Postman

Importa la seguente collection in Postman:

1. Crea una nuova collection "Ares API"
2. Aggiungi le richieste con i dettagli sopra
3. Imposta la variabile `{{baseUrl}}` = `http://localhost:3000`

### Con Thunder Client (VS Code)

Usa il file `test.http` incluso nel progetto per testare gli endpoints direttamente da VS Code.

---

## Struttura Dati

### User Profile (Firestore Collection: `users`)
```typescript
{
  username: string,
  email: string,
  coins: number,
  xp: number,
  kills: number,
  deaths: number,
  matches: number,
  skinTag: number,
  friends: string[],        // Array di UID
  guns: number[],           // Array di gun IDs
  friendRequests: string[], // Array di UID
  createdAt: string,        // ISO 8601
  updatedAt: string         // ISO 8601
}
```

### Username Mapping (Firestore Collection: `usernames`)
```typescript
{
  uid: string,
  createdAt: string
}
```

---

## Error Handling

Tutti gli endpoint seguono una struttura di risposta consistente:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

**Error:**
```json
{
  "success": false,
  "error": "Messaggio di errore",
  "code": "error/code",
  "timestamp": "2025-10-20T10:30:00.000Z"
}
```

---

## Codici di Stato HTTP

- `200` - OK (successo)
- `201` - Created (risorsa creata)
- `400` - Bad Request (errore di validazione)
- `401` - Unauthorized (non autorizzato)
- `403` - Forbidden (accesso negato)
- `404` - Not Found (risorsa non trovata)
- `500` - Internal Server Error (errore server)
- `503` - Service Unavailable (servizio non disponibile)

---

## Prossimi Sviluppi

- [ ] Middleware di autenticazione JWT
- [ ] Rate limiting
- [ ] Endpoint per login
- [ ] Endpoint per reset password
- [ ] Gestione amicizie
- [ ] Sistema di achievements
- [ ] WebSocket per real-time updates
- [ ] API versioning

---

## Supporto

Per problemi o domande, contattare il team di sviluppo.

**Data ultima modifica:** 20 Ottobre 2025

