// app.js
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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Example route to test the server
app.get("/", (req, res) => {
  res.send("Firebase Backend is Running");
});

// Import Routes
const eventsRoutes = require("./routes/events");
// Import other routes as needed

// Use Routes
app.use("/api/events", eventsRoutes);
// Use other routes similarly

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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
