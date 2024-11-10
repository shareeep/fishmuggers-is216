// services/firebase.js
const admin = require("firebase-admin");
require("dotenv").config();

// Ensure SERVICE_ACCOUNT_KEY is set
if (!process.env.SERVICE_ACCOUNT_KEY) {
  throw new Error("SERVICE_ACCOUNT_KEY environment variable is not set.");
}

// Decode the Base64-encoded service account key from environment variable
const serviceAccountKeyBase64 = process.env.SERVICE_ACCOUNT_KEY;
const serviceAccountKeyJson = Buffer.from(
  serviceAccountKeyBase64,
  "base64"
).toString("utf8");

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountKeyJson);
} catch (error) {
  console.error("Failed to parse SERVICE_ACCOUNT_KEY:", error);
  throw error;
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`, // Ensure FIREBASE_PROJECT_ID is set
});

const db = admin.firestore();
const bucket = admin.storage().bucket(); // Initialize Firebase Storage bucket
const auth = admin.auth(); // Initialize Firebase Auth

module.exports = { admin, db, bucket, auth };
