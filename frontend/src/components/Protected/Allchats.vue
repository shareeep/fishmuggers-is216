<template>
    <div class="friends-list">
      <!-- Search bar -->
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search"
          class="search-input"
        />
      </div>
  
      <!-- List of friends/chats -->
      <div class="friends" ref="friendsList">
        <div
          v-for="(friend, index) in filteredFriends"
          :key="index"
          class="friend-item"
          @click="selectFriend(friend)"
        >
          <img :src="friend.avatar" alt="Avatar" class="avatar" />
          <div class="friend-info">
            <h3>{{ friend.name }}</h3>
            <p>{{ friend.lastMessage }}</p>
          </div>
          <span class="time">{{ friend.lastSeen }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // Search query for filtering friends
  const searchQuery = ref('');
  
  // Dummy friends list data
  const friends = ref([
    { name: 'Jessica Drew', lastMessage: 'Ok, see you later', lastSeen: '18:30', avatar: '/path-to-avatar1.jpg' },
    { name: 'David Moore', lastMessage: "You: I don't remember anything", lastSeen: '18:16', avatar: '/path-to-avatar2.jpg' },
    { name: 'Greg James', lastMessage: 'I got a job at SpaceX 🎉🚀', lastSeen: '18:02', avatar: '/path-to-avatar3.jpg' },
    { name: 'Emily Dorson', lastMessage: 'Table for four, 5PM. Be there.', lastSeen: '17:42', avatar: '/path-to-avatar4.jpg' },
    { name: 'Office Chat', lastMessage: 'Lewis: All done mate 😎', lastSeen: '17:08', avatar: '/path-to-avatar5.jpg' },
    { name: 'Announcements', lastMessage: 'Channel created', lastSeen: '16:15', avatar: '/path-to-avatar6.jpg' },
    { name: 'Little Sister', lastMessage: 'Tell mom I will be home for tea 💜', lastSeen: 'Wed', avatar: '/path-to-avatar7.jpg' },
    { name: 'Art Class', lastMessage: 'Emily: 🎨 Editorial', lastSeen: 'Tue', avatar: '/path-to-avatar8.jpg' },
  ]);
  
  // Computed property to filter friends based on search query
  const filteredFriends = computed(() =>
    friends.value.filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
  
  // Method to handle friend selection (for later integration)
  const selectFriend = (friend) => {
    console.log(`Selected friend: ${friend.name}`);
  };
  </script>
  
  <style scoped>
  .friends-list {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    height: 100vh;
    width: 300px; /* Adjust width to match the design */
    border-right: 1px solid #ddd;
  }
  
  .search-bar {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    background-color: #f9f9f9;
  }
  
  .search-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .friends {
    flex: 1;
    overflow-y: auto; /* Enable scrolling for the friends list */
    padding: 10px;
  }
  
  .friend-item {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .friend-item:hover {
    background-color: #f0f0f0;
  }
  
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }
  
  .friend-info {
    flex-grow: 1;
  }
  
  .friend-info h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
  
  .friend-info p {
    margin: 0;
    color: #888;
  }
  
  .time {
    font-size: 12px;
    color: #888;
  }
  </style>
  