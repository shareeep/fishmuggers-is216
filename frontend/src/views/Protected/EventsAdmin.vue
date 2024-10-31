<template>
  <div class="home-container"> <!-- Use a wrapper for flex layout -->
    <Navbar />
    <router-link to="/events" class="back-button">
      <img src="../../assets/images/back_arrow.png" alt="back" width="40px" />
    </router-link>
    <main id="scrollable-element">
      <div class="events-container">
        <!-- Event Creation Form -->
        <EventCreationForm @event-created="fetchEvents" />
        <!-- Events List -->
        <EventsList :events="events" @edit-event="openEditEventModal" @delete-event="deleteEvent" />
        <!-- Edit Event Modal -->
        <EditEventModal v-if="showEditModal" :eventData="editEventData" @close="closeEditModal"
          @event-updated="handleEventUpdated" />
      </div>
    </main>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import Navbar from '@/components/Protected/Navbar.vue';
import EventCreationForm from "@/components/Protected/EventsAdmin/EventCreationForm.vue";
import EventsList from "@/components/Protected/EventsAdmin/EventsList.vue";
import EditEventModal from "@/components/Protected/EventsAdmin/EditEventModal.vue";
import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';

Scrollbar.use(OverscrollPlugin);

onMounted(() => {
  const scrollbar = Scrollbar.init(document.querySelector('#scrollable-element'), {
    damping: 0.05,
    renderByPixels: true,
    alwaysShowTracks: false,
    continuousScrolling: true,
    plugins: {
      overscroll: {
        effect: 'bounce',
        damping: 0.2,
        maxOverscroll: 70,
      },
    },
  });

  // Hide the scrollbar track by setting its opacity to 0
  scrollbar.track.xAxis.element.style.opacity = '0';
  scrollbar.track.yAxis.element.style.opacity = '0';
});

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
#scrollable-element {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.navbar {
  width: 250px;
  height: 100vh;
  position: fixed;
}

main {
  align-items: center;
  margin-left: 250px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: #FCEFB4;
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}


.back-button {
  position: absolute;
  top: 20px;
  left: 280px;
  /* Adjust to appear beside the Navbar */
  z-index: 10;
  padding: 5px;
  transition: transform 0.2s ease;
}

.back-button:hover {
  transform: scale(1.1);
}

/* Responsive Adjustments */
@media (max-width: 991px) {
  .back-button {
    top: 15px;
    left: 85px;
  }

  .navbar {
    width: 80px;
  }

  main {
    margin-left: 80px;
    padding: 15px;
  }

  .floating-btn {
    width: 50px;
    height: 50px;
    font-size: 30px;
  }
}

@media (max-width: 767px) {
  .back-button {
    top: 15px;
    left: 1px;
  }

  .home-container {
    flex-direction: column;
  }

  .navbar {
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #f9f9f9;
    z-index: 10;
  }

  main {
    margin-left: 0;
    margin-top: 0;
    padding: 15px;
    margin-top: 15px;
    margin-bottom: 35px;
    height: calc(100vh - 50px);
    /* Account for navbar height on mobile */
    overflow-y: auto;
  }

  .floating-btn {
    bottom: 60px;
    /* Place above mobile navbar */
    right: 20px;
    width: 50px;
    height: 50px;
    font-size: 30px;
  }
}

.events-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  min-height: 100vh;
}

/* Add any additional styles if needed */
</style>
