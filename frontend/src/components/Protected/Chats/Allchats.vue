<template>
  <div class="chat-container">
    <!-- Pass the sorted friends and the selectFriend method to FriendsList -->
    <friendsList :friends="sortedFriends" @friendSelected="selectFriend" />
    
    <!-- Pass the selected friend and fetchFriends method to the ChatPanel component -->
    <chatPanel :selectedFriend="selectedFriend" :fetchFriends="fetchFriends" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import friendsList from '@/components/Protected/Chats/FriendsList.vue';
import chatPanel from '@/components/Protected/Chats/ChatPanel.vue';
import axios from 'axios'; // For HTTP requests
import { auth } from '../../../../firebase'; // Import auth from firebase.js, not getAuth directly
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth import

const selectedFriend = ref(null);
const friends = ref([]); // Initialize empty friends array
const userUid = ref(null); // Store the Firebase UID
let pollingInterval = null; // Store interval ID for polling

// Method to handle friend selection
const selectFriend = (friend) => {
  selectedFriend.value = friend;
};

// Fetch friends and messages from the backend
const fetchFriends = async () => {
  try {
    if (userUid.value) {
      const response = await axios.get(`http://localhost:3000/api/messages/user/${userUid.value}`);
      const updatedFriends = response.data;

      friends.value = updatedFriends;

      // If there is a previously selected friend, update it to the new version from the updated friends array
      if (selectedFriend.value) {
        const updatedFriend = updatedFriends.find(friend => friend.senderUid === selectedFriend.value.senderUid);
        if (updatedFriend) {
          selectedFriend.value = updatedFriend;
        }
      } else if (updatedFriends.length > 0) {
        // Automatically select the first friend if none is selected
        selectedFriend.value = updatedFriends[0];
      }
    }
  } catch (error) {
    console.error('Error fetching friends:', error);
  }
};

// Computed property to sort friends based on the latest message timestamp
const sortedFriends = computed(() => {
  return [...friends.value].sort((a, b) => new Date(b.latest) - new Date(a.latest));
});

// Function to start polling for new messages
const startPolling = () => {
  pollingInterval = setInterval(fetchFriends, 5000); // Poll every 5 seconds
};

// Stop polling when the component is destroyed
onBeforeUnmount(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

// Listen for changes to the Firebase Auth state (get the UID)
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userUid.value = user.uid; // Set the user UID
      fetchFriends(); // Fetch the friends once the UID is available
      startPolling(); // Start polling for new messages
    } else {
      console.error('User not authenticated');
    }
  });
});
</script>


<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
}
</style>
