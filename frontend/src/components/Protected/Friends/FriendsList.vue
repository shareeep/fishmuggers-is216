<template>
  <div class="friends-list">
    <div class="header">
      <h3>My Friends</h3>
      <!-- Button to open the popup -->
      <button @click="showPopup = true" class="see-all">See All</button>
    </div>

    <AllFriendsPopup v-if="showPopup" :friends="friends" @close="showPopup = false" />
    <div class="friends-scroll">
      <!-- Display only the first 9 friends -->
      <div v-for="friend in limitedFriends" :key="friend.id" class="friend-item">
        <img :src="friend.avatar" alt="Friend Avatar" />
        <p class="friend-name">{{ friend.name }}</p>
        <p class="friend-username">{{ friend.username }}</p>
      </div>
    </div>

  </div>
</template>

<script>
import AllFriendsPopup from '@/components/Protected/Friends/AllFriendsPopup.vue';
export default {
  components: { AllFriendsPopup },
  name: "FriendsList",
  data() {
    return {
      showPopup: false,
      friends: [
        { id: 1, name: "Jerome", username: "jerome-with-a-j", avatar: "https://randomuser.me/api/portraits/men/10.jpg" },
        { id: 2, name: "Becky Gianani", username: "becky-gee", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
        { id: 3, name: "Lauren Moore", username: "lauren-moore", avatar: "https://randomuser.me/api/portraits/women/18.jpg" },
        { id: 4, name: "Brad Garner", username: "bradgarner", avatar: "https://randomuser.me/api/portraits/men/17.jpg" },
        { id: 5, name: "Zafira Bee", username: "zafira-bee", avatar: "https://randomuser.me/api/portraits/men/14.jpg" },
        { id: 6, name: "Tim Double-U", username: "tim-double-u", avatar: "https://randomuser.me/api/portraits/men/19.jpg" },
        { id: 7, name: "Georgia Plué", username: "gee-plue", avatar: "https://randomuser.me/api/portraits/women/20.jpg" },
        { id: 8, name: "Alex Johnson", username: "alex-j", avatar: "https://randomuser.me/api/portraits/men/23.jpg" },
        { id: 9, name: "Samantha Rose", username: "sam-rose", avatar: "https://randomuser.me/api/portraits/women/25.jpg" },
        { id: 10, name: "Chris Lee", username: "chris-lee", avatar: "https://randomuser.me/api/portraits/men/29.jpg" },
        { id: 11, name: "Emily Nguyen", username: "em-nguyen", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
        { id: 12, name: "Michael Tan", username: "mike-tan", avatar: "https://randomuser.me/api/portraits/men/35.jpg" },
      ],
    };
  },
  computed: {
    limitedFriends() {
      // Show only the first 9 friends
      return this.friends.slice(0, 8);
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.friends-list {
  padding: 20px;
}

h3 {
  font-weight: bold;
  color: #333;
}

.friends-scroll {
  display: flex;
  gap: 30px;
  overflow-x: auto;
  padding: 10px 0;
}

.friend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.friend-item img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.friend-name {
  font-weight: bold;
  color: #333;
  font-size: 1rem;
  margin-top: 10px;
}

.friend-username {
  color: #777;
  font-size: 0.85rem;
}

.see-more-button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #FFD700;
  color: #333;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.see-all {
  color:#7B61FF;
  cursor: pointer; /* Adds a pointer cursor for better UX */
  font-weight:350;
}

.see-all:hover {
  color: #5A45D6; /* A slightly darker shade for the hover effect */
  font-weight: 500; /* Slightly increase the weight on hover, if desired */
  text-decoration: underline; /* Optional: Add underline on hover */
}

.see-more-button:hover {
  background-color: #E6C200;
}
</style>
