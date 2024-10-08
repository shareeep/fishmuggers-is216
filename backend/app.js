const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require("./services/firebase"); // Import Firestore instance

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
// Import other routes as needed

// Use Routes
app.use("/api/events", eventsRoutes);
app.use("/api/posts", postsRoutes);
// Use other routes similarly

// Remove the duplicate app.listen call
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Test Firestore connection
const testFirestore = async () => {
  try {
    const testDocRef = db.collection("TestCollection3").doc("testDocument");
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
