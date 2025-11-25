// setAdmin.js
const admin = require("firebase-admin");
const readline = require("readline");
require('dotenv').config();

// Initialize Firebase Admin SDK using environment variables
if (process.env.FIREBASE_PROJECT_ID) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  console.error("Error: Firebase credentials not found.");
  console.error("Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env");
  console.error("Or set FIREBASE_SERVICE_ACCOUNT_PATH to point to service account JSON file");
  process.exit(1);
}

// Function to read user input
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
    // 1) Ask for user email
    const email = await askQuestion("Enter user email: ");
    
    if (!email || !email.trim()) {
      console.error("Invalid email");
      process.exit(1);
    }

    // 2) Ask for admin value
    const adminValueInput = await askQuestion("Enter admin value (true/false): ");
    const adminValue = adminValueInput.toLowerCase().trim() === "true";

    // 3) Find user by email
    const user = await admin.auth().getUserByEmail(email.trim());

    console.log("Found user:", user.uid, user.email);

    // 4) Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, { admin: adminValue });

    console.log(`User ${user.email} now has admin: ${adminValue}`);

    // Note: client must call getIdToken(true) to see the new claim
    console.log("Note: client must call getIdToken(true) to see the new claim.");
    process.exit(0);
  } catch (err) {
    console.error("Error setting admin:", err);
    process.exit(1);
  }
}

setAdmin();
