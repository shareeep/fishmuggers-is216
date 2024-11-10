<template>
  <div class="event-card mb-6" @click="handleClick"> 
    <div class="event-content">
      <img :src="event.eventImage || 'https://via.placeholder.com/800x400'" alt="Event Image" class="event-image" />
      <div class="event-details">
        <h3 class="text-lg font-bold">{{ event.title }}</h3>
        <p><strong>Date:</strong> {{ formatEventDate(event.date) }}</p>
        <p><strong>Time:</strong> {{ formatEventTime(event.date) }}</p>
        <p><strong>Location:</strong> {{ event.location }}</p>
        <p> <strong>RSVPed Users:</strong> {{ event.interestedUsers.length }}</p>
      </div>
      <div class="action-buttons" v-if="showActions || isEventHost">
        <!-- Stop propagation on these buttons to prevent navigation -->
        <button v-if="isOwnProfile || isEventHost" @click.stop="$emit('edit-event', event)" class="edit-btn">
          Edit
        </button>
        <button v-if="isOwnProfile || isEventHost" @click.stop="$emit('delete-event', event.eventId)"
          class="delete-btn">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";
import { getAuth } from "firebase/auth";

// Define Props
const props = defineProps({
  event: Object,
  showActions: Boolean,
});

// Define Emits
const emit = defineEmits(['edit-event', 'delete-event', 'open-detail']);

// Initialize Firebase Auth
const auth = getAuth();
const currentUser = computed(() => auth.currentUser);

// Handle Click on Event Card
const handleClick = () => {
  emit('open-detail', props.event);
};

// Computed Property to Check if Current User is the Event Host
const isEventHost = computed(() => {
  console.log("Event Host ID:", props.event.host); // Debugging line
  console.log("Current User ID:", currentUser.value?.uid); // Debugging line
  return currentUser.value && props.event.host === currentUser.value.uid;
});


// Helper Methods

// Function to Convert Various Date Inputs to Date Object
const convertToDate = (dateInput) => {
  if (dateInput && dateInput._seconds) {
    return new Date(dateInput._seconds * 1000);
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    return new Date(dateInput);
  } else {
    return new Date();
  }
};

// Function to Format Event Date
const formatEventDate = (dateInput) => {
  const dateObj = convertToDate(dateInput);
  return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

// Function to Format Event Time
const formatEventTime = (dateInput) => {
  const dateObj = convertToDate(dateInput);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${minutes} ${ampm}`;
};

// Function to Format Pet Types
const formatPetTypes = (petType) => {
  if (Array.isArray(petType)) {
    return petType.join(", ");
  }
  return "N/A";
};
</script>
<style scoped>
.event-card {
  text-align: left;
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover,
.event-card:focus {
  transform: scale(1.02);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.event-content {
  display: flex;
  flex-direction: column;
  /* Keep as column for all viewports */
  gap: 1rem;
}

.event-image {
  width: 100%;
  height: auto;
  max-height: 300px;
  border-radius: 8px;
  object-fit: cover;
}

.event-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

h3.text-lg {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.text-gray-600 {
  color: #4A5568;
}

.flex.items-center {
  display: flex;
  align-items: center;
}

.host-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.edit-btn {
  background-color: #FFD700;
  color: #333;
}

.delete-btn {
  background-color: #ff7b7b;
  color: #333;
}

.edit-btn:hover,
.delete-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.edit-btn:hover {
  background-color: #E6C200;
}

.delete-btn:hover {
  background-color: #d06c6c;
}

.edit-btn:active,
.delete-btn:active {
  transform: scale(0.98);
}

/* Removed the media query to maintain column layout across all viewports */

/* Ensure images do not exceed their container */
.event-image,
.host-avatar,
.avatar-caption {
  max-width: 100%;
  height: auto;
}

@media (max-width: 414px) {
  .event-card {
    width: 95%; /* Increase the width to 95% of the viewport */
    margin: 0 auto; /* Center the card within the screen */
  }
}

</style>
