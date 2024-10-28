// routes/events.js

const express = require("express");
const router = express.Router();
const { db, auth, bucket } = require("../services/firebase");
const admin = require("firebase-admin");
const { body, validationResult } = require("express-validator");
const authenticate = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");

// --------------------
// Helper Functions
// --------------------

// Function to validate event data using express-validator
const validateEventData = [
  body("title")
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 100 })
    .withMessage("Title can be at most 100 characters long."),

  body("description")
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ max: 1000 })
    .withMessage("Description can be at most 1000 characters long."),

  body("date")
    .notEmpty()
    .withMessage("Date is required.")
    .isISO8601()
    .withMessage("Date must be a valid ISO8601 date."),

  body("location")
    .notEmpty()
    .withMessage("Location is required.")
    .isString()
    .withMessage("Location must be a string."),

  body("locationData")
    .notEmpty()
    .withMessage("Location data is required.")
    .custom((value) => {
      let locationData;
      try {
        locationData = JSON.parse(value);
      } catch (error) {
        throw new Error("locationData must be a valid JSON array.");
      }
      if (
        !Array.isArray(locationData) ||
        locationData.length !== 2 ||
        typeof locationData[0] !== "number" ||
        typeof locationData[1] !== "number"
      ) {
        throw new Error(
          "locationData must be an array of [latitude, longitude]."
        );
      }
      return true;
    }),

  body("petType")
    .customSanitizer((value) => {
      // Ensure petType is always an array
      if (typeof value === "string") {
        return [value];
      }
      return value;
    })
    .isArray({ min: 1 })
    .withMessage("Pet Type must be an array with at least one type."),

  body("eventSize")
    .notEmpty()
    .withMessage("Event Size is required.")
    .isInt({ min: 1 })
    .withMessage("Event Size must be a number greater than 0."),
  
  // Optional: Validate image URL if provided as a string
  body("eventImage")
    .optional()
    .isURL()
    .withMessage("Event Image must be a valid URL."),
];

// Helper function to fetch user details given an array of UIDs
const fetchUsersDetails = async (uids) => {
  if (uids.length === 0) return {};

  // Firestore 'in' queries can handle up to 10 elements
  const batches = [];
  while (uids.length > 0) {
    const batch = uids.splice(0, 10);
    batches.push(
      db
        .collection("users")
        .where(admin.firestore.FieldPath.documentId(), "in", batch)
        .get()
    );
  }

  const results = await Promise.all(batches);
  const users = {};
  results.forEach((snapshot) => {
    snapshot.forEach((doc) => {
      users[doc.id] = doc.data();
    });
  });

  return users;
};

// --------------------
// Routes
// --------------------

