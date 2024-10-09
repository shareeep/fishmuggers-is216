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
          <button @click="cancelRequest(request.id)">Cancel</button>
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
  background-color: #222;
  padding: 10px;
  border-radius: 8px;
  margin-top: 20px;
}
.request-list {
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow-x: auto; /* Allows horizontal scrolling if content overflows */
  padding: 10px 0;
}
.request-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #333;
  border-radius: 8px;
  color: white;
  min-width: 150px; /* Adjust as needed for layout */
}
.request-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 10px;
}
.details {
  text-align: center;
}
.actions {
  margin-top: 10px;
}
button {
  padding: 6px 12px;
  border: none;
  background-color: #f39c12;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #e67e22;
}

h3{
    color:white;
}
</style>
