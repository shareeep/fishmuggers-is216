<template>
  <div class="home-container">
    <!-- Interested Users Popup -->
    <InterestedUsersPopup
      v-if="showInterestedUsersPopup"
      :friends="interestedUsers"
      @close="showInterestedUsersPopup = false"
    />
    <!-- Back Button -->
    <router-link to="" class="back-button" @click.prevent="goBack">
      <img src="../../assets/images/back_arrow.png" alt="back" width="40px" />
    </router-link>
    <RSVPBar
      v-if="event"
      :event="event"
      @showSharePopup="openSharePopup"
      @seeInterestedUsers="openInterestedUsersPopup"
    />
    <main id="scrollable-element">
      <Details v-if="event" :event="event" />
      <p v-else class="loading-text">
        <img src="../../assets/images/loading4.gif" alt="Loading" class="loadinggif" />
        Fetching event details<span class="dots"></span>
      </p>
    </main>

    <ShareEventPopup
      v-if="showPopup"
      @close="showPopup = false"
      :friends="friends"
      :event="event"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import api from '@/services/api';
import Details from "@/components/Protected/Events/Details.vue";
import RSVPBar from "@/components/Protected/Events/RSVPbar.vue";
import ShareEventPopup from "@/components/Protected/Events/ShareEventPopup.vue";
import InterestedUsersPopup from "@/components/Protected/Events/InterestedUsersPopup.vue";

import { getAuth } from "firebase/auth";
const router = useRouter();

const showInterestedUsersPopup = ref(false);
const showPopup = ref(false); // For share popup
const interestedUsers = ref([]); // Holds interested users data
const event = ref(null); // Event data
const friends = ref([]); // Friends list for ShareEventPopup

const route = useRoute();
const eventId = route.params.id;

// Function to close all popups
const closeAllPopups = () => {
  showInterestedUsersPopup.value = false;
  showPopup.value = false;
};

// Open the Share Popup, closing other popups if necessary
const openSharePopup = () => {
  closeAllPopups();
  showPopup.value = true;
};

// Open the Interested Users Popup, closing other popups if necessary
const openInterestedUsersPopup = () => {
  closeAllPopups();
  fetchInterestedUsers(); // Fetch and show interested users
};

// Function to go back to the previous page
function goBack() {
  router.go(-1); // Go back to the previous page in the browser history
}

// Function to fetch event details
const fetchEvent = async () => {
  try {
    const response = await api.get(`https://fishmuggers-is216-express.onrender.com/api/events/${eventId}`);
    event.value = response.data; // Store the event data once fetched
  } catch (error) {
    console.error("Failed to fetch event:", error);
  }
};

// Function to fetch interested users for the event (using fake data)
const fetchInterestedUsers = async () => {
  try {
    // Retrieve the user IDs from the event's interestedUsers array
    const userIds = event.value.interestedUsers;

    // Fetch user details for each ID
    const responses = await Promise.all(
      userIds.map(uid => api.get(`https://fishmuggers-is216-express.onrender.com/api/users/${uid}`))
    );

    // Extract user data from each response
    interestedUsers.value = responses.map(response => response.data);

    // Show the popup with the fetched user data
    showInterestedUsersPopup.value = true;
  } catch (error) {
    console.error("Failed to fetch interested users:", error);
  }
};

// Fetch friends for the share popup
const fetchFriends = async () => {
  try {
    const auth = getAuth();
    const userUid = auth.currentUser?.uid;

    if (!userUid) {
      console.error("User is not authenticated.");
      return;
    }

    const response = await api.get(`https://fishmuggers-is216-express.onrender.com/api/events/${userUid}/friends`);
    friends.value = response.data;
  } catch (error) {
    console.error("Failed to fetch friends:", error);
  }
};

// Initial data fetch
onMounted(() => {
  fetchEvent(); // Fetch event details on mount
  fetchFriends(); // Fetch friends for share popup
});

import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
// Function to go back to the previous page

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