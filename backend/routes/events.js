// backend/routes/events.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const authenticate = require("../middleware/authenticate");

const db = admin.firestore();

// **Create a New Event**
router.post("/", authenticate, async (req, res) => {
  const { title, date, location, petType, eventSize } = req.body;
  const host = req.user.uid;

  // Validate required fields
  if (!title || !date || !location || !petType || !eventSize) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const eventData = {
    title,
    date: admin.firestore.Timestamp.fromDate(new Date(date)),
    location,
    petType,
    eventSize,
    interestedUsers: [],
    host,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    const eventRef = await db.collection("events").add(eventData);
    res
      .status(201)
      .json({ message: "Event created successfully", id: eventRef.id });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Get All Events**
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("events").get();
    const events = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Get a Single Event by ID**
router.get("/:id", async (req, res) => {
  const eventId = req.params.id;

  try {
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ id: eventDoc.id, ...eventDoc.data() });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Update an Event**
router.put("/:id", authenticate, async (req, res) => {
  const eventId = req.params.id;
  const updateData = req.body;

  try {
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Ensure the user is the host of the event
    if (eventDoc.data().host !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "Forbidden: You are not the host of this event" });
    }

    // If date is being updated, convert it to Firestore Timestamp
    if (updateData.date) {
      updateData.date = admin.firestore.Timestamp.fromDate(
        new Date(updateData.date)
      );
    }

    await db.collection("events").doc(eventId).update(updateData);
    res.json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Delete an Event**
router.delete("/:id", authenticate, async (req, res) => {
  const eventId = req.params.id;

  try {
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Ensure the user is the host of the event
    if (eventDoc.data().host !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "Forbidden: You are not the host of this event" });
    }

    await db.collection("events").doc(eventId).delete();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Mark Interest in an Event**
router.post("/:id/interested", authenticate, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.uid;

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    await eventRef.update({
      interestedUsers: admin.firestore.FieldValue.arrayUnion(userId),
    });

    res.json({ message: "Marked as interested in the event" });
  } catch (error) {
    console.error("Error marking interest:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Remove Interest from an Event**
router.delete("/:id/interested", authenticate, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.uid;

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    await eventRef.update({
      interestedUsers: admin.firestore.FieldValue.arrayRemove(userId),
    });

    res.json({ message: "Removed interest from the event" });
  } catch (error) {
    console.error("Error removing interest:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
