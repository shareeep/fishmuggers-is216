<template>
  <div class="profile-container">
    <h1>{{ user.name }}</h1>
    <img :src="user.profileImage || 'default-avatar.jpg'" alt="User Profile Image" />
    <p>{{ user.username }}</p>

    <!-- Conditional Buttons for Friend Status -->
    <div v-if="isFriend">
      <button @click="removeFriend" class="remove-friend-button">
        Remove Friend
      </button>
    </div>
    <div v-else-if="hasPendingRequest">
      <button @click="acceptFriendRequest" class="accept-friend-button">
        Accept Request
      </button>
      <button @click="deleteFriendRequest" class="delete-request-button">
        Delete Request
      </button>
    </div>
    <button v-else @click="sendFriendRequest" class="add-friend-button" :disabled="requestSent">
      {{ requestSent ? 'Friend Request Sent' : 'Add Friend' }}
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
      user: {},              // User details
      isFriend: false,       // Tracks if the user is already a friend
      requestSent: false,    // Tracks if a friend request has been sent by the current user
      hasPendingRequest: false, // Tracks if there is a pending request from the viewed user
      requestId: null,       // Stores the requestId for accepting/deleting the request
    };
  },
  async mounted() {
    try {
      // Fetch user profile data based on the `id` prop
      const response = await axios.get(`http://localhost:3000/api/users/profile/${this.id}`);
      this.user = response.data;

      // Reset states before checking
      this.isFriend = false;
      this.requestSent = false;
      this.hasPendingRequest = false;
      this.requestId = null;

      // Check if the user is already a friend or has a pending request (from either side)
      await this.checkFriendStatus();
      await this.checkIncomingRequest();  // For receiver's POV

      console.log("Friend status after check:", {
        isFriend: this.isFriend,
        requestSent: this.requestSent,
        hasPendingRequest: this.hasPendingRequest,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error.response ? error.response.data : error.message);
    }
  },

  methods: {
    async checkFriendStatus() {
      try {
        const auth = getAuth();
        const currentUserId = auth.currentUser?.uid;

        if (!currentUserId) {
          console.error("User is not authenticated.");
          return;
        }

        // Fetch the current user's friends list and check if this profile user is a friend
        const response = await axios.get(`http://localhost:3000/api/friends/${currentUserId}`);
        this.isFriend = response.data.some(friend => friend.id === this.id);

        // If not a friend, check if there is a pending friend request
        if (!this.isFriend) {
          await this.checkFriendRequest();
        }
      } catch (error) {
        console.error("Error checking friend status:", error.response ? error.response.data : error.message);
      }
    },

    async checkFriendRequest() {
      try {
        const auth = getAuth();
        const currentUserId = auth.currentUser?.uid;

        if (!currentUserId) {
          console.error("User is not authenticated.");
          return;
        }

        // Fetch all requests where the current user is involved as the sender
        const response = await axios.get(`http://localhost:3000/api/friends/requests/sent/${currentUserId}`);

        // Check if a pending request exists with the viewed user
        const existingRequest = response.data.find(
          request => request.receiverId === this.id && request.status === "pending"
        );

        if (existingRequest) {
          this.requestSent = true;
          this.requestId = existingRequest.requestId; // Store request ID for any actions
          console.log("Pending friend request found. requestSent set to true.");
        } else {
          this.requestSent = false;
          console.log("No pending friend request found.");
        }
      } catch (error) {
        console.error("Error checking friend request:", error.response ? error.response.data : error.message);
      }
    },

    async checkIncomingRequest() {
      try {
        const auth = getAuth();
        const currentUserId = auth.currentUser?.uid;

        if (!currentUserId) {
          console.error("User is not authenticated.");
          return;
        }

        // Fetch all requests where the current user is the receiver
        const response = await axios.get(`http://localhost:3000/api/friends/requests/${currentUserId}`);

        // Check if there is a pending friend request from the profile user to the current user
        const incomingRequest = response.data.find(
          request => request.senderId === this.id && request.status === "pending"
        );

        if (incomingRequest) {
          this.hasPendingRequest = true;
          this.requestId = incomingRequest.requestId; // Store the request ID for accept/reject actions
          console.log("Incoming friend request found from this user.");
        } else {
          this.hasPendingRequest = false;
          console.log("No incoming friend request found from this user.");
        }
      } catch (error) {
        console.error("Error checking incoming friend request:", error.response ? error.response.data : error.message);
      }
    },

    async sendFriendRequest() {
      try {
        const auth = getAuth();
        const senderId = auth.currentUser?.uid;
        const receiverId = this.id;

        if (!senderId || !receiverId) {
          console.error("Missing senderId or receiverId");
          return;
        }

        // Send the friend request
        const response = await axios.post('http://localhost:3000/api/friends/request', {
          senderId,
          receiverId,
        });

        // Set requestSent to true to reflect "Friend Request Sent"
        this.requestSent = true;
        this.requestId = response.data.request.requestId; // Store the request ID
        console.log("Friend request sent, request ID:", this.requestId);
      } catch (error) {
        console.error("Error sending friend request:", error.response ? error.response.data : error.message);
        alert("Failed to send friend request. Please try again.");
      }
    },

    async acceptFriendRequest() {
      try {
        if (!this.requestId) {
          console.error("No request ID found to accept the request.");
          return;
        }

        // Accept the friend request in the backend
        await axios.put(`http://localhost:3000/api/friends/request/accept/${this.requestId}`);

        // Update the UI state
        this.isFriend = true;
        this.hasPendingRequest = false;
      } catch (error) {
        console.error("Error accepting friend request:", error.response ? error.response.data : error.message);
        alert("Failed to accept friend request. Please try again.");
      }
    },

    async deleteFriendRequest() {
      try {
        if (!this.requestId) {
          console.error("No request ID found to delete the request.");
          return;
        }

        // Delete the friend request in the backend
        await axios.delete(`http://localhost:3000/api/friends/request/${this.requestId}`);

        // Update the UI state
        this.hasPendingRequest = false;
        this.requestSent = false;
      } catch (error) {
        console.error("Error deleting friend request:", error.response ? error.response.data : error.message);
        alert("Failed to delete friend request. Please try again.");
      }
    },

    async removeFriend() {
      try {
        const auth = getAuth();
        const currentUserId = auth.currentUser?.uid;
        const friendId = this.id;

        if (!currentUserId || !friendId) {
          console.error("Missing user ID or friend ID.");
          return;
        }

        // Call the backend to remove the friend relationship
        await axios.delete(`http://localhost:3000/api/friends/${currentUserId}/remove/${friendId}`);

        // Update the state to reflect removal
        this.isFriend = false; // Update the state to show "Add Friend" button
      } catch (error) {
        console.error("Error removing friend:", error.response ? error.response.data : error.message);
        alert("Failed to remove friend. Please try again.");
      }
    }
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

.add-friend-button,
.accept-friend-button,
.delete-request-button,
.remove-friend-button {
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.add-friend-button {
  background-color: #4CAF50;
  color: white;
}

.accept-friend-button {
  background-color: #4CAF50;
  color: white;
}

.delete-request-button {
  background-color: #FF6666;
  color: white;
}

.remove-friend-button {
  background-color: #FF6666;
  color: white;
}

.add-friend-button:disabled,
.accept-friend-button:disabled,
.delete-request-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.accept-friend-button:hover {
  background-color: #45a049;
}

.delete-request-button:hover,
.remove-friend-button:hover {
  background-color: #FF3333;
}
</style>