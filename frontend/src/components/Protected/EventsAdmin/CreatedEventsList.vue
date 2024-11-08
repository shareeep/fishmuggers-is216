<template>
  <div class="events-list p-6 bg-white rounded shadow-md">
    <h2 class="text-xl font-semibold mb-4">Created Events</h2>
    <!-- Display success and error messages -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="events.length">
      <div class="event-cards-grid">
        <div v-for="event in events" :key="event.eventId" class="event-card-link" @click="openEventDetail(event)">
          <EventCard :event="event" :showActions="true" :isOwnProfile="isOwnProfile"
            @edit-event="$emit('edit-event', event)" @delete-event="handleDeleteEvent" />
        </div>
      </div>
    </div>
    <p v-else class="text-gray-700">No events available.</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { getAuth } from "firebase/auth";
import axios from "axios";
import EventCard from "./EventCard.vue";
import { useRouter } from "vue-router";

// Define props to accept events from parent
const props = defineProps({
  events: {
    type: Array,
    required: true
  },
  isOwnProfile: {
    type: Boolean,
    default: false
  }
});

// Define emits to communicate with parent
const emit = defineEmits(['edit-event', 'delete-event', 'open-detail']);

// Setup router
const router = useRouter();

// Reactive properties for messages
const errorMessage = ref("");
const successMessage = ref("");

// Handle deletion of an event
const handleDeleteEvent = async (eventId) => {
  if (!confirm("Are you sure you want to delete this event?")) return;

  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    errorMessage.value = "User not authenticated.";
    return;
  }

  try {
    await axios.delete(`/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${await user.getIdToken()}` },
    });
    successMessage.value = "Event deleted successfully!";
    emit('delete-event', eventId); // Notify parent to refresh events
  } catch (error) {
    console.error("Error deleting event:", error);
    errorMessage.value = error.response?.data?.error || "Failed to delete event.";
  }
};

// Handle navigation to event detail page
const openEventDetail = (event) => {
  router.push(`/eventdetail/${event.eventId}`);
};
</script>


<style scoped>
/* Parent component styling */
.events-list {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

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

.event-cards-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

/* Responsive grid layout */
@media (min-width: 640px) {
  .event-cards-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1024px) {
  .event-cards-grid {
    grid-template-columns: 1fr;
  }
}

/* Event card responsive styles */
.event-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  overflow: hidden;
}

.event-card:hover {
  transform: scale(1.02);
  cursor: pointer;
}

/* Event card content adjustments */
.event-card h3,
.event-card p {
  margin: 0.5rem 0;
}

.event-card img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

/* Message styling */
.success-message {
  color: green;
  margin-bottom: 1rem;
}

.error-message {
  color: red;
  margin-bottom: 1rem;
}
</style>