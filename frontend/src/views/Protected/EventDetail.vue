<template>
  <div class="home-container">
    <!-- Back Button -->
    <router-link to="" class="back-button" @click.prevent="goBack">
      <img src="../../assets/images/back_arrow.png" alt="back" width="40px" />
    </router-link>
    <RSVPBar v-if="event" :event="event" @showSharePopup="showPopup = true" />
    <main id="scrollable-element">

      <Details v-if="event" :event="event" />
      <p v-else class="loading-text">
        <img src="../../assets/images/loading4.gif" alt="Loading" class="loadinggif" />
        Fetching event details<span class="dots"></span>
      </p>
    </main>

    <ShareEventPopup v-if="showPopup" @close="showPopup = false" :friends="friends" :event="event" />

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import axios from "axios";
import Details from "@/components/Protected/Events/Details.vue";
import RSVPBar from "@/components/Protected/Events/RSVPbar.vue";
import ShareEventPopup from "@/components/Protected/Events/ShareEventPopup.vue";
import { getAuth } from "firebase/auth";
const router = useRouter(); // Get the router instance

import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
// Function to go back to the previous page
function goBack() {
  router.go(-1); // Go back to the previous page in the browser history
}
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

const fetchFriends = async () => {
  try {
    // Get the authenticated user's UID
    const auth = getAuth();
    const userUid = auth.currentUser?.uid;

    if (!userUid) {
      console.error("User is not authenticated.");
      return;
    }

    // Make the request with the user's UID
    const response = await axios.get(`http://localhost:3000/api/events/${userUid}/friends`);
    friends.value = response.data;
  } catch (error) {
    console.error("Failed to fetch friends:", error);
  }
};


onMounted(() => {
  fetchEvent(); // Fetch the event data on mount
  fetchFriends();
});
</script>


<style scoped>
.back-button {
  position: fixed;
  /* Fixes the position relative to the viewport */
  top: 20px;
  /* Adjusts distance from the top */
  left: 10px;
  /* Adjusts distance from the left */
  z-index: 1000;
  /* Ensures it stays above other content */
  padding: 5px;
  transition: transform 0.2s ease;
}

.back-button img {
  width: 40px;
}

.back-button:hover {
  transform: scale(1.1);
  /* Slightly enlarges on hover */
}


.loadinggif {
  width: 400px;
}

.loading-text {
  font-size: 1.2rem;
  text-align: center;
  margin-top: 70px;
  font-weight: bold;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.dots::after {
  content: '';
  display: inline-block;
  width: 1em;
  animation: ellipsis 1.5s infinite;
}

@keyframes ellipsis {
  0% {
    content: "";
  }

  33% {
    content: ".";
  }

  66% {
    content: "..";
  }

  100% {
    content: "...";
  }
}

@keyframes ellipsis {
  0% {
    content: "";
  }

  25% {
    content: ".";
  }

  50% {
    content: "..";
  }

  75% {
    content: "...";
  }
}

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