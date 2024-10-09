<template>
  <div class="friend-requests">
    <h3>Friend Requests (3)</h3>
    <div class="request-list">
      <div v-for="request in requests" :key="request.id" class="request-item">
        <img :src="request.avatar" alt="User Avatar" />
        <div class="details">
          <h4>{{ request.name }}</h4>
          <p>{{ request.mutualFriends }} mutual friends</p>
        </div>
        <div class="actions">
          <button @click="acceptRequest(request.id)" class="accept-button">Accept</button>
          <button @click="rejectRequest(request.id)" class="reject-button">Reject</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FriendRequests",
  data() {
    return {
      requests: [
        { id: 1, name: "Jane Cooper", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
        { id: 2, name: "John Smith", mutualFriends: 5, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
        { id: 3, name: "Emily Stone", mutualFriends: 2, avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
      ],
    };
  },
  methods: {
    acceptRequest(id) {
      // Handle accepting request
      console.log(`Accepted request with id: ${id}`);
    },
    rejectRequest(id) {
      // Handle rejecting request
      console.log(`Rejected request with id: ${id}`);
    },
  },
};
</script>

<style scoped>
.friend-requests {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 8px; /* Adding a border radius for a cleaner look */
}

.request-list {
  display: flex;
  flex-direction: row; /* Arrange friend requests in a row, from left to right */
  gap: 15px; /* Add some spacing between each request */
  overflow-x: auto; /* Allow horizontal scrolling if requests overflow */
  padding: 10px 0;
}

.request-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd; /* Adding a border for separation */
  border-radius: 8px;
  background-color: #f9f9f9;
  min-width: 200px; /* Set a minimum width to ensure proper sizing of each item */
  flex-shrink: 0; /* Prevent items from shrinking */
}

.request-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover; /* Make sure images fit nicely */
}

.details {
  flex-grow: 1;
}

.actions {
  margin-left: 10px; /* Add spacing between details and buttons */
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  gap: 5px; /* Space between buttons */
}

.accept-button,
.reject-button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.accept-button {
  background-color: #4caf50; /* Green color for accept button */
  color: #ffffff;
}

.reject-button {
  background-color: #f44336; /* Red color for reject button */
  color: #ffffff;
}

.accept-button:hover {
  background-color: #45a049; /* Darker shade on hover */
}

.reject-button:hover {
  background-color: #e53935; /* Darker shade on hover */
}
</style>
