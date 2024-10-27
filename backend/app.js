// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require("./services/firebase"); // Import Firestore instance
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
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
const petsRoutes = require("./routes/pets")
const friendsRoutes = require("./routes/friends")


// Use Routes
app.use("/api/events", eventsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes); 
app.use("/api/pets", petsRoutes);
app.use("/api/friends", friendsRoutes); 

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