// setAdmin.js
const admin = require("firebase-admin");
const readline = require("readline");
const serviceAccount = require("./ares-b61cc-firebase-adminsdk-dj6ua-c78ef7e610.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Funzione per leggere input dall'utente
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function setAdmin() {
  try {
    // 1) Chiedi l'email all'utente
    const email = await askQuestion("Inserisci l'email dell'utente: ");
    
    if (!email || !email.trim()) {
      console.error("❌ Email non valida");
      process.exit(1);
    }

    // 2) Chiedi il valore admin
    const adminValueInput = await askQuestion("Inserisci il valore admin (true/false): ");
    const adminValue = adminValueInput.toLowerCase().trim() === "true";

    // 3) Trova l'utente per email
    const user = await admin.auth().getUserByEmail(email.trim());

    console.log("Trovato utente:", user.uid, user.email);

    // 4) Imposta le custom claims
    await admin.auth().setCustomUserClaims(user.uid, { admin: adminValue });

    console.log(`✅ Utente ${user.email} ora ha admin: ${adminValue}`);

    // Suggerimento: invalida il token lato client dopo
    console.log("Ricorda: il client deve fare getIdToken(true) per vedere la nuova claim.");
    process.exit(0);
  } catch (err) {
    console.error("Errore nel settare admin:", err);
    process.exit(1);
  }
}

setAdmin();