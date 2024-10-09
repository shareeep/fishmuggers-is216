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
          <button @click="acceptRequest(request.id)">Accept</button>
          <button @click="rejectRequest(request.id)">X</button>
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
        { id: 1, name: "Jane Cooper", mutualFriends: 3, avatar: "link-to-avatar" },
        // Add more requests here...
      ],
    };
  },
  methods: {
    acceptRequest(id) {
      // Handle accepting request
    },
    rejectRequest(id) {
      // Handle rejecting request
    },
  },
};
</script>

<style scoped>
.friend-requests {
  background-color: #ffffff;
  padding: 10px;
}
.request-list {
  display: flex;
  flex-direction: column;
}
.request-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.request-item img {
  width: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
.actions {
  margin-left: auto;
}
</style>
