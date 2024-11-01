<template>
  <div class="event-card mb-6" @click="handleClick">
    <div class="event-content">
      <img :src="event.eventImage || 'https://via.placeholder.com/800x400'" alt="Event Image" class="event-image" />
      <div class="event-details">
        <h3 class="text-lg font-bold">{{ event.title }}</h3>
        <p class="text-gray-600">{{ event.description }}</p>
        <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
        <p><strong>Location:</strong> {{ event.location }}</p>
        <p><strong>Pet Types:</strong> {{ formatPetTypes(event.petType) }}</p>
        <p><strong>Event Size:</strong> {{ event.eventSize }}</p>
        <div class="flex items-center mt-2">
          <img :src="event.host.profilePic || 'https://via.placeholder.com/50'" alt="Host Profile" class="host-avatar" />
          <span>{{ event.host.username }}</span>
        </div>
        <p class="mt-2">
          <strong>Interested Users:</strong> {{ event.interestedUsers.length }}
        </p>
        <div class="action-buttons" v-if="showActions || isEventHost">
          <!-- Stop propagation on these buttons to prevent navigation -->
          <button @click.stop="$emit('edit-event', event)" class="edit-btn mr-3">
            Edit
          </button>
          <button @click.stop="$emit('delete-event', event.eventId)" class="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";
import { getAuth } from "firebase/auth";

// Props
const props = defineProps({
  event: Object,
  showActions: Boolean,
});

const emit = defineEmits();

const auth = getAuth();
const currentUser = computed(() => auth.currentUser);

const handleClick = () => {
  emit('open-detail', props.event);
};

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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.event-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-image {
  width: auto;
  height: auto;
  max-height: 300px;
  border-radius: 8px;
}

.event-details {
  flex: 1;
}

/* Host avatar styling */
.host-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 8px;
}

/* Action button styling */
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

.edit-btn:hover {
  background-color: #E6C200;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.delete-btn {
  background-color: #ff7b7b;
  color: #333;
}

.delete-btn:hover {
  background-color: #d06c6c;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

/* Responsive layout */
@media (min-width: 768px) {
  .event-content {
    flex-direction: row;
  }

  .event-image {
    width: 192px;
    height: 128px;
  }
}

@media (max-width: 768px) {
  .event-card {
    padding: 8px;
  }

  .text-lg {
    font-size: 1rem;
  }

  .edit-btn,
  .delete-btn {
    padding: 4px 10px;
    font-size: 0.9rem;
  }
}
</style>
