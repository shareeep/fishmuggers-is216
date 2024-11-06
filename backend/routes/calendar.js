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
    const { uid, title, description, datetime, location } = req.body;
    try {
        // Convert the datetime to a Firestore Timestamp
        const eventDate = admin.firestore.Timestamp.fromDate(new Date(datetime));

        const newEventRef = db.collection('customEvents').doc();
        const customEventId = newEventRef.id;

        await newEventRef.set({
            customEventId,
            title,
            desc: description,
            date: eventDate, // Store as a Firestore timestamp
            location
        });

        const userRef = db.collection('users').doc(uid);
        await userRef.update({
            customEvents: admin.firestore.FieldValue.arrayUnion(customEventId)
        });

        res.status(201).json({ message: 'Custom event created successfully', customEventId });
    } catch (error) {
        console.error("Error creating custom event:", error);
        res.status(500).json({ error: 'Failed to create custom event' });
    }
});
//CUSTOM EVENTS FORM POST

// Delete an event (only removes the event document if it's a custom event)
router.delete('/delete-event', async (req, res) => {
    const { uid, eventId, isCustomEvent } = req.body;
    try {
        // If it's a custom event, delete the document from the customEvents collection
        if (isCustomEvent) {
            await db.collection('customEvents').doc(eventId).delete();
        }

        // Update the user's document to remove the event from the appropriate field (customEvents or joinedEvents)
        const userRef = db.collection('users').doc(uid);
        const fieldToUpdate = isCustomEvent ? 'customEvents' : 'joinedEvents';
        
        await userRef.update({
            [fieldToUpdate]: admin.firestore.FieldValue.arrayRemove(eventId)
        });

        res.status(200).json({ message: 'Event deleted successfully from user\'s events list' });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Fetch user profile information
router.get('/users/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.data();
        res.json({
            profileImage: userData.profileImage,
            username: userData.username,
            email: userData.email
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});



module.exports = router;
