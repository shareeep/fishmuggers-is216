<template>
  <div class="home-container">
      <!-- Navbar component -->
      <Navbar />

      <!-- Main content area with components -->
      <main id="scrollable-element">
          <h1 class="heading">Connect with Friends</h1>
          <SearchBar />
          <div style="align-items: center;">
              <FriendRequests :requests="receivedRequests" @accept-request="handleAcceptRequest"
                  @reject-request="handleRejectRequest" />

              <!-- FriendsList component with popup toggle function passed down -->
              <FriendsList @popup-toggle="togglePopup" :myFriends="myFriends" :suggestedFriends="suggestedFriends" />

              <RequestsSent :sentRequests="sentRequests" @updateSentRequests="removeSentRequest" />
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
const sentRequests = ref([]);
const receivedRequests = ref([]);

// Get the current user ID from Firebase Auth
const userId = auth.currentUser ? auth.currentUser.uid : null;
console.log("Current user ID:", userId);

// Function to toggle popup visibility
function togglePopup(value) {
  showPopup.value = value;
}

async function fetchReceivedRequests() {
  try {
      const response = await axios.get(`http://localhost:3000/api/friends/requests/${userId}`);
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
      await axios.put(`http://localhost:3000/api/friends/request/accept/${requestId}`);

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
      await axios.put(`http://localhost:3000/api/friends/request/reject/${requestId}`);
      receivedRequests.value = receivedRequests.value.filter(request => request.id !== requestId);
      console.log("Friend request rejected successfully");
  } catch (error) {
      console.error("Error rejecting friend request:", error);
  }
}

async function fetchMyFriends() {
  try {
      const response = await axios.get(`http://localhost:3000/api/friends/${userId}`);

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
      const response = await axios.get('http://localhost:3000/api/users');
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
      const response = await axios.get(`http://localhost:3000/api/friends/requests/sent/${userId}`);
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
  sentRequests.value = sentRequests.value.filter(request => request.requestId !== requestId);
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
  fetchSentRequests(); // Fetch sent requests when the component mounts
  fetchReceivedRequests();
  fetchMyFriends();
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
  align-items: center;
  /* Center horizontally */
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
