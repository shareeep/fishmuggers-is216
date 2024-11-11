<template>
  <div class="home-container">
    <!-- Navbar component -->
    <Navbar />
    <!-- Main content area with components -->
    <main id="scrollable-element">
      <div style="margin-top:40px;">
        <h1 class="heading">Connect with Friends</h1>
        <div class="search-bar-container">
          <SearchBar :fetchedUsers="filteredFriends" @search-query="filterFriends" />
        </div>

        <SearchedUsers v-if="searchQuery.length > 0" :users="filteredFriends" />


      </div>

      <div v-if="loading" class="loading-container">
        <p class="loading-text">
          <img src="../../assets/images/loading1.gif" alt="Loading" class="loadinggif" />
          Fetching your friends<span class="dots"></span>
        </p>
      </div>
      <div v-else style="align-items: center;">
        <div class="friend-requests-container">
          <FriendRequests :requests="receivedRequests" @accept-request="handleAcceptRequest"
            @reject-request="handleRejectRequest" />
        </div>
        <div class="friends-list">
          <!-- FriendsList component with popup toggle function passed down -->
          <FriendsList @popup-toggle="togglePopup" :myFriends="myFriends" :suggestedFriends="suggestedFriends" />
        </div>
        <div class="requests-sent-container">
          <RequestsSent :sentRequests="sentRequests" @updateSentRequests="removeSentRequest" />
        </div>
      </div>
    </main>

    <!-- AllFriendsPopup component, visible only when showPopup is true -->
    <AllFriendsPopup v-if="showPopup" :friends="myFriends" @close="togglePopup(false)" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from "firebase/auth";
import api from '@/services/api';
import Navbar from '@/components/Protected/Navbar.vue';
import SearchBar from '@/components/Protected/Friends/Searchbar.vue';
import FriendRequests from '@/components/Protected/Friends/FriendRequests.vue';
import FriendsList from '@/components/Protected/Friends/FriendsList.vue';
import RequestsSent from '@/components/Protected/Friends/RequestsSent.vue';
import AllFriendsPopup from '@/components/Protected/Friends/AllFriendsPopup.vue';
import SearchedUsers from '@/components/Protected/Friends/SearchedUsers.vue';


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
const sentRequests = ref([]);
const receivedRequests = ref([]);
const loading = ref(true); // Initialize loading as true


// Get the current user ID from Firebase Auth
const userId = auth.currentUser ? auth.currentUser.uid : null;
console.log("Current user ID:", userId);


// Wrap data fetching in a function that updates the loading state once all are complete
async function fetchData() {
  try {
    await Promise.all([
      fetchUsers(),
      fetchSentRequests(),
      fetchReceivedRequests(),
      fetchMyFriends(),
    ]);
    loading.value = false; // Set loading to false once data has loaded
  } catch (error) {
    console.error("Error loading data:", error);
    loading.value = false; // Ensure loading stops in case of error
  }
}
const searchQuery = ref(""); // Track search input dynamically

// Filtered list of friends based on search input
const filteredFriends = ref([]);

function filterFriends(query) {
  searchQuery.value = query;  // Update searchQuery directly

  // Clear results if query is empty or only one character
  if (query.trim() === "" || query.length <= 0) {
    filteredFriends.value = [];
  } else {
    // Filter through allUsers for matching results
    filteredFriends.value = allUsers.value
      .filter(user => user.username && user.username.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 8); // Limit results to the first 8 matches
  }
}


// Function to toggle popup visibility
function togglePopup(value) {
  showPopup.value = value;
}

async function fetchReceivedRequests() {
  try {
    const response = await api.get(`/api/friends/requests/${userId}`);
    receivedRequests.value = response.data.map(request => ({
      id: request.requestId,
      senderId: request.senderId,
      name: request.name,
      username: request.username,
      avatar: request.avatar || 'default-avatar.jpg',
      mutualFriends: request.mutualFriends, // This now includes mutual friend count from the backend
    }));
  } catch (error) {
    console.error("Error fetching received friend requests:", error);
  }
}

async function handleAcceptRequest(requestId) {
  console.log("Received accept-request event with ID:", requestId);
  try {
    // Send request to backend to accept friend
    await api.put(`/api/friends/request/accept/${requestId}`);

    // Find the accepted friend in `receivedRequests`
    const acceptedFriend = receivedRequests.value.find(request => request.id === requestId);
    console.log("Accepted friend data:", acceptedFriend); // Log acceptedFriend details

    if (acceptedFriend) {
      // Add accepted friend to `myFriends`
      myFriends.value.push({
        id: acceptedFriend.senderId, // Assuming senderId is the friend's ID
        name: acceptedFriend.name,
        username: acceptedFriend.username,
        profileImage: acceptedFriend.avatar,
      });

      console.log("Updated myFriends list after accepting:", myFriends.value); // Log myFriends

      // Remove from `receivedRequests`
      receivedRequests.value = receivedRequests.value.filter(request => request.id !== requestId);
    }

    console.log("Friend request accepted successfully and friend added to myFriends");
  } catch (error) {
    console.error("Error accepting friend request:", error);
  }
}

