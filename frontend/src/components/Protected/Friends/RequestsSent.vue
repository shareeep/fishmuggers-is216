<template>
  <div class="requests-sent">
    <h3>Requests Sent ({{ sentRequests.length }})</h3>
    <div class="request-list">
      <div v-for="request in sentRequests" :key="request.id" class="request-item">
        <img :src="request.avatar" alt="User Avatar" />
        <div class="details">
          <h4>{{ request.name }}</h4>
          <p>Sent {{ request.daysAgo }} days ago</p>
        </div>
        <div class="actions">
          <button @click="cancelRequest(request.id)" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RequestsSent",
  data() {
    return {
      sentRequests: [
        {
          id: 1,
          name: "Glen Archer",
          avatar: "https://randomuser.me/api/portraits/men/8.jpg",
          daysAgo: 2,
        },
        {
          id: 2,
          name: "Dani Smith",
          avatar: "https://randomuser.me/api/portraits/women/6.jpg",
          daysAgo: 21,
        },
        {
          id: 3,
          name: "Robby Fox",
          avatar: "https://randomuser.me/api/portraits/men/9.jpg",
          daysAgo: 30,
        },
      ],
    };
  },
  methods: {
    cancelRequest(id) {
      console.log("Cancel request with ID:", id);
      // Implement logic to cancel the request (call API or update state)
    },
  },
};
</script>

<style scoped>
.requests-sent {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 8px;
  margin-top: 20px; /* Add spacing from previous section */
}

.request-list {
  display: flex;
  flex-direction: row;
  gap: 15px; /* Add spacing between items */
  overflow-x: auto; /* Allows horizontal scrolling if content overflows */
  padding: 10px 0;
}

.request-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd; /* Add border for separation */
  border-radius: 8px;
  background-color: #f9f9f9;
  min-width: 250px; /* Adjust to fit the layout and make it more similar to friend requests */
  flex-shrink: 0; /* Prevent items from shrinking */
}

.request-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover; /* Ensure images are cropped properly */
}

.details {
  flex-grow: 1;
}

.actions {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px; /* Add spacing between buttons */
}

.cancel-button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f44336; /* Red color for cancel button, consistent with reject button */
  color: #ffffff;
}

.cancel-button:hover {
  background-color: #e53935; /* Darker shade on hover */
}

h3 {
  color: #333; /* Set text color for the heading */
}
</style>
