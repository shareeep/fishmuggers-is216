<template>
  <div class="friend-requests">
    <h3>Friend Requests ({{ requests.length }})</h3>
    <div class="request-list">
      <div
        v-for="(request, index) in requests"
        :key="request.id"
        class="request-item"
        :style="{ animationDelay: `${index * 0.2}s` }" 
      >
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
.friend-requests {
  padding: 20px;
  color: #333;
}

h3 {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}


.request-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.request-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  width: 325px;
  opacity: 0; /* Start hidden */
  transform: scale(0.9); /* Start slightly smaller */
  animation: popFadeIn 0.4s forwards; /* Pop-in animation */
}

@keyframes popFadeIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.request-item img {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

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

.actions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 5px;
}

.accept-button {
  background-color: #FFD700;
  color: #333;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.accept-button:hover {
  background-color: #E6C200;
}

.reject-button {
  background-color: #ddd;
  color: #333;
  padding: 5px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.reject-button:hover {
  background-color: #bbb;
}
</style>
