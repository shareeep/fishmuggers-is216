// routes/events.js
const express = require("express");
const router = express.Router();
const { db } = require("../services/firebase"); // Correctly import Firestore instance
const { body, validationResult } = require("express-validator");
// --------------------
// Helper Functions
// --------------------

// Function to validate event data
const validateEventData = (data) => {
  const { host, title, date, locationId, petType, eventSize } = data;
  if (!host || !title || !date || !locationId || !petType || !eventSize) {
    return false;
  }
  return true;
};

// --------------------
// Routes
// --------------------

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get("/", async (req, res) => {
  try {
    const eventsSnapshot = await db.collection("events").get();
    const events = [];
    eventsSnapshot.forEach((doc) => {
      events.push({ eventId: doc.id, ...doc.data() });
    });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// @route   GET /api/events/:id
// @desc    Get a single event by ID
// @access  Public
router.get("/:id", async (req, res) => {
  const eventId = req.params.id;

  try {
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ eventId: eventDoc.id, ...eventDoc.data() });
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Public
// router.post("/", async (req, res) => {
//   const { host, title, date, locationId, petType, eventSize } = req.body;

//   // Validate incoming data
//   if (!validateEventData(req.body)) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   // Construct the new event object
//   const newEvent = {
//     host,
//     title,
//     date: new Date(date), // Ensure date is stored as a Timestamp
//     locationId,
//     petType,
//     eventSize,
//     interestedUsers: [], // Initialize as empty array
//   };

//   try {
//     const eventRef = await db.collection("events").add(newEvent);
//     console.log(`New event added with ID: ${eventRef.id}`);
//     res.status(201).json({ eventId: eventRef.id, ...newEvent });
//   } catch (error) {
//     console.error("Error creating event:", error);
//     res.status(500).json({ error: "Failed to create event" });
//   }
// });
router.post(
  "/",
  [
    body("host").notEmpty().withMessage("Host is required"),
    body("title").notEmpty().withMessage("Title is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("locationId").notEmpty().withMessage("Location ID is required"),
    body("petType").notEmpty().withMessage("Pet type is required"),
    body("eventSize").notEmpty().withMessage("Event size is required"),
  ],
  async (req, res) => {
    // Validate request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { host, title, date, locationId, petType, eventSize } = req.body;

    // Construct the new event object
    const newEvent = {
      host,
      title,
      date: new Date(date), // Ensure date is stored as a Timestamp
      locationId,
      petType,
      eventSize,
      interestedUsers: [], // Initialize as empty array
    };

    try {
      const eventRef = await db.collection("events").add(newEvent);
      console.log(`New event added with ID: ${eventRef.id}`);
      res.status(201).json({ eventId: eventRef.id, ...newEvent });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  }
);

// @route   PUT /api/events/:id
// @desc    Update an existing event by ID
// @access  Public
router.put("/:id", async (req, res) => {
  const eventId = req.params.id;
  const updatedData = req.body;

  // Optional: Add validation for updatedData if necessary

  // If updating the date, ensure it's converted to a Date object
  if (updatedData.date) {
    updatedData.date = new Date(updatedData.date);
  }

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    await eventRef.update(updatedData);
    const updatedEvent = await eventRef.get();

    res.status(200).json({ eventId: updatedEvent.id, ...updatedEvent.data() });
  } catch (error) {
    console.error(`Error updating event with ID ${eventId}:`, error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event by ID
// @access  Public
router.delete("/:id", async (req, res) => {
  const eventId = req.params.id;

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    await eventRef.delete();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(`Error deleting event with ID ${eventId}:`, error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// --------------------
// Additional Routes
// --------------------

// @route   POST /api/events/:id/interested
// @desc    Add a user to interestedUsers array
// @access  Public
router.post("/:id/interested", async (req, res) => {
  const eventId = req.params.id;
  const { userId, displayName, profileImage } = req.body;

  if (!userId || !displayName) {
    return res.status(400).json({ error: "Missing required user information" });
  }

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the user is already interested
    const interestedUsers = eventDoc.data().interestedUsers || [];
    const userExists = interestedUsers.some((user) => user.userId === userId);

    if (userExists) {
      return res
        .status(400)
        .json({ error: "User already interested in this event" });
    }

    // Add the user to interestedUsers array
    await eventRef.update({
      interestedUsers: admin.firestore.FieldValue.arrayUnion({
        userId,
        displayName,
        profileImage,
      }),
    });

    res.status(200).json({ message: "User added to interestedUsers" });
  } catch (error) {
    console.error(`Error adding interested user to event ${eventId}:`, error);
    res.status(500).json({ error: "Failed to add interested user" });
  }
});

// @route   DELETE /api/events/:id/interested/:userId
// @desc    Remove a user from interestedUsers array
// @access  Public
router.delete("/:id/interested/:userId", async (req, res) => {
  const eventId = req.params.id;
  const userId = req.params.userId;

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const interestedUsers = eventDoc.data().interestedUsers || [];
    const userToRemove = interestedUsers.find((user) => user.userId === userId);

    if (!userToRemove) {
      return res
        .status(400)
        .json({ error: "User not found in interestedUsers" });
    }

    // Remove the user from interestedUsers array
    await eventRef.update({
      interestedUsers: admin.firestore.FieldValue.arrayRemove(userToRemove),
    });

    res.status(200).json({ message: "User removed from interestedUsers" });
  } catch (error) {
    console.error(
      `Error removing interested user from event ${eventId}:`,
      error
    );
    res.status(500).json({ error: "Failed to remove interested user" });
  }
});

module.exports = router;
