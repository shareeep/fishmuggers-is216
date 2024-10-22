<template>
  <div class="chat-container">
    <!-- Pass the list of friends and the selectFriend method to FriendsList -->
    <friendsList :friends="friends" @friendSelected="selectFriend" />
    
    <!-- Pass the selected friend to the ChatPanel component -->
    <chatPanel :selectedFriend="selectedFriend" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import friendsList from '@/components/Protected/Chats/FriendsList.vue';
import chatPanel from '@/components/Protected/Chats/ChatPanel.vue';
import axios from 'axios'; // Import axios for HTTP requests
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth import

const selectedFriend = ref(null);
const friends = ref([]); // Initialize empty friends array
const userUid = ref(null); // Store the Firebase UID


// Method to handle friend selection
const selectFriend = (friend) => {
  selectedFriend.value = friend;
};

// Fetch friends and messages from the backend
const fetchFriends = async () => {
  try {
    // Only make the API call if the user UID is available
    if (userUid.value) {
      const response = await axios.get(`http://localhost:3000/api/messages/user/${userUid.value}`); // Replace with your actual API endpoint
      friends.value = response.data;

      // Automatically select the first friend after fetching the list
      if (friends.value.length > 0) {
        selectedFriend.value = friends.value[0]; // Select the first friend by default
      }
    }
  } catch (error) {
    console.error('Error fetching friends:', error);
  }
};

// Listen for changes to the Firebase Auth state (get the UID)
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userUid.value = user.uid; // Set the user UID
      fetchFriends(); // Fetch the friends once the UID is available
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
