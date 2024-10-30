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
            <button class="accept-button hover:bg-[#E6C200]">Accept</button>
            <button class="reject-button">✕</button>
          </div>
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
        { id: 1, name: "Jane Cooper", username: "j-coopz", mutualFriends: 3, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
        { id: 2, name: "Daniel Matouf", username: "dani-matouf22", mutualFriends: 2, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
        { id: 3, name: "Blake Glory", username: "blakes-of-glory", mutualFriends: 4, avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
      ],
    };
  },
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
