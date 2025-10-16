# Ares Backend

Un backend semplice costruito con Node.js ed Express per gestire API REST.

## 🚀 Caratteristiche

- Server Express configurato
- CORS abilitato
- Gestione JSON
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

## 📦 Dipendenze

- **express** - Framework web
- **cors** - Gestione CORS
- **dotenv** - Gestione variabili d'ambiente

## 📝 Licenza

ISC

