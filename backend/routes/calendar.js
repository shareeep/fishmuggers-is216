const express = require("express");
const router = express.Router();
const { db, admin } = require("../services/firebase");
//ADMIN???
// const admin = require("firebase-admin"); // Import Firebase Admin SDK

// Fetch joined events for a user
router.get('/joined-events/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const joinedEvents = userDoc.data().joinedEvents || [];
        const eventPromises = joinedEvents.map(async (eventId) => {
            const eventDoc = await db.collection('events').doc(eventId).get();
            if (eventDoc.exists) {
                const eventData = eventDoc.data();
                return {
                    eventId: eventId,
                    title: eventData.title || 'Untitled Event',
                    description: eventData.description || 'No description provided.',
                    date: eventData.date || 'Date not specified',
                    location: eventData.location || 'Location not specified',
                    petType: eventData.petType || [],
                    eventSize: eventData.eventSize || 'Unknown',
                    locationData: eventData.locationData || [0, 0],
                    eventImage: eventData.eventImage || null
                };
            } else {
                console.warn(`Event with ID ${eventId} not found`);
                return null;
            }
        });

        const events = await Promise.all(eventPromises);
        const filteredEvents = events.filter(event => event !== null);
        res.json(filteredEvents);
    } catch (error) {
        console.error("Error fetching joined events:", error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Fetch custom events for a user
router.get('/custom-events/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const customEvents = userDoc.data().customEvents || [];
        const customEventPromises = customEvents.map(async (customEventId) => {
            const customEventDoc = await db.collection('customEvents').doc(customEventId).get();
            if (customEventDoc.exists) {
                const customEventData = customEventDoc.data();
                return {
                    customEventId: customEventId,
                    title: customEventData.title || 'Untitled Custom Event',
                    description: customEventData.desc || 'No description provided.',
                    date: customEventData.date || 'Date not specified',
                    location: customEventData.location || 'Location not specified'
                };
            } else {
                console.warn(`Custom event with ID ${customEventId} not found`);
                return null;
            }
        });

        const customEventsData = await Promise.all(customEventPromises);
        const filteredCustomEvents = customEventsData.filter(event => event !== null);
        res.json(filteredCustomEvents);
    } catch (error) {
        console.error("Error fetching custom events:", error);
        res.status(500).json({ error: 'Failed to fetch custom events' });
    }
});

// In calendar.js
//CUSTOM EVENTS FORM POST
// Create a new custom event and add it to the user's customEvents field
router.post('/custom-events', async (req, res) => {
    const { uid, title, description, date, location } = req.body;
    try {
        // Convert the date to a Firestore Timestamp
        const eventDate = admin.firestore.Timestamp.fromDate(new Date(date));

        // Generate a new document reference with an auto-generated ID
        const newEventRef = db.collection('customEvents').doc(); // Create a reference with an auto-generated ID
        const customEventId = newEventRef.id; // Retrieve the generated ID

        // Step 1: Set the custom event document with the customEventId included in the data
        await newEventRef.set({
            customEventId, // Add the customEventId directly to the document
            title,
            desc: description,
            date: eventDate, // Store the date as a Firestore Timestamp
            location
        });

        // Step 2: Add the new custom event ID to the user's customEvents array field
        const userRef = db.collection('users').doc(uid);
        await userRef.update({
            customEvents: admin.firestore.FieldValue.arrayUnion(customEventId) // Adds the new custom event ID to the array
        });

        res.status(201).json({ message: 'Custom event created successfully', customEventId });
    } catch (error) {
        console.error("Error creating custom event:", error);
        res.status(500).json({ error: 'Failed to create custom event' });
    }
});
//CUSTOM EVENTS FORM POST

module.exports = router;
