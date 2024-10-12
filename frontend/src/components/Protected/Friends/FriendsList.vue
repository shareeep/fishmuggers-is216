<template>
  <div class="friends-list">
    <h3>My Friends</h3>
    <div class="friends-scroll">
      <div v-for="friend in friends" :key="friend.id" class="friend-item">
        <img :src="friend.avatar" alt="Friend Avatar" />
        <p>{{ friend.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FriendsList",
  data() {
    return {
      friends: [
        { id: 1, name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
        { id: 2, name: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
        { id: 3, name: "Sam Wilson", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
        { id: 4, name: "Emily Davis", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
        { id: 5, name: "Michael Brown", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
      ],
    };
  },
};
</script>

<style scoped>
.friends-list {
  width: 100%;
  padding: 10px;    
  background-color: white;
  border-radius: 10px;
}

.friends-scroll {
  display: flex;
  overflow-x: auto; /* Allow horizontal scrolling */
  gap: 15px; /* Add some spacing between the items */
  padding: 10px 0;
}

.friend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.friend-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover; /* Ensure images are properly cropped */
}
</style>
