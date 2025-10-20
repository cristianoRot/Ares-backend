# Guida al Deploy su Render

## Problema Risolto

Il crash durante il deploy era causato da:
1. ❌ Variabili d'ambiente Firebase non configurate su Render
2. ❌ Bug nel codice che crashava anche quando Firebase non era configurato

Il bug nel codice è stato risolto. Ora devi configurare le variabili d'ambiente su Render.

---

## Configurazione Variabili d'Ambiente su Render

### Step 1: Accedi a Render Dashboard
1. Vai su [https://dashboard.render.com](https://dashboard.render.com)
2. Seleziona il tuo servizio **Ares-backend**

### Step 2: Vai alle Environment Variables
1. Nel menu laterale, clicca su **"Environment"**
2. Oppure vai alla tab **"Environment"** nelle impostazioni del servizio

### Step 3: Aggiungi le seguenti variabili

Clicca su **"Add Environment Variable"** e aggiungi una per una:

#### Variabili Firebase (OBBLIGATORIE)

**1. FIREBASE_PROJECT_ID**
```
Key: FIREBASE_PROJECT_ID
Value: il-tuo-project-id
```

**2. FIREBASE_CLIENT_EMAIL**
```
Key: FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-xxxxx@il-tuo-project.iam.gserviceaccount.com
```

**3. FIREBASE_PRIVATE_KEY**
```
Key: FIREBASE_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAA...\n-----END PRIVATE KEY-----\n
```
⚠️ **IMPORTANTE:** La chiave privata deve includere i `\n` (newline) come caratteri letterali, non come a capo reali.

#### Variabili Server (OPZIONALI)

**4. PORT**
```
Key: PORT
Value: 3000
```
(Render imposta automaticamente PORT, ma puoi sovrascriverla)

**5. NODE_ENV**
```
Key: NODE_ENV
Value: production
```

**6. CORS_ORIGIN**
```
Key: CORS_ORIGIN
Value: *
```
(Oppure specifica il dominio del tuo frontend, es: `https://tuo-frontend.com`)

**7. BASE_URL**
```
Key: BASE_URL
Value: https://ares-backend.onrender.com
```
(Sostituisci con il tuo URL effettivo di Render)

---

## Come Ottenere le Credenziali Firebase

### Metodo 1: Dalla Console Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com)
2. Seleziona il tuo progetto
3. Vai su **Project Settings** (⚙️ in alto a sinistra)
4. Vai alla tab **Service Accounts**
5. Clicca su **"Generate new private key"**
6. Scarica il file JSON

### Metodo 2: Dal file serviceAccountKey.json

Se hai già il file `serviceAccountKey.json`, apri il file e trova:

```json
{
  "type": "service_account",
  "project_id": "questo-è-il-FIREBASE_PROJECT_ID",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nQuesta-è-la-FIREBASE_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "questo-è-il-FIREBASE_CLIENT_EMAIL",
  "client_id": "...",
  ...
}
```

### Formattare la Private Key per Render

La `FIREBASE_PRIVATE_KEY` deve essere formattata correttamente:

**❌ SBAGLIATO (non usare a capo reali):**
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0B...
...
-----END PRIVATE KEY-----
```

**✅ CORRETTO (usa \n come testo):**
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0B...\n...\n-----END PRIVATE KEY-----\n
```

**Script per convertire (opzionale):**
```bash
# Se hai il file serviceAccountKey.json
node -e "console.log(JSON.stringify(require('./serviceAccountKey.json').private_key))"
```

---

## Step 4: Salva e Rideploy

1. Dopo aver aggiunto tutte le variabili, clicca su **"Save Changes"**
2. Render farà automaticamente un nuovo deploy
3. Controlla i log per verificare che Firebase sia connesso

**Log di successo:**
```
✅ Firebase inizializzato con variabili d'ambiente
========================================
🚀 Ares Backend API
========================================
📡 Server:        http://localhost:3000
🌍 Ambiente:      production
🔥 Firebase:      ✅ Connesso
...
```

---

## Verificare il Deploy

### 1. Controlla i log su Render
Nel tuo servizio su Render, vai alla tab **"Logs"** e verifica che non ci siano errori.

### 2. Testa l'endpoint di benvenuto
```bash
curl https://ares-backend.onrender.com/
```

Dovresti ricevere:
```json
{
  "message": "Benvenuto all'API di Ares",
  "version": "2.0.0",
  "firebaseStatus": "✅ connected",
  ...
}
```

### 3. Testa la registrazione utente
```bash
curl -X POST https://ares-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testplayer"
  }'
```

---

## Troubleshooting

### Errore: "Firebase non configurato"
- ✅ Verifica di aver aggiunto tutte e 3 le variabili Firebase
- ✅ Controlla che i valori siano corretti (copia-incolla dal JSON)
- ✅ Assicurati che la PRIVATE_KEY abbia i `\n` come testo

### Errore: "Invalid private key"
- ✅ La chiave privata deve includere `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`
- ✅ I newline devono essere `\n` (due caratteri: backslash e n), non a capo reali
- ✅ La chiave deve essere racchiusa tra virgolette se contiene spazi

### Errore: "Permission denied" o "Insufficient permissions"
- ✅ Verifica che il Service Account abbia i permessi corretti in Firebase
- ✅ Nel Firebase Console, vai su IAM & Admin e verifica i ruoli

### L'app si avvia ma Firebase non è connesso
- ✅ Controlla i log per messaggi di errore dettagliati
- ✅ Verifica che il PROJECT_ID corrisponda al tuo progetto Firebase
- ✅ Verifica che il CLIENT_EMAIL sia del tipo `firebase-adminsdk-...@...iam.gserviceaccount.com`

---

## Alternative: Usare Render Secrets

Se preferisci non inserire le credenziali manualmente, puoi usare Render Secrets:

1. Vai su **Settings** > **Secret Files**
2. Crea un file `serviceAccountKey.json` con il contenuto del tuo file Firebase
3. Aggiungi la variabile d'ambiente:
   ```
   Key: FIREBASE_SERVICE_ACCOUNT_PATH
   Value: /etc/secrets/serviceAccountKey.json
   ```

Il codice supporta già questa opzione!

---

## Sicurezza

⚠️ **IMPORTANTE:**
- ❌ NON committare MAI le credenziali Firebase nel repository
- ❌ NON condividere le credenziali pubblicamente
- ✅ Usa sempre le variabili d'ambiente
- ✅ Mantieni il file `.env` in `.gitignore`
- ✅ Rigenera le chiavi se esposte accidentalmente

---

## Prossimi Step

Dopo il deploy di successo:
1. ✅ Testa tutti gli endpoint
2. ✅ Configura un dominio custom (opzionale)
3. ✅ Imposta il monitoraggio
4. ✅ Configura gli alert per downtime
5. ✅ Aggiorna il CORS_ORIGIN con il dominio del frontend

---

**Creato:** 20 Ottobre 2025  
**Ultima modifica:** 20 Ottobre 2025