async function handleRejectRequest(requestId) {
  console.log("Received reject-request event with ID:", requestId);
  try {
    await api.put(`/api/friends/request/reject/${requestId}`);
    receivedRequests.value = receivedRequests.value.filter(request => request.id !== requestId);
    console.log("Friend request rejected successfully");
  } catch (error) {
    console.error("Error rejecting friend request:", error);
  }
}

async function fetchMyFriends() {
  try {
    const response = await api.get(`/api/friends/${userId}`);

    // Map the response to myFriends
    myFriends.value = response.data.map(friend => ({
      id: friend.id,
      name: friend.name,
      username: friend.username,
      profileImage: friend.profileImage || 'default-avatar.jpg',
    }));
    console.log("Mapped myFriends:", myFriends.value); // Log mapped friends
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
}



// Fetch all users and add them to suggested friends
async function fetchUsers() {
  try {
    const response = await api.get('/api/users')
    allUsers.value = response.data;

    // Fetch `myFriends` first to ensure the list is up-to-date
    await fetchMyFriends();

    // Filter suggestedFriends to exclude users already in myFriends
    suggestedFriends.value = allUsers.value.filter(user =>
      user.id !== userId && !myFriends.value.some(friend => friend.id === user.id)
    );

    console.log("Suggested Friends (excluding current friends):", suggestedFriends.value);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

async function fetchSentRequests() {
  try {
    const response = await api.get(`/api/friends/requests/sent/${userId}`);
    console.log("Fetched sent requests from backend:", response.data);

    sentRequests.value = response.data.map(request => {
      const user = allUsers.value.find(user => user.id === request.receiverId);
      return {
        ...request,
        name: user ? user.name : 'Unknown',
        username: user ? user.username : '',
        avatar: user ? user.profileImage || 'default-avatar.jpg' : 'default-avatar.jpg',
        daysAgo: calculateDaysAgo(request.createdAt),
      };
    });
  } catch (error) {
    console.error("Error fetching sent friend requests:", error);
  }
}

function calculateDaysAgo(timestamp) {
  console.log("Raw timestamp:", timestamp); // Log the exact format of the timestamp

  let createdAt;

  // Parse Firestore Timestamp (with _seconds and _nanoseconds)
  if (timestamp && typeof timestamp._seconds === 'number') {
    createdAt = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
    console.log("Parsed Firestore Timestamp:", createdAt); // Log the parsed Firestore timestamp
  } else {
    console.warn("Unrecognized timestamp format");
    return "Unknown";
  }

  const now = new Date();
  const differenceInTime = now - createdAt;
  const daysAgo = Math.floor(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days

  // Return custom labels based on the number of days ago
  if (daysAgo === 0) {
    return "Sent today";
  } else if (daysAgo === 1) {
    return "Yesterday";
  } else {
    return `${daysAgo} days ago`;
  }
}

function removeSentRequest(requestId) {
  sentRequests.value = sentRequests.value.filter(request => request.id !== requestId);
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

  fetchData();
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  /* Ensures it takes full height of the viewport */
}

.loading-text {
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 10px;
}

.loadinggif {
  margin-right: -30px;
  width: 200px;
  /* Adjust the width as desired */
}

.dots::after {
  content: '';
  display: inline-block;
  width: 1em;
  animation: ellipsis 1.5s infinite;
}

@keyframes ellipsis {
  0% {
    content: '';
  }

  33% {
    content: '.';
  }

  66% {
    content: '..';
  }

  100% {
    content: '...';
  }
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


/* Responsive Adjustments */
@media (max-width: 991px) {
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
  .home-container {
    flex-direction: column;
    padding-bottom: 50px;
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

@media (max-width: 375px) {
  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    padding-bottom: 60px;
  }

  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    box-sizing: border-box;
    overflow-y: auto;
    margin-bottom: -20px;

  }

  /* Center and constrain width of heading */
  .heading {
    font-size: 1.2rem;
    /* Adjust font size for smaller screens */
    text-align: center;
    margin: 10px 0;
    max-width: 350px;
  }

  /* Center SearchBar container */
  .search-filter-container {
    width: 100%;
    max-width: 350px;
    /* Constrain max width for small screens */
    margin: 0 auto;
    text-align: center;
    transform: scale(0.9);
  }

  /* Center the FriendsList container */
  .friends-list {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    text-align: center;
  }

  /* Adjust loading container for centering */
  .loading-container {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left:-20px;
  }

  /* Center the content container with friend requests */
  .content-container,
  .friend-requests-container,
  .searched-users-container,
  .requests-sent-container {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    padding-top: 20px;
    text-align: center;
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
}
</style>