// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require("./services/firebase"); // Import Firestore instance
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:4173",
  "http://localhost:5173", // Local development origin
  "https://petconnect-is216.onrender.com", // Production origin
];

// Middleware to allow only specific origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Example route to test the server
app.get("/", (req, res) => {
  res.send("Firebase Backend is Running");
});

// Import Routes
const eventsRoutes = require("./routes/events");
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const messagesRoutes = require("./routes/messages"); // Import messages routes
const petsRoutes = require("./routes/pets");
const friendsRoutes = require("./routes/friends");
const calendarRoutes = require("./routes/calendar"); // Import calendar routes

// Use Routes
app.use("/api/events", eventsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes); // Mount users routes
app.use("/api/messages", messagesRoutes); // Mount messages routes
app.use("/api/pets", petsRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/calendar", calendarRoutes); // Mount calendar routes


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Test Firestore connection
const testFirestore = async () => {
  try {
    const testDocRef = db.collection("TestCollection4").doc("testDocument");
    await testDocRef.set({
      testField: "This is a test document",
    });
    console.log("Document written successfully");
  } catch (error) {
    console.error("Error writing document to Firestore:", error);
  }
};

// Call the function
testFirestore();