// @route   GET /api/events
// @desc    Get all events with host details
// @access  Public
router.get("/", async (req, res) => {
  try {
    const eventsSnapshot = await db
      .collection("events")
      .orderBy("createdAt", "desc")
      .get();
    const events = [];
    const hostUids = new Set();

    eventsSnapshot.forEach((doc) => {
      const event = { eventId: doc.id, ...doc.data() };

      // Convert Firestore Timestamps to ISO strings
      if (event.date && event.date.toDate) {
        event.date = event.date.toDate().toISOString();
      }
      if (event.createdAt && event.createdAt.toDate) {
        event.createdAt = event.createdAt.toDate().toISOString();
      }
      if (event.updatedAt && event.updatedAt.toDate) {
        event.updatedAt = event.updatedAt.toDate().toISOString();
      }

      events.push(event);
      if (event.host) {
        hostUids.add(event.host);
      }
    });

    const uniqueHostUids = Array.from(hostUids);
    const users = await fetchUsersDetails(uniqueHostUids);

    // Embed host details into each event
    const eventsWithHostDetails = events.map((event) => {
      const hostDetails = users[event.host] || {};
      return {
        ...event,
        host: {
          uid: event.host,
          username: hostDetails.username || "Unknown",
          profilePic:
            hostDetails.profileImage || "https://via.placeholder.com/50",
        },
      };
    });

    res.status(200).json(eventsWithHostDetails);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// @route   GET /api/events/:id
// @desc    Get a single event by ID with host details
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
    if (eventData.date && eventData.date.toDate) {
      eventData.date = eventData.date.toDate().toISOString();
    }
    if (eventData.createdAt && eventData.createdAt.toDate) {
      eventData.createdAt = eventData.createdAt.toDate().toISOString();
    }
    if (eventData.updatedAt && eventData.updatedAt.toDate) {
      eventData.updatedAt = eventData.updatedAt.toDate().toISOString();
    }

    // Fetch host details
    let hostDetails = {};
    if (eventData.host) {
      const userDoc = await db.collection("users").doc(eventData.host).get();
      if (userDoc.exists) {
        hostDetails = userDoc.data();
      }
    }

    // Embed host details
    const eventWithHostDetails = {
      eventId: eventDoc.id,
      ...eventData,
      host: {
        uid: eventData.host,
        username: hostDetails.username || "Unknown",
        profilePic:
          hostDetails.profileImage || "https://via.placeholder.com/50",
      },
    };

    res.status(200).json(eventWithHostDetails);
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post(
  "/",
  authenticate,
  upload.single("eventImage"),
  validateEventData,
  async (req, res) => {
    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let {
      title,
      description,
      date,
      location,
      locationData,
      petType,
      eventSize,
    } = req.body;

    // Parse eventSize to integer
    eventSize = parseInt(eventSize, 10);

    // Parse locationData
    locationData = JSON.parse(locationData);

    // Ensure petType is always an array
    petType = Array.isArray(petType) ? petType : [petType];

    try {
      // Handle image upload if provided
      let imageUrl = "https://via.placeholder.com/800x400"; // Default image
      if (req.file) {
        const fileName = `eventImages/${req.user.uid}_${Date.now()}_${
          req.file.originalname
        }`;
        const file = bucket.file(fileName);

        await file.save(req.file.buffer, {
          metadata: {
            contentType: req.file.mimetype,
          },
        });

        // Make the file public
        await file.makePublic();

        // Get the public URL
        imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      }

      // Generate a new document reference with a unique ID
      const eventRef = db.collection("events").doc();
      const eventId = eventRef.id;

      // Construct the new event object with eventId included
      const newEvent = {
        eventId, // Include the unique event ID
        host: req.user.uid, // Set host as the authenticated user's UID
        title,
        description,
        date: admin.firestore.Timestamp.fromDate(new Date(date)), // Firestore Timestamp for date
        location,
        locationData: JSON.parse(locationData),
        petType: Array.isArray(petType) ? petType : [petType],
        eventSize, // Store event size as an integer
        eventImage: imageUrl,
        interestedUsers: [], // Initialize as empty array
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Use a Firestore transaction to ensure atomicity
      await db.runTransaction(async (transaction) => {
        // Create the event document
        transaction.set(eventRef, newEvent);

        // Update the user's hostingEvents and joinedEvents arrays
        const userRef = db.collection("users").doc(req.user.uid);
        transaction.update(userRef, {
          hostingEvents: admin.firestore.FieldValue.arrayUnion(eventId),
          joinedEvents: admin.firestore.FieldValue.arrayUnion(eventId), // Auto add as joined event
        });
      });

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

      // Convert Firestore Timestamps to ISO strings
      if (createdEventData.date && createdEventData.date.toDate) {
        createdEventData.date = createdEventData.date.toDate().toISOString();
      }
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

      res.status(201).json({
        eventId: createdEventDoc.id,
        ...createdEventData,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  }
);

// @route   PUT /api/events/:id
// @desc    Update an existing event by ID
// @access  Private
router.put(
  "/:id",
  authenticate,
  upload.single("eventImage"),
  validateEventData,
  async (req, res) => {
    const eventId = req.params.id;
    let {
      title,
      description,
      date,
      location,
      locationData,
      petType,
      eventSize,
    } = req.body;

    // Parse eventSize to integer
    eventSize = parseInt(eventSize, 10);

    // Parse locationData
    locationData = JSON.parse(locationData);

    // Ensure petType is always an array
    petType = Array.isArray(petType) ? petType : [petType];

    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const eventRef = db.collection("events").doc(eventId);
      const eventDoc = await eventRef.get();

      if (!eventDoc.exists) {
        return res.status(404).json({ error: "Event not found" });
      }

      const eventData = eventDoc.data();

      // Ensure the requesting user is the host
      if (eventData.host !== req.user.uid) {
        return res
          .status(403)
          .json({ error: "Forbidden. You are not the host of this event." });
      }

      // Handle image upload if provided
      let imageUrl =
        eventData.eventImage || "https://via.placeholder.com/800x400";
      if (req.file) {
        const fileName = `eventImages/${req.user.uid}_${Date.now()}_${
          req.file.originalname
        }`;
        const file = bucket.file(fileName);

        await file.save(req.file.buffer, {
          metadata: {
            contentType: req.file.mimetype,
          },
        });

        // Make the file public
        await file.makePublic();

        // Get the public URL
        imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      }

      // Prepare updated data
      const updatedData = {
        title,
        description,
        date: admin.firestore.Timestamp.fromDate(new Date(date)), // Ensure date is stored as a Firestore Timestamp
        location,
        locationData,
        petType,
        eventSize,
        eventImage: imageUrl,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Update the updatedAt timestamp
      };

      // Update the event document
      await eventRef.update(updatedData);

      const updatedEvent = await eventRef.get();
      const updatedEventData = updatedEvent.data();

      // Convert Firestore Timestamps to ISO strings
      if (updatedEventData.date && updatedEventData.date.toDate) {
        updatedEventData.date = updatedEventData.date.toDate().toISOString();
      }
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

      res.status(200).json({
        eventId: updatedEvent.id,
        ...updatedEventData,
      });
    } catch (error) {
      console.error(`Error updating event with ID ${eventId}:`, error);
      res.status(500).json({ error: "Failed to update event" });
    }
  }
);

// @route   DELETE /api/events/:id
// @desc    Delete an event by ID
// @access  Private
router.delete("/:id", authenticate, async (req, res) => {
  const eventId = req.params.id;

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventData = eventDoc.data();

    // Ensure the requesting user is the host
    if (eventData.host !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "Forbidden. You are not the host of this event." });
    }

    // Use a Firestore transaction to ensure atomicity
    await db.runTransaction(async (transaction) => {
      // Delete the event document
      transaction.delete(eventRef);

      // Remove eventId from host's hostingEvents and joinedEvents arrays
      const userRef = db.collection("users").doc(req.user.uid);
      transaction.update(userRef, {
        hostingEvents: admin.firestore.FieldValue.arrayRemove(eventId),
        joinedEvents: admin.firestore.FieldValue.arrayRemove(eventId),
      });

      // Remove eventId from all users' joinedEvents arrays who had joined
      if (eventData.interestedUsers && eventData.interestedUsers.length > 0) {
        const batchSize = 10; // Firestore limits 'in' queries to 10
        for (let i = 0; i < eventData.interestedUsers.length; i += batchSize) {
          const batch = eventData.interestedUsers.slice(i, i + batchSize);
          const userIds = batch.map((user) => user.userId);
          const usersSnapshot = await db
            .collection("users")
            .where(admin.firestore.FieldPath.documentId(), "in", userIds)
            .get();
          usersSnapshot.forEach((userDoc) => {
            transaction.update(userDoc.ref, {
              joinedEvents: admin.firestore.FieldValue.arrayRemove(eventId),
            });
          });
        }
      }
    });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(`Error deleting event with ID ${eventId}:`, error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// @route   POST /api/events/:id/interested
// @desc    Add a user to interestedUsers array and add eventId to user's joinedEvents
// @access  Private
router.post("/:id/interested", authenticate, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.uid; // Authenticated user's UID

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventData = eventDoc.data();

    // Check if the user is already interested
    const isAlreadyInterested = eventData.interestedUsers.some(
      (user) => user.userId === userId
    );
    if (isAlreadyInterested) {
      return res.status(400).json({
        error: "You have already indicated interest in this event.",
      });
    }

    // Fetch user's displayName and profileImage from users collection
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found." });
    }

    const userData = userDoc.data();

    // Add the user to interestedUsers array
    await eventRef.update({
      interestedUsers: admin.firestore.FieldValue.arrayUnion({
        userId,
        displayName: userData.username || "Anonymous",
        profileImage: userData.profileImage || "https://via.placeholder.com/50",
      }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Add eventId to user's joinedEvents array
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      joinedEvents: admin.firestore.FieldValue.arrayUnion(eventId),
    });

    res.status(200).json({
      message: "You have successfully indicated interest in this event.",
    });
  } catch (error) {
    console.error(`Error adding interested user to event ${eventId}:`, error);
    res.status(500).json({ error: "Failed to indicate interest." });
  }
});

// @route   DELETE /api/events/:id/interested
// @desc    Remove a user from interestedUsers array and remove eventId from user's joinedEvents
// @access  Private
router.delete("/:id/interested", authenticate, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.uid; // Authenticated user's UID

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventData = eventDoc.data();

    // Check if the user is interested
    const userEntry = eventData.interestedUsers.find(
      (user) => user.userId === userId
    );
    if (!userEntry) {
      return res.status(400).json({
        error: "You have not indicated interest in this event.",
      });
    }

    // Remove the user from interestedUsers array
    await eventRef.update({
      interestedUsers: admin.firestore.FieldValue.arrayRemove(userEntry),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Remove eventId from user's joinedEvents array
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      joinedEvents: admin.firestore.FieldValue.arrayRemove(eventId),
    });

    res.status(200).json({
      message: "You have successfully removed your interest from this event.",
    });
  } catch (error) {
    console.error(
      `Error removing interested user from event ${eventId}:`,
      error
    );
    res.status(500).json({ error: "Failed to remove interest." });
  }
});

module.exports = router;