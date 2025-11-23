// get_users.js
const admin = require("firebase-admin");
const serviceAccount = require("./ares-b61cc-firebase-adminsdk-dj6ua-c78ef7e610.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function getUsers() {
  try {
    console.log("Recupero lista utenti...\n");
    
    let allUsers = [];
    let nextPageToken;

    // Firebase Admin SDK limita a 1000 utenti per pagina
    // Dobbiamo iterare per recuperare tutti gli utenti
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      
      allUsers = allUsers.concat(listUsersResult.users);
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    console.log(`✅ Trovati ${allUsers.length} utenti registrati\n`);
    console.log("=".repeat(100));
    
    // Ordina per data di registrazione (più recenti prima)
    allUsers.sort((a, b) => {
      const dateA = new Date(a.metadata.creationTime);
      const dateB = new Date(b.metadata.creationTime);
      return dateB - dateA;
    });

    // Stampa la lista degli utenti
    allUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. Utente:`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Email: ${user.email || "N/A"}`);
      console.log(`   Email verificata: ${user.emailVerified ? "Sì" : "No"}`);
      console.log(`   Nome: ${user.displayName || "N/A"}`);
      console.log(`   Data registrazione: ${new Date(user.metadata.creationTime).toLocaleString("it-IT")}`);
      console.log(`   Ultimo accesso: ${user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString("it-IT") : "Mai"}`);
      
      if (user.customClaims && Object.keys(user.customClaims).length > 0) {
        console.log(`   Custom Claims: ${JSON.stringify(user.customClaims)}`);
      }
      
      if (user.disabled) {
        console.log(`   ⚠️  Account disabilitato`);
      }
      
      console.log("-".repeat(100));
    });

    // Riepilogo
    console.log(`\n📊 Riepilogo:`);
    console.log(`   Totale utenti: ${allUsers.length}`);
    console.log(`   Email verificate: ${allUsers.filter(u => u.emailVerified).length}`);
    console.log(`   Email non verificate: ${allUsers.filter(u => !u.emailVerified).length}`);
    console.log(`   Account disabilitati: ${allUsers.filter(u => u.disabled).length}`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Errore nel recuperare gli utenti:", err);
    process.exit(1);
  }
}

getUsers();

