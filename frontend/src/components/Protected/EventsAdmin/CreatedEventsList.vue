<template>
  <router-link to="/eventsadmin">
    <button class="edit-btn">Create Event</button>
  </router-link>
  <div class="events-list p-6 bg-white rounded shadow-md">
    <h2 class="text-xl font-semibold mb-4">Created Events</h2>
    <div v-if="events.length">
      <EventCard v-for="event in events" :key="event.eventId" :event="event" :showActions="true" @edit-event="openEditEventModal"
        @delete-event="deleteEvent" />
    </div>
    <p v-else class="text-gray-700">No events available.</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import EventCard from "./EventCard.vue";

defineProps({
  events: Array,
});

const emit = defineEmits(["edit-event", "delete-event"]);

const editEvent = (event) => {
  emit("edit-event", event);
};

const deleteEvent = (eventId) => {
  emit("delete-event", eventId);
};
</script>

<style scoped>

.edit-btn {
  margin-bottom:15px;
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
