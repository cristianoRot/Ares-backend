# 🔥 Guida Rapida: Configurazione Firebase

## 📝 Passaggi per configurare Firebase su Render.com

### 1️⃣ Ottieni le credenziali Firebase

1. Vai su https://console.firebase.google.com/
2. Seleziona il tuo progetto
3. Clicca sull'icona **⚙️ Impostazioni** → **Impostazioni progetto**
4. Vai alla tab **Account di servizio**
5. Clicca su **Genera nuova chiave privata**
6. Scarica il file JSON

### 2️⃣ Configura le variabili d'ambiente su Render

1. Vai su [Render Dashboard](https://dashboard.render.com/)
2. Seleziona il tuo servizio **ares-backend**
3. Vai su **Environment**
4. Aggiungi queste 3 variabili:

#### Variable 1: FIREBASE_PROJECT_ID
```
Key: FIREBASE_PROJECT_ID
Value: [copia il valore di "project_id" dal file JSON]
```

#### Variable 2: FIREBASE_CLIENT_EMAIL
```
Key: FIREBASE_CLIENT_EMAIL
Value: [copia il valore di "client_email" dal file JSON]
```

#### Variable 3: FIREBASE_PRIVATE_KEY
```
Key: FIREBASE_PRIVATE_KEY
Value: [copia il valore di "private_key" dal file JSON - TUTTO, inclusi -----BEGIN PRIVATE KEY----- e -----END PRIVATE KEY-----]
```

**⚠️ IMPORTANTE:** 
- Copia la `private_key` esattamente come appare nel JSON
- Deve includere i caratteri `\n` per le nuove righe
- Deve essere racchiusa tra virgolette se contiene spazi o caratteri speciali

### 3️⃣ Salva e Rideploy

1. Clicca su **Save Changes**
2. Render farà automaticamente un nuovo deploy
3. Attendi che il deploy sia completato

### 4️⃣ Verifica che funzioni

Vai su:
```
https://api.aresofficial.net/
```

Se Firebase è configurato correttamente, vedrai:
```json
{
  "message": "Benvenuto all'API di Ares",
  "firebaseStatus": "connected"
}
```

Se NON è configurato, vedrai:
```json
{
  "firebaseStatus": "not configured"
}
```

---

## 🧪 Test degli endpoint Firebase

### Crea un documento
```bash
curl -X POST https://api.aresofficial.net/collection/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Mario","email":"mario@example.com"}'
```

### Ottieni tutti i documenti
```bash
curl https://api.aresofficial.net/collection/users
```

### Ottieni un singolo documento
```bash
curl https://api.aresofficial.net/collection/users/{documentId}
```

### Aggiorna un documento
```bash
curl -X PUT https://api.aresofficial.net/collection/users/{documentId} \
  -H "Content-Type: application/json" \
  -d '{"name":"Mario Rossi"}'
```

### Elimina un documento
```bash
curl -X DELETE https://api.aresofficial.net/collection/users/{documentId}
```

---

## 🛡️ Sicurezza

⚠️ **NON condividere MAI le credenziali Firebase!**
- Il file JSON contiene credenziali sensibili
- Non committare mai il file su Git (è già nel .gitignore)
- Le variabili d'ambiente su Render sono sicure e criptate

---

## 🔍 Troubleshooting

### Errore: "Database non disponibile"
- Verifica che le 3 variabili d'ambiente siano configurate correttamente su Render
- Controlla i logs su Render per vedere eventuali errori di inizializzazione

### Errore: "Permission denied"
- Verifica le regole di sicurezza su Firebase Console
- Assicurati che il service account abbia i permessi necessari

### Firebase non si connette
- Verifica che la `private_key` sia stata copiata correttamente (con tutti i `\n`)
- Controlla che `project_id` e `client_email` corrispondano al tuo progetto Firebase

---

## 📚 Risorse utili

- [Firebase Console](https://console.firebase.google.com/)
- [Render Dashboard](https://dashboard.render.com/)
- [Documentazione Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

