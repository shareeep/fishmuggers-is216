<template>
  <div class="home-container"> <!-- Use a wrapper for flex layout -->
    <Navbar />
    <main> <!-- Wrap content in a main tag -->
      <CalendarComponent @day-clicked="handleOpenEvent" />

      <!-- Render EventPopup only in Calendar.vue -->
      <EventPopup v-if="showPopup" :event="selectedEvent" @close="closePopup" @delete-event="deleteEvent" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Any Home page-specific logic
import Navbar from '@/components/Protected/Navbar.vue';
import CalendarComponent from '@/components/Protected/Calendar/CalendarComponent.vue';
import EventPopup from '@/components/Protected/Calendar/EventPopup.vue';

const showPopup = ref(false);
const selectedEvent = ref(null);

function handleOpenEvent(event) {
  console.log("Event received in Calendar.vue:", event); // Debugging statement
  selectedEvent.value = event;
  showPopup.value = true;
}


function closePopup() {
  showPopup.value = false;
}

</script>

<style scoped>
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
  overflow: scroll;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  text-align: center;
  /* Center text in the main area */
}

.calendar-container {
  margin-top: 5vh;
}

/* Responsive Adjustments */
@media (max-width: 991px) {
  .navbar {
    width: 80px;
    position: fixed
  }

  main {
    margin-left: 80px;
    padding: 15px;
  }
}

@media (max-width: 767px) {
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
    padding-bottom: 45px;
    height: calc(100vh - 50px);
    overflow-y: auto;
  }

  .friends-container {
    flex-direction: column;
    align-items: center;
  }

  .heading {
    font-size: 1.5rem;
  }
}
</style>