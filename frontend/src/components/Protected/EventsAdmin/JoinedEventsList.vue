<template>
  <div class="joined-events-section">
    <!-- Join Event Button: Only show if viewing own profile -->
    <!-- Events List -->
    <div class="events-list p-6 bg-white rounded shadow-md">
      <h2 class="text-xl font-semibold mb-4">Joined Events</h2>

      <!-- Check if there are events -->
      <div v-if="events.length">
        <div class="event-cards-grid">
          <!-- Make each EventCard clickable by wrapping it in a router-link -->
          <router-link 
            v-for="event in events" 
            :key="event.eventId" 
            :to="`/eventdetail/${event.eventId}`" 
            class="event-card-link"
          >
            <EventCard 
              :event="event" 
              :showActions="false" 
            />
          </router-link>
        </div>
      </div>
      
      <!-- Message when no events are available -->
      <p v-else class="text-gray-700">No events available.</p>
    </div>
  </div>
</template>

<script setup>
import { watch, defineProps, ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import EventCard from './EventCard.vue';

// Define props to accept events and the profile ID from the parent
const props = defineProps({
  events: {
    type: Array,
    required: true
  },
  profileUserId: {
    type: String,
    default: null // Allow for undefined by setting a default
  }
});

// Reactive properties
const isOwnProfile = ref(false); // Dynamically determined
const currentUserId = ref(null); // Store current user ID

// Fetch the current authenticated user and set isOwnProfile
onMounted(() => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    currentUserId.value = currentUser.uid; // Store current user ID

    // Use currentUserId as fallback if profileUserId is undefined
    const effectiveUserId = props.profileUserId || currentUserId.value;
    isOwnProfile.value = currentUserId.value === effectiveUserId;

    console.log('Current User ID:', currentUserId.value); // Debugging
    console.log('Profile User ID:', effectiveUserId); // Debugging (fallback applied if needed)
    console.log('Is Own Profile:', isOwnProfile.value); // Check if set correctly
  }
});


watch(
  () => props.events,
  (newEvents) => {
    // Update the display when the events list changes
    events.value = newEvents;
  },
  { deep: true }
);


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
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .event-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Make the entire event card clickable */
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


.event-card-link:active {
  transform: scale(0.98);
}

/* Event card content adjustments */
.event-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
  transition: transform 0.2s ease-in-out;
  background-color: #fff; /* Ensure background is white */
}

.event-card img {
  width: 100%;
  height: auto;
  border-radius: 5px;
  object-fit: cover;
}

.event-card h3,
.event-card p {
  margin: 0.5rem 0;
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
