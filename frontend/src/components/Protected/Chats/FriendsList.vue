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
          <img src="../../../assets/images/logo.png" alt="Avatar" class="avatar" />
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
  const selectedFriend = ref(null);
  const newMessage = ref('');
  
  // Dummy friends list data with fake chat logs
  const friends = ref([
    {
      name: 'Jessica Drew',
      lastMessage: 'Ok, see you later',
      lastSeen: '18:30',
      avatar: '/path-to-avatar1.jpg',
      messages: [
        { text: 'Hey Jessica, how are you?', sentByYou: true },
        { text: 'I’m good! Just heading out now.', sentByYou: false },
        { text: 'Cool, catch you later!', sentByYou: true }
      ]
    },
    {
      name: 'David Moore',
      lastMessage: "You: I don't remember anything",
      lastSeen: '18:16',
      avatar: '/path-to-avatar2.jpg',
      messages: [
        { text: 'Did you check the meeting notes?', sentByYou: false },
        { text: 'I don’t remember anything from that meeting 😅', sentByYou: true }
      ]
    },
    {
      name: 'Greg James',
      lastMessage: 'I got a job at SpaceX 🎉🚀',
      lastSeen: '18:02',
      avatar: '/path-to-avatar3.jpg',
      messages: [
        { text: 'Guess what? I got a job at SpaceX 🎉🚀', sentByYou: false },
        { text: 'No way! That’s amazing, congrats!', sentByYou: true }
      ]
    },
    // Add more friends...
  ]);
  
  // Computed property to filter friends based on search query
  const filteredFriends = computed(() =>
    friends.value.filter(friend =>
      friend.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
  
  // Method to handle friend selection
  const selectFriend = (friend) => {
    selectedFriend.value = friend;
  };
  
  // Method to send a message (adds the message to the current chat log)
  const sendMessage = () => {
    if (newMessage.value.trim() !== '') {
      selectedFriend.value.messages.push({ text: newMessage.value, sentByYou: true });
      newMessage.value = ''; // Clear input after sending
    }
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
  