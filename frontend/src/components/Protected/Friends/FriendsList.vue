<template>
  <div class="friends-list">
      <div class="header">
          <h3>My Friends</h3>
          <!-- Button to open the popup -->
          <button @click="$emit('popup-toggle', true)" class="see-all">View All</button>
      </div>

      <div class="friends-scroll">
          <!-- Display only the first 8 friends -->
          <div v-for="friend in limitedFriends" :key="friend.id" class="friend-item">
              <router-link :to="{ name: 'friendProfile', params: { id: friend.id } }">
                  <img :src="friend.profileImage || 'default-avatar.jpg'" alt="Friend Profile Image" />
                  <p class="friend-username">{{ friend.username }}</p>
              </router-link>
          </div>
      </div>

      <div class="header">
          <h3>Suggested Friends</h3>
      </div>

      <div class="friends-scroll">
          <!-- Display all suggested friends -->
          <div v-for="friend in limitedSuggestedFriends" :key="friend.id" class="friend-item">
              <router-link :to="{ name: 'friendProfile', params: { id: friend.id } }">
                  <img :src="friend.profileImage || 'default-avatar.jpg'" alt="Suggested Friend Profile Image" />
                  <p class="friend-username">{{ friend.username }}</p>
              </router-link>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "FriendsList",
  props: {
      myFriends: {
          type: Array,
          default: () => [],
      },
      suggestedFriends: {
          type: Array,
          default: () => [],
      },
  },
  computed: {
      limitedFriends() {
          return this.myFriends.slice(0, 8);
      },
      limitedSuggestedFriends() {
          return this.suggestedFriends.slice(0, 8);
      },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 15px;
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
  flex-wrap: wrap;
  gap: 20px;
  overflow-x: hidden;
  padding: 10px 0;
  overflow: visible;
}

.friend-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
  flex-basis: 100px;
  flex:0 0 auto;
  overflow: visible;
}

.friend-item:hover {
  transform: scale(1.05);
}

.friend-item img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.friend-name {
  font-weight: bold;
  color: #333;
  font-size: 1rem;
  margin-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.friend-username {
  color: #777;
  font-size: 0.85rem;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.see-all {
  color: #7B61FF;
  font-weight: 350;
  cursor: pointer;
  font-size: 0.9rem;
}

.see-all:hover {
  color: #5A45D6;
  font-weight: 500;
  text-decoration: underline;
}

/* RESPONSIVENESS */

@media (max-width: 1024px) {
  .friends-scroll {
      max-width: 600px;
      margin: 0 auto;
      justify-content: center;
  }
}

@media (max-width: 768px) {
  .friends-scroll {
      max-width: 600px;
      justify-content: center;
      text-align: center;
  }
}

@media (max-width: 640px) {
  .friends-scroll {
      max-width: 600px;
      justify-content: center;
      text-align: center;
  }
}

@media (max-width: 480px) {
  .friends-scroll {
      max-width: 600px;
      justify-content: center;
      text-align: center;
  }
}
</style>