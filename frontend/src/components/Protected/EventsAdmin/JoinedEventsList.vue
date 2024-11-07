<template>
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
                />
            </div>
        </div>
        <p v-else class="text-gray-700">No events available.</p>
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
        grid-template-columns: 1fr 1fr;
    }
}

@media (min-width: 1024px) {
    .event-cards-grid {
        grid-template-columns: 1fr 1fr 1fr;
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
</style>
