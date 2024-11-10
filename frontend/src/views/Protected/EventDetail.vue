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

import axios from "axios";
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
    const response = await axios.get(`http://localhost:3000/api/events/${eventId}`);
    event.value = response.data; // Store the event data once fetched
  } catch (error) {
    console.error("Failed to fetch event:", error);
  }
};

// Function to fetch interested users for the event (using fake data)
const fetchInterestedUsers = async () => {
  try {
    // Fake data for interested users
    const fakeData = [
      { id: "user1", name: "Alice Johnson", username: "alice_j", profileImage: "https://via.placeholder.com/50" },
      { id: "user2", name: "Bob Smith", username: "bob_smith", profileImage: "https://via.placeholder.com/50" },
      { id: "user3", name: "Charlie Brown", username: "charlie_b", profileImage: "https://via.placeholder.com/50" },
      { id: "user4", name: "Daisy Ridley", username: "daisy_r", profileImage: "https://via.placeholder.com/50" },
    ];

    interestedUsers.value = fakeData;
    showInterestedUsersPopup.value = true; // Show the popup
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

    const response = await axios.get(`http://localhost:3000/api/events/${userUid}/friends`);
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