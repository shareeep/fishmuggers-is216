const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');  // Add CORS package

// Load the service account key
const serviceAccount = require('./firebase/serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<your-project-id>.firebaseio.com',  // Replace with your project URL
});

const app = express();

// Use CORS middleware to allow frontend communication
app.use(cors({
  origin: 'http://localhost:5173',  // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these methods
  credentials: true  // Enable credentials if needed
}));

// Parse incoming JSON requests
app.use(bodyParser.json());

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Example route to test the server
app.get('/', (req, res) => {
  res.send('Firebase Backend is Running');
});

// User Registration Route
app.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: displayName || email.split('@')[0],  // Optional displayName
    });
    res.status(201).send({ message: 'User created successfully', user: userRecord });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(400).send({ error: error.message });
  }
});
