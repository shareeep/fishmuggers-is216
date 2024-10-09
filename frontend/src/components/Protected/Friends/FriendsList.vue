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
        { id: 1, name: "Jerome", avatar: "link-to-avatar" },
        { id: 2, name: "Jerome2", avatar: "link-to-avatar" },
        { id: 3, name: "Jerome3", avatar: "link-to-avatar" }
      ],
    };
  },
};
</script>

<style scoped>
.friends-scroll {
  display: flex;
}
.friend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
}
.friend-item img {
  width: 50px;
  border-radius: 50%;
}
</style>
