<template>
  <div class="event-card mb-6">
    <div class="flex">
      <img
        :src="event.eventImage || 'https://via.placeholder.com/800x400'"
        alt="Event Image"
        class="w-48 h-32 object-cover rounded"
      />
      <div class="ml-4 flex-1">
        <h3 class="text-lg font-bold">{{ event.title }}</h3>
        <p class="text-gray-600">{{ event.description }}</p>
        <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
        <p><strong>Location:</strong> {{ event.location }}</p>
        <p><strong>Pet Types:</strong> {{ formatPetTypes(event.petType) }}</p>
        <p><strong>Event Size:</strong> {{ event.eventSize }}</p>
        <div class="flex items-center mt-2">
          <img
            :src="event.host.profilePic || 'https://via.placeholder.com/50'"
            alt="Host Profile"
            class="w-8 h-8 rounded-full mr-2"
          />
          <span>{{ event.host.username }}</span>
        </div>
        <p class="mt-2">
          <strong>Interested Users:</strong> {{ event.interestedUsers.length }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="ml-auto">
        <div v-if="isEventHost">
          <button
            @click="$emit('edit-event', event)"
            class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
          >
            Edit
          </button>
          <button
            @click="$emit('delete-event', event.eventId)"
            class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { getAuth } from "firebase/auth";

// Props
defineProps({
  event: Object,
});

const auth = getAuth();
const currentUser = computed(() => auth.currentUser);
const emit = defineEmits(["edit-event", "delete-event"]);


// Computed property to check if current user is the event host
const isEventHost = computed(() => {
  return (
    currentUser.value &&
    event.host &&
    event.host.uid === currentUser.value.uid
  );
});

// Helper methods
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleString();
};

const formatPetTypes = (petType) => {
  if (Array.isArray(petType)) {
    return petType.join(", ");
  }
  return "N/A";
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
