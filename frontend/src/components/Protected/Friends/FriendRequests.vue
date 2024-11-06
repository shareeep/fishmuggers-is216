<template>
  <div class="friend-requests">
    <h3>Friend Requests ({{ requests.length }})</h3>
    <div class="request-list">
      <div v-for="(request, index) in requests" :key="request.id" class="request-item"
        :style="{ animationDelay: `${index * 0.2}s` }">
        <img :src="request.avatar" alt="User Avatar" />
        <div class="info-container">
          <div class="details">
            <h4>{{ request.name }}</h4>
            <p>{{ request.username }}</p>
            <p>{{ request.mutualFriends }} mutual friends</p>
          </div>
          <div class="actions">
            <button @click="acceptRequest(request.id)" class="accept-button">Accept</button>
            <button @click="rejectRequest(request.id)" class="reject-button">✕</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "FriendRequests",
  props: {
    requests: {
      type: Array,
      required: true
    }
  },
  methods: {
    acceptRequest(requestId) {
      console.log("Attempting to accept request with ID:", requestId); // Log requestId
      this.$emit('accept-request', requestId);
    },
    rejectRequest(requestId) {
      console.log("Attempting to reject request with ID:", requestId); // Log requestId
      this.$emit('reject-request', requestId);
    }
  }
};
</script>

<style scoped>
/* Base Styling */
.friend-requests {
  padding: 20px;
  color: #333;
}

h3 {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* Request List */
.request-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  /* Center items when wrapping */
}

/* Request Item */
.request-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  width: 325px;
  opacity: 0;
  transform: scale(0.9);
  animation: popFadeIn 0.4s forwards;
}

@keyframes popFadeIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Request Item Image */
.request-item img {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

/* Info Container */
.info-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.details {
  flex-grow: 1;
}

.details h4 {
  font-weight: bold;
  color: #333;
  margin: 0;
}

.details p {
  color: #666;
  margin: 0;
}

/* Actions */
.actions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 5px;
}

/* Button Styles */
.accept-button,
.reject-button {
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.accept-button {
  background-color: #FFD700;
  color: #333;
}

.reject-button {
  background-color: #ddd;
  color: #333;
}

/* Hover/Active States */
.accept-button:hover,
.reject-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.accept-button:hover {
  background-color: #E6C200;
}

.reject-button:hover {
  background-color: #bbb;
}

.accept-button:active,
.reject-button:active {
  transform: scale(0.98);
}
</style>