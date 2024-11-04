<template>
  <div class="profile-container">
    <h1>{{ user.name }}</h1>
    <img :src="user.profileImage || 'default-avatar.jpg'" alt="User Profile Image" />
    <p>{{ user.username }}</p>

    <!-- Add Friend Button -->
    <button @click="sendFriendRequest" class="add-friend-button" :disabled="requestSent">
      {{ requestSent ? 'Request Sent' : 'Add Friend' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';
import { getAuth } from 'firebase/auth';

export default {
  props: ['id'], // The ID of the profile being viewed
  data() {
    return {
      user: {},         // User details
      requestSent: false, // Tracks whether a friend request has been sent
    };
  },
  async mounted() {
    try {
      // Fetch user profile data based on the `id` prop
      const response = await axios.get(`http://localhost:3000/api/users/profile/${this.id}`);
      this.user = response.data;

      // Check if a friend request has already been sent to this user
      await this.checkFriendRequest();
    } catch (error) {
      console.error("Error fetching user profile:", error.response ? error.response.data : error.message);
    }
  },
  methods: {
    async checkFriendRequest() {
      try {
        const auth = getAuth();
        const senderId = auth.currentUser?.uid;

        if (!senderId) {
          console.error("User is not authenticated.");
          return;
        }

        // Check if a friend request already exists for this user
        const response = await axios.get(`http://localhost:3000/api/friends/requests/${this.id}`);
        
        // Set `requestSent` to true if a pending request exists
        if (response.data.some(request => request.senderId === senderId && request.status === "pending")) {
          this.requestSent = true;
        }
      } catch (error) {
        console.error("Error checking friend request:", error.response ? error.response.data : error.message);
      }
    },
    async sendFriendRequest() {
      try {
        const auth = getAuth();
        const senderId = auth.currentUser?.uid; // Get the authenticated user ID
        const receiverId = this.id; // Use the `id` prop as receiverId

        if (!senderId || !receiverId) {
          console.error("Missing senderId or receiverId");
          return;
        }

        // Send the friend request
        await axios.post('http://localhost:3000/api/friends/request', {
          senderId,
          receiverId,
        });

        this.requestSent = true; // Mark request as sent to disable button for this specific user
      } catch (error) {
        console.error("Error sending friend request:", error.response ? error.response.data : error.message);
        alert("Failed to send friend request. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.profile-container {
  text-align: center;
  padding: 20px;
}

img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.add-friend-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.add-friend-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.add-friend-button:hover:enabled {
  background-color: #45a049;
}
</style>