<template>
  <div class="events-container">
    <!-- Event Creation Form -->
    <EventCreationForm @event-created="fetchEvents" />

    <!-- Events List -->
    <EventsList
      :events="events"
      @edit-event="openEditEventModal"
      @delete-event="deleteEvent"
    />

    <!-- Edit Event Modal -->
    <EditEventModal
      v-if="showEditModal"
      :eventData="editEventData"
      @close="closeEditModal"
      @event-updated="handleEventUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import EventCreationForm from "@/components/Protected/EventsAdmin/EventCreationForm.vue";
import EventsList from "@/components/Protected/EventsAdmin/EventsList.vue";
import EditEventModal from "@/components/Protected/EventsAdmin/EditEventModal.vue";

import { getAuth } from "firebase/auth";
import axios from "axios";

const auth = getAuth();
const currentUser = auth.currentUser;

const events = ref([]);
const showEditModal = ref(false);
const editEventData = ref(null);
const errorMessage = ref("");
const successMessage = ref("");
const isSubmitting = ref(false);

const fetchEvents = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/events");
    events.value = response.data;
    console.log("Fetched Events:", events.value); // Add this line
  } catch (error) {
    console.error("Error fetching events:", error);
    errorMessage.value = "Failed to fetch events.";
  }
};

const openEditEventModal = (event) => {
  editEventData.value = event;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editEventData.value = null;
};

const handleEventUpdated = () => {
  closeEditModal();
  fetchEvents();
};

const deleteEvent = async (eventId) => {
  if (!confirm("Are you sure you want to delete this event?")) {
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    errorMessage.value = "User not authenticated.";
    return;
  }

  try {
    // Send DELETE request to delete event
    await axios.delete(`http://localhost:3000/api/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });

    successMessage.value = "Event deleted successfully!";
    // Refresh events list
    await fetchEvents();
  } catch (error) {
    console.error("Error deleting event:", error);
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.error || "Failed to delete event.";
    } else {
      errorMessage.value = "Failed to delete event.";
    }
  }
};

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped>
.events-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f3f4f6;
  min-height: 100vh;
}

/* Add any additional styles if needed */
</style>
