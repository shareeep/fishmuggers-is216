const express = require("express");
const router = express.Router();
const { db } = require("../services/firebase");

// Fetch events from user's joined events


// Assuming you have a route handler for joined events in calendar.js

// Fetch joined events for a user
router.get('/joined-events/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
      // Fetch user document from the 'users' collection
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Get the joinedEvents array from the user document
      const joinedEvents = userDoc.data().joinedEvents || [];
  
      // Fetch each event document from the 'events' collection
      const eventPromises = joinedEvents.map(async (eventId) => {
        const eventDoc = await db.collection('events').doc(eventId).get();
        if (eventDoc.exists) {
          const eventData = eventDoc.data();
          // Ensure eventData has the necessary properties
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
  
      // Wait for all promises to resolve
      const events = await Promise.all(eventPromises);
  
      // Filter out any null entries (for events that were not found)
      const filteredEvents = events.filter(event => event !== null);
  
      res.json(filteredEvents);
    } catch (error) {
      console.error("Error fetching joined events:", error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });
  
  module.exports = router;
  