# Ares Backend API

Backend API professionale per il gioco Ares, costruito con architettura MVC scalabile e manutenibile.

## 🚀 Quick Start

### Prerequisiti
- Node.js >= 18.0.0
- npm o yarn
- Account Firebase con progetto configurato

### Installazione

1. **Clone il repository**
```bash
cd Ares-backend
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Configura Firebase**

Crea un file `.env` nella root del progetto:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
BASE_URL=http://localhost:3000
```

> **Nota:** Per ottenere le credenziali Firebase, segui la guida in `FIREBASE_SETUP.md`

4. **Avvia il server**

**Produzione:**
```bash
npm start
```

**Sviluppo (con auto-reload):**
```bash
npm run dev
```

Il server sarà disponibile su `http://localhost:3000`

---

## 📁 Struttura del Progetto

```
Ares-backend/
├── config/
│   └── firebase.js              # Configurazione Firebase Admin SDK
├── src/
│   ├── controllers/             # Gestione richieste HTTP
│   │   └── auth.controller.js   # Controller autenticazione
│   ├── services/                # Logica di business
│   │   └── auth.service.js      # Service autenticazione
│   ├── models/                  # Modelli dati
│   │   └── User.model.js        # Modello utente
│   ├── routes/                  # Definizione routes
│   │   ├── index.js             # Router principale
│   │   └── auth.routes.js       # Routes autenticazione
│   ├── middlewares/             # Middleware custom
│   │   ├── errorHandler.js      # Gestione errori globale
│   │   ├── requestLogger.js     # Logging richieste
│   │   └── validateFirebase.js  # Validazione Firebase
│   └── utils/                   # Utility functions
│       └── response.js          # Helper risposte HTTP
├── server.js                    # Entry point applicazione
├── package.json
├── .env                         # Variabili ambiente (non committare!)
├── .env.example                 # Esempio configurazione
├── API_DOCUMENTATION.md         # Documentazione API completa
├── FIREBASE_SETUP.md            # Guida setup Firebase
└── README.md                    # Questo file
```

---

## 🔥 Features

✅ **Architettura MVC** - Codice organizzato e manutenibile  
✅ **Firebase Integration** - Auth e Firestore  
✅ **Error Handling** - Gestione errori centralizzata  
✅ **Request Logging** - Log dettagliato delle richieste  
✅ **Input Validation** - Validazione robusta dei dati  
✅ **CORS Configured** - Pronto per integration frontend  
✅ **Professional Structure** - Best practices Node.js  

---

## 📡 Endpoints Principali

### Registrazione Utente
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "playerone"
}
```

### Ottieni Utente
```http
GET /auth/user/:uid
GET /auth/user/username/:username
```

### Elimina Utente
```http
DELETE /auth/user/:uid
```

Per la documentazione completa, vedi [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🧪 Testing

### Con cURL
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testplayer"
  }'
```

### Con file HTTP
Usa il file `test.http` con REST Client o Thunder Client per VS Code:
1. Installa l'estensione "REST Client" o "Thunder Client"
2. Apri `test.http`
3. Clicca su "Send Request" sopra ogni richiesta

---

## 🗄️ Struttura Database

### Collection: `users`
Profilo utente con statistiche di gioco
```json
{
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
```

### Collection: `usernames`
Mapping username -> UID (per unicità)
```json
{
  "uid": "firebase-user-id",
  "createdAt": "2025-10-20T10:30:00.000Z"
}
```

---

## 🔧 Scripts Disponibili

```bash
npm start        # Avvia server in produzione
npm run dev      # Avvia server in sviluppo con nodemon
```

---

## 🛡️ Sicurezza

- ✅ Variabili ambiente per credenziali sensibili
- ✅ Validazione input lato server
- ✅ Error handling senza esposizione dettagli interni
- ⚠️ TODO: Implementare rate limiting
- ⚠️ TODO: Implementare JWT authentication middleware
- ⚠️ TODO: Implementare HTTPS in produzione

---

## 📝 Changelog

### v2.0.0 (2025-10-20)
- ✨ Completo refactoring architettura MVC
- ✨ Implementato endpoint registrazione utente
- ✨ Aggiunto sistema di validazione robusto
- ✨ Implementato error handling centralizzato
- ✨ Aggiunto request logging
- ✨ Creata documentazione completa
- ✨ Integrazione completa Firebase Auth + Firestore

### v1.0.0 (precedente)
- 🎉 Release iniziale con endpoints base

---

## 🚧 Roadmap

- [ ] Implementare login endpoint
- [ ] Implementare password reset
- [ ] Aggiungere JWT authentication middleware
- [ ] Sistema di gestione amicizie
- [ ] Sistema achievements
- [ ] Rate limiting
- [ ] API versioning
- [ ] WebSocket per real-time
- [ ] Unit tests
- [ ] Integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

## 👥 Contribuire

Questo è un progetto privato. Per contribuire, contattare il team di sviluppo.

---

## 📄 Licenza

ISC

---

## 🚀 Deploy su Render

Per deployare questo backend su Render:

1. **Collega il repository GitHub** a Render
2. **Configura le variabili d'ambiente** (vedi `RENDER_DEPLOY.md`)
3. **Deploy automatico** al push su main

**Guida completa:** Vedi [RENDER_DEPLOY.md](./RENDER_DEPLOY.md)

**Variabili d'ambiente richieste:**
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`  
- `FIREBASE_PRIVATE_KEY`

---

## 🆘 Supporto

Per problemi o domande:
1. Verifica la documentazione in `API_DOCUMENTATION.md`
2. Controlla la configurazione Firebase in `FIREBASE_SETUP.md`
3. Per problemi di deploy su Render, vedi `RENDER_DEPLOY.md`
4. Controlla i log del server per errori dettagliati
5. Contatta il team di sviluppo

---

## 🎮 Integrazione con Unity

Questo backend è progettato per integrarsi con il client Unity di Ares. La logica di registrazione replica esattamente il comportamento di `FirebaseAuthManager.cs` nel progetto Unity.

### Esempio chiamata da Unity (C#):
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
    
    using (UnityWebRequest www = new UnityWebRequest("http://localhost:3000/auth/register", "POST"))
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

**Buon coding! 🚀**
