<template>
  <div class="joined-events-section">
    <router-link to="/events">
      <button class="edit-btn">Join Event</button>
    </router-link>
    <div class="events-list p-6 bg-white rounded shadow-md">
      <h2 class="text-xl font-semibold mb-4">Joined Events</h2>
      <div v-if="events.length">
        <div class="event-cards-grid">
          <EventCard 
            v-for="event in events" 
            :key="event.eventId" 
            :event="event" 
            @open-detail="openEventDetail"  
            :showActions="false"
          />
        </div>
      </div>
      <p v-else class="text-gray-700">No events available.</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import EventCard from "./EventCard.vue";

// Define props to accept events from parent
const props = defineProps({
  events: {
    type: Array,
    required: true
  }
});

// Define emits to communicate with parent
const emit = defineEmits(['open-detail']);

// Setup router
const router = useRouter();

// Handle navigation to event detail page
const openEventDetail = (event) => {
  emit('open-detail', event);
};
</script>

<style scoped>
/* Parent component styling */
.joined-events-section {
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

/* Ensure grid items have sufficient width */
.event-cards-grid > * {
  width: 100%;
}
</style>
