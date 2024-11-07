<template>
  <div class="events-list p-6 bg-white rounded shadow-md">
    <h2 class="text-xl font-semibold mb-4">All Events</h2>
    <div v-if="events.length">
      <EventCard
        v-for="event in events"
        :key="event.eventId"
        :event="event"
        @edit-event="openEditEventModal"
        @delete-event="deleteEvent"
      />
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

const openEditEventModal = (event) => {
  emit("edit-event", event);
};

const deleteEvent = (eventId) => {
  emit("delete-event", eventId);
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
