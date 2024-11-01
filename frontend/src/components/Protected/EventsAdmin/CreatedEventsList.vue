<template>
  <router-link to="/eventsadmin">
    <button class="edit-btn">Create Event</button>
  </router-link>
  <div class="events-list p-6 bg-white rounded shadow-md">
    <h2 class="text-xl font-semibold mb-4">Created Events</h2>
    <div v-if="events.length">
      <EventCard v-for="event in events" :key="event.eventId" :event="event" :showActions="true"
        @edit-event="$emit('edit-event', event)" @delete-event="deleteEvent" />
    </div>
    <p v-else class="text-gray-700">No events available.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getAuth } from "firebase/auth";
import axios from "axios";
import EventCard from "./EventCard.vue";

// Firebase auth setup
const auth = getAuth();
const currentUser = computed(() => auth.currentUser);

// Reactive data properties
const events = ref([]);

// Fetch events from API
const fetchEvents = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/events");
    events.value = response.data;
    console.log("Fetched Events:", events.value);
  } catch (error) {
    console.error("Error fetching events:", error);
    errorMessage.value = "Failed to fetch events.";
  }
};

// Delete an event
const deleteEvent = async (eventId) => {
  if (!confirm("Are you sure you want to delete this event?")) return;

  const user = currentUser.value;
  if (!user) {
    errorMessage.value = "User not authenticated.";
    return;
  }

  try {
    await axios.delete(`http://localhost:3000/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${await user.getIdToken()}` },
    });
    successMessage.value = "Event deleted successfully!";
    await fetchEvents(); // Refresh the event list after deletion
  } catch (error) {
    console.error("Error deleting event:", error);
    errorMessage.value = error.response?.data?.error || "Failed to delete event.";
  }
};

// Fetch events on component mount
onMounted(fetchEvents);
</script>

<style scoped>
.edit-btn {
  margin-bottom: 15px;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  background-color: #FFD700;
  color: #333;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.edit-btn:hover {
  background-color: #E6C200;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.edit-btn:active {
  transform: scale(0.98);
}

h2 {
  text-align: left;
}
</style>
