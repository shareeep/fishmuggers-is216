// routes/events.js
const express = require("express");
const router = express.Router();
const { db } = require("../services/firebase"); // Correctly import Firestore instance
const admin = require("firebase-admin"); // Import Firebase Admin SDK
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

    const eventData = eventDoc.data();

    // Convert Firestore Timestamps to ISO strings
    if (eventData.createdAt && eventData.createdAt.toDate) {
      eventData.createdAt = eventData.createdAt.toDate().toISOString();
    }

    if (eventData.updatedAt && eventData.updatedAt.toDate) {
      eventData.updatedAt = eventData.updatedAt.toDate().toISOString();
    }

    res.status(200).json({ eventId: eventDoc.id, ...eventData });
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Public
router.post("/", async (req, res) => {
  const { host, title, date, locationId, petType, eventSize } = req.body;

  // Validate incoming data
  if (!validateEventData(req.body)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Generate a new document reference with a unique ID
    const eventRef = db.collection("events").doc();
    const eventId = eventRef.id;

    // Construct the new event object with eventId included
    const newEvent = {
      eventId, // Include the unique event ID
      host,
      title,
      date: new Date(date), // Ensure date is stored as a Date object
      locationId,
      petType,
      eventSize,
      interestedUsers: [], // Initialize as empty array
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Add a creation timestamp
      updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Add an updated timestamp
    };

    // Set the document with the new event data
    await eventRef.set(newEvent);

    console.log(`New event added with ID: ${eventId}`);

    // Retrieve the newly created event to get the actual `createdAt` and `updatedAt` values
    const createdEventDoc = await eventRef.get();
    if (!createdEventDoc.exists) {
      // This should rarely happen, but it's good to handle it
      return res
        .status(500)
        .json({ error: "Failed to retrieve the created event" });
    }

    const createdEventData = createdEventDoc.data();

    // Convert Firestore Timestamp to ISO string if they exist
    if (createdEventData.createdAt && createdEventData.createdAt.toDate) {
      createdEventData.createdAt = createdEventData.createdAt
        .toDate()
        .toISOString();
    }

    if (createdEventData.updatedAt && createdEventData.updatedAt.toDate) {
      createdEventData.updatedAt = createdEventData.updatedAt
        .toDate()
        .toISOString();
    }

    res.status(201).json({ eventId: createdEventDoc.id, ...createdEventData });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

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

  // Update the updatedAt timestamp
  updatedData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    await eventRef.update(updatedData);
    const updatedEvent = await eventRef.get();

    const updatedEventData = updatedEvent.data();

    // Convert Firestore Timestamps to ISO strings
    if (updatedEventData.createdAt && updatedEventData.createdAt.toDate) {
      updatedEventData.createdAt = updatedEventData.createdAt
        .toDate()
        .toISOString();
    }

    if (updatedEventData.updatedAt && updatedEventData.updatedAt.toDate) {
      updatedEventData.updatedAt = updatedEventData.updatedAt
        .toDate()
        .toISOString();
    }

    res.status(200).json({ eventId: updatedEvent.id, ...updatedEventData });
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
      updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Update the updatedAt timestamp
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
      updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Update the updatedAt timestamp
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
