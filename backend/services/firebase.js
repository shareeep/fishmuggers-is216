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
});

const db = admin.firestore();

module.exports = { admin, db };
