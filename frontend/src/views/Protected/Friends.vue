<template>
  <div class="home-container">
    <!-- Navbar component -->
    <Navbar />

    <!-- Main content area with components -->
    <main id="scrollable-element">
      <h1 class="heading">Connect with Friends</h1>
      <SearchBar />
      <div style="align-items: center;">
        <FriendRequests />

        <!-- FriendsList component with popup toggle function passed down -->
        <FriendsList @popup-toggle="togglePopup" :myFriends="myFriends" :suggestedFriends="suggestedFriends" />

        <RequestsSent />
      </div> 
    </main>

    <!-- AllFriendsPopup component, visible only when showPopup is true -->
    <AllFriendsPopup v-if="showPopup" :friends="suggestedFriends" @close="togglePopup(false)" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from "firebase/auth";
import axios from 'axios';
import Navbar from '@/components/Protected/Navbar.vue';
import SearchBar from '@/components/Protected/Friends/Searchbar.vue';
import FriendRequests from '@/components/Protected/Friends/FriendRequests.vue';
import FriendsList from '@/components/Protected/Friends/FriendsList.vue';
import RequestsSent from '@/components/Protected/Friends/RequestsSent.vue';
import AllFriendsPopup from '@/components/Protected/Friends/AllFriendsPopup.vue';

import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';

// Initialize Smooth Scrollbar for main content
Scrollbar.use(OverscrollPlugin);

const showPopup = ref(false);
const friends = ref([]); // Initialize friends as an empty array
const auth = getAuth();
const allUsers = ref([]); // All fetched users
const myFriends = ref([]); // This will remain empty as per requirement
const suggestedFriends = ref([]); // Suggested friends list

// Get the current user ID from Firebase Auth
const userId = auth.currentUser ? auth.currentUser.uid : null;
console.log("Current user ID:", userId);

// Function to toggle popup visibility
function togglePopup(value) {
  showPopup.value = value;
}

// Fetch all users and add them to suggested friends
async function fetchUsers() {
  try {
    const response = await axios.get('http://localhost:3000/api/users');
    allUsers.value = response.data;

    // Set myFriends to empty and filter out the current user from suggestedFriends
    myFriends.value = []; // Keep 'My Friends' empty
    suggestedFriends.value = allUsers.value.filter(user => user.id !== userId);

    console.log("My Friends (should be empty):", myFriends.value);
    console.log("Suggested Friends (excluding current user):", suggestedFriends.value);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

onMounted(() => {
  Scrollbar.init(document.querySelector('#scrollable-element'), {
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

  fetchUsers(); // Fetch all users when the component mounts
});
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
  top: 0;
  left: 0;
  background-color: #ffffff;
  z-index: 1;
}

main {
  align-items: center; /* Center horizontally */
  margin-left: 250px;
  flex-grow: 1;
  padding: 5%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: #FCEFB4;
  height: 100vh;
  overflow: hidden;
}

#scrollable-element {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.heading {
  font-size: 2rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

</style>
