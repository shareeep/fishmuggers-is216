<template>
  <div class="event-card mb-6">
    <div class="flex">
      <img :src="event.eventImage || 'https://via.placeholder.com/800x400'" alt="Event Image"
        class="w-48 h-32 object-cover rounded" />
      <div class="ml-4 flex-1">
        <h3 class="text-lg font-bold">{{ event.title }}</h3>
        <p class="text-gray-600">{{ event.description }}</p>
        <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
        <p><strong>Location:</strong> {{ event.location }}</p>
        <p><strong>Pet Types:</strong> {{ formatPetTypes(event.petType) }}</p>
        <p><strong>Event Size:</strong> {{ event.eventSize }}</p>
        <div class="flex items-center mt-2">
          <img :src="event.host.profilePic || 'https://via.placeholder.com/50'" alt="Host Profile"
            class="w-8 h-8 rounded-full mr-2" />
          <span>{{ event.host.username }}</span>
        </div>
        <p class="mt-2">
          <strong>Interested Users:</strong> {{ event.interestedUsers.length }}
        </p>
        <!-- Action Buttons -->
         <!-- i just put '||' instead of '&&' to see if edit/delete buttons will show up-->
        <div class="ml-auto" v-if="showActions || isEventHost">
          <button @click="$emit('edit-event', event)" class="edit-btn mr-3">
            Edit
          </button>
          <button @click="$emit('delete-event', event.eventId)" class="delete-btn">
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
const props = defineProps({
  event: Object,
  showActions: Boolean, // Prop to control action button visibility
});

const auth = getAuth();
const currentUser = computed(() => auth.currentUser);
const emit = defineEmits(["edit-event", "delete-event"]);

// Computed property to check if current user is the event host
const isEventHost = computed(() => {
  return (
    currentUser.value &&
    props.event.host &&
    props.event.host.uid === currentUser.value.uid
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
.event-card {
  text-align: left;
  border-radius: 15px;
  padding: 10px;
}

.edit-btn {
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

.delete-btn {
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  background-color: #ff7b7b;
  color: #333;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.delete-btn:hover {
  background-color: #d06c6c;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.delete-btn:active {
  transform: scale(0.98);
}
</style>
