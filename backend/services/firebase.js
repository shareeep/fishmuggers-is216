// services/firebase.js
const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

// Path to your service account key
const serviceAccountPath = path.resolve(
  __dirname,
  "../firebase/serviceAccountKey.json"
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`, // Add storage bucket
});

const db = admin.firestore();
const bucket = admin.storage().bucket(); // Initialize Firebase Storage bucket
const auth = admin.auth(); // Initialize Firebase Auth

module.exports = { admin, db, bucket, auth };
