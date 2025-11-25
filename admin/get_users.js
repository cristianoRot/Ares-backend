// get_users.js
const admin = require("firebase-admin");
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

async function getUsers() {
  try {
    console.log("Retrieving user list...\n");
    
    let allUsers = [];
    let nextPageToken;

    // Firebase Admin SDK limits to 1000 users per page
    // We need to iterate to get all users
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      allUsers = allUsers.concat(listUsersResult.users);
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    console.log(`Found ${allUsers.length} registered users\n`);
    console.log("=".repeat(100));
    
    // Sort by registration date (newest first)
    allUsers.sort((a, b) => {
      const dateA = new Date(a.metadata.creationTime);
      const dateB = new Date(b.metadata.creationTime);
      return dateB - dateA;
    });

    // Print user list
    allUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. User:`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Email: ${user.email || "N/A"}`);
      console.log(`   Email verified: ${user.emailVerified ? "Yes" : "No"}`);
      console.log(`   Display Name: ${user.displayName || "N/A"}`);
      console.log(`   Registration date: ${new Date(user.metadata.creationTime).toLocaleString()}`);
      console.log(`   Last sign in: ${user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : "Never"}`);
      
      if (user.customClaims && Object.keys(user.customClaims).length > 0) {
        console.log(`   Custom Claims: ${JSON.stringify(user.customClaims)}`);
      }
      
      if (user.disabled) {
        console.log(`   Account disabled`);
      }
      
      console.log("-".repeat(100));
    });

    // Summary
    console.log(`\nSummary:`);
    console.log(`   Total users: ${allUsers.length}`);
    console.log(`   Email verified: ${allUsers.filter(u => u.emailVerified).length}`);
    console.log(`   Email not verified: ${allUsers.filter(u => !u.emailVerified).length}`);
    console.log(`   Disabled accounts: ${allUsers.filter(u => u.disabled).length}`);
    
    process.exit(0);
  } catch (err) {
    console.error("Error retrieving users:", err);
    process.exit(1);
  }
}

getUsers();
