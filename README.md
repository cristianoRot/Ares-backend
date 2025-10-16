# Ares Backend

Un backend semplice costruito con Node.js ed Express per gestire API REST.

## 🚀 Caratteristiche

- Server Express configurato
- CORS abilitato
- Gestione JSON
- Integrazione con Firebase/Firestore
- CRUD completo per Firestore collections
- Endpoint di esempio pronti all'uso

## 📋 Endpoint Disponibili

### GET /
Restituisce informazioni generali sull'API

```json
{
  "message": "Benvenuto all'API di Ares",
  "version": "1.0.0",
  "baseUrl": "https://api.aresofficial.net",
  "endpoints": [...]
}
```

### GET /name
Restituisce il nome del progetto

```json
{
  "name": "Ares"
}
```

### GET /status
Verifica lo stato del server

```json
{
  "status": "online",
  "timestamp": "2025-10-16T...",
  "uptime": 123.45
}
```

### POST /data
Invia dati al server

**Body richiesto:**
```json
{
  "name": "Nome",
  "message": "Messaggio"
}
```

**Risposta:**
```json
{
  "success": true,
  "received": {
    "name": "Nome",
    "message": "Messaggio",
    "receivedAt": "2025-10-16T..."
  }
}
```

---

## 🔥 Endpoint Firebase/Firestore

### GET /collection/:collectionName
Ottieni tutti i documenti da una collection

**Esempio:** `GET /collection/users`

**Risposta:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    { "id": "doc1", "name": "Mario", "email": "mario@example.com" },
    { "id": "doc2", "name": "Luigi", "email": "luigi@example.com" }
  ]
}
```

### GET /collection/:collectionName/:docId
Ottieni un singolo documento

**Esempio:** `GET /collection/users/doc1`

**Risposta:**
```json
{
  "success": true,
  "data": {
    "id": "doc1",
    "name": "Mario",
    "email": "mario@example.com"
  }
}
```

### POST /collection/:collectionName
Crea un nuovo documento

**Esempio:** `POST /collection/users`

**Body:**
```json
{
  "name": "Mario",
  "email": "mario@example.com"
}
```

**Risposta:**
```json
{
  "success": true,
  "message": "Documento creato con successo",
  "id": "generatedId123",
  "data": {
    "name": "Mario",
    "email": "mario@example.com",
    "createdAt": "2025-10-16T...",
    "updatedAt": "2025-10-16T..."
  }
}
```

### PUT /collection/:collectionName/:docId
Aggiorna un documento esistente

**Esempio:** `PUT /collection/users/doc1`

**Body:**
```json
{
  "name": "Mario Rossi"
}
```

**Risposta:**
```json
{
  "success": true,
  "message": "Documento aggiornato con successo",
  "id": "doc1"
}
```

### DELETE /collection/:collectionName/:docId
Elimina un documento

**Esempio:** `DELETE /collection/users/doc1`

**Risposta:**
```json
{
  "success": true,
  "message": "Documento eliminato con successo",
  "id": "doc1"
}
```

## 🛠️ Installazione Locale

1. Clona il repository
2. Installa le dipendenze:
```bash
npm install
```

3. Crea un file `.env` (opzionale):
```bash
cp .env.example .env
```

4. Avvia il server:
```bash
# Modalità produzione
npm start

# Modalità sviluppo (con nodemon)
npm run dev
```

Il server sarà disponibile su `http://localhost:3000`

## 🌐 Deploy su Render.com

1. Connetti il tuo repository GitHub a Render
2. Crea un nuovo Web Service
3. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Render rileverà automaticamente la porta dalla variabile `PORT`

### Variabili d'Ambiente su Render

Configura le seguenti variabili d'ambiente nel dashboard di Render:
- `NODE_ENV` - Imposta su `production`
- `PORT` - Viene automaticamente assegnata da Render
- `BASE_URL` - `https://api.aresofficial.net` (o il tuo dominio personalizzato)
- `CORS_ORIGIN` - `https://aresofficial.net` (dominio del tuo sito web principale)

### Configurazione Dominio Personalizzato

Per usare il tuo dominio `aresofficial.net`:

1. **Su Render.com:**
   - Vai al tuo servizio → Settings → Custom Domain
   - Aggiungi il dominio: `api.aresofficial.net`
   - Render ti fornirà un record CNAME

2. **Sul tuo provider DNS (es. Cloudflare, Namecheap, ecc.):**
   - Aggiungi un record CNAME:
     - **Name/Host:** `api`
     - **Value/Target:** il valore fornito da Render (es. `tuoapp.onrender.com`)
     - **TTL:** Auto o 3600

3. **Attendi la propagazione DNS** (può richiedere fino a 24 ore, ma solitamente 5-30 minuti)

4. Le tue API saranno disponibili su:
   - `https://api.aresofficial.net/`
   - `https://api.aresofficial.net/name`
   - `https://api.aresofficial.net/status`
   - `https://api.aresofficial.net/data`

## 🔥 Configurazione Firebase

### 1. Ottieni le credenziali Firebase

1. Vai alla [Console Firebase](https://console.firebase.google.com/)
2. Seleziona il tuo progetto
3. Vai su **Impostazioni Progetto** (icona ingranaggio) → **Account di servizio**
4. Clicca su **Genera nuova chiave privata**
5. Scarica il file JSON

### 2. Configurazione per Produzione (Render)

Su Render, aggiungi queste variabili d'ambiente:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

**IMPORTANTE:** Copia la private key esattamente come appare nel file JSON, inclusi `\n` per le nuove righe.

### 3. Configurazione per Sviluppo Locale

**Opzione A:** Usa le variabili d'ambiente (come sopra) nel file `.env`

**Opzione B:** Usa il file JSON:
1. Rinomina il file scaricato in `serviceAccountKey.json`
2. Mettilo nella root del progetto
3. Aggiungi nel file `.env`:
```
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

⚠️ **NON committare mai il file `serviceAccountKey.json` su Git!** (È già nel `.gitignore`)

---

## 📦 Dipendenze

- **express** - Framework web
- **cors** - Gestione CORS
- **dotenv** - Gestione variabili d'ambiente
- **firebase-admin** - SDK Firebase per Node.js

## 📝 Licenza

ISC

