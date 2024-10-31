<template>
  <div class="home-container">
    <RSVPBar v-if="event" :event="event" @showSharePopup="showPopup = true" />
    <main id="scrollable-element">
      <Details v-if="event" :event="event" />
    </main>
    <!-- Share Popup -->
    <ShareEventPopup v-if="showPopup" @close="showPopup = false" :friends="friends" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Details from "@/components/Protected/Events/Details.vue";
import RSVPBar from "@/components/Protected/Events/RSVPbar.vue";
import ShareEventPopup from "@/components/Protected/Events/ShareEventPopup.vue"; 


import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';

// Initialize Smooth Scrollbar for main content
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

const route = useRoute();
const eventId = route.params.id; // Capture eventId from the route
const event = ref(null); // Initialize the event data as null
const showPopup = ref(false); // State to control popup visibility
const friends = ref([]); // Sample friends list for ShareEventPopup

const fetchEvent = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/events/${eventId}`);
    event.value = response.data; // Store the event data once fetched
  } catch (error) {
    console.error("Failed to fetch event:", error);
  }
};

// Fetch friends for popup
// const fetchFriends = async () => {
//   try {
//     const response = await axios.get('http://localhost:3000/api/friends');
//     friends.value = response.data;
//   } catch (error) {
//     console.error("Failed to fetch friends:", error);
//   }
// };

// fake data for now
const fetchFriends = () => {
  friends.value = [
    { id: 1, name: "Alice Johnson", username: "alice_j", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 2, name: "Bob Smith", username: "bob_smith", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 3, name: "Charlie Brown", username: "charlie_b", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: 4, name: "Dana Lee", username: "dana_lee", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
  ];
};


onMounted(() => {
  fetchEvent(); // Fetch the event data on mount
  fetchFriends();
});
</script>


<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

main {
  align-items: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: white;
  height: 100vh;
  overflow: scroll;
  padding: 20px;
  padding-bottom: 70px;
  box-sizing: border-box;
}

#scrollable-element {
  width: 100%;
  height: 100%;
  overflow-y: scroll;

}

/* 
h1 {
    text-align: center; */
/* Center text in the main area */
/* } */

html,
body {
  background-color: white !important;
  /* Set the background color to white */
}
</style>