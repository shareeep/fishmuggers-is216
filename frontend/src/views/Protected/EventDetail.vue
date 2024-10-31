<template>
  <div class="home-container">
    <main>
      <RSVPBar v-if="event" :event="event" />
      <Details v-if="event" :event="event" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Details from "@/components/Protected/Events/Details.vue";
import RSVPBar from "@/components/Protected/Events/RSVPbar.vue";

const route = useRoute();
const eventId = route.params.id; // Capture eventId from the route
const event = ref(null); // Initialize the event data as null

const fetchEvent = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/events/${eventId}`);
    event.value = response.data; // Store the event data once fetched
  } catch (error) {
    console.error("Failed to fetch event:", error);
  }
};

onMounted(() => {
  fetchEvent(); // Fetch the event data on mount

});
</script>


<style scoped>
.home-container {
    display: flex;
    /* Set flexbox layout for the container */
}

/* can change */
main {
    flex-grow: 1;
    /* Allow main to take the remaining width */
    padding: 20px;
    /* Add padding for spacing */
    /* Optional styling */
    background-color: white;
    /* Example background color */
    overflow-y: auto;
    /* Allow scrolling if content overflows */
    margin-bottom: 20px;
}
/* 
h1 {
    text-align: center; */
    /* Center text in the main area */
/* } */

html,body {
  background-color: white !important; /* Set the background color to white */
}
</style>