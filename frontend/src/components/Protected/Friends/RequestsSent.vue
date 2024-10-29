<template>
  <div class="requests-sent">
    <h3>Requests Sent ({{ sentRequests.length }})</h3>
    <div class="request-list">
      <div v-for="(request,index) in sentRequests" :key="request.id" class="request-item"
        :style="{ animationDelay: `${index * 0.2}s` }">
        <img :src="request.avatar" alt="User Avatar" />
        <div class="info-container">
          <div class="details">
            <h4>{{ request.name }}</h4>
            <p>{{ request.username }}</p>
            <p>{{ request.daysAgo }} days ago</p>
          </div>
          <div class="actions">
            <button class="cancel-button">✕ Cancel</button>
          </div>
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
        { id: 1, name: "Glen Archer", username: "gee-arch-r", avatar: "https://randomuser.me/api/portraits/men/5.jpg", daysAgo: 2 },
        { id: 2, name: "Dani Smith", username: "deesmiffy", avatar: "https://randomuser.me/api/portraits/women/8.jpg", daysAgo: 21 },
        { id: 3, name: "Robby Fox", username: "robby-fox", avatar: "https://randomuser.me/api/portraits/men/12.jpg", daysAgo: 30 },
      ],
    };
  },
};
</script>

<style scoped>
@keyframes popFadeIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.requests-sent {
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
  background-color: #fff;
  border-radius: 15px;
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

.cancel-button {
  background-color: #ddd;
  color: #333;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #bbb;
}
</style>
