<template>
  <div class="friends-list">
    <!-- Search bar -->
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search" class="search-input" />
    </div>

    <!-- List of friends/chats -->
    <div class="friends">
      <div v-for="(friend, index) in filteredFriends" :key="index" class="friend-item" @click="selectFriend(friend)">
        <img :src="friend.avatar" alt="Avatar" class="avatar" />
        <div class="friend-info">
          <h3>{{ friend.name }}</h3>
          <p>{{ friend.lastMessage }}</p>
        </div>
        <span class="time">{{ formatTimeOrDate(friend.latest) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props to receive from the parent component
const props = defineProps({
  friends: {
    type: Array,
    required: true
  }
});

const searchQuery = ref('');

const filteredFriends = computed(() =>
  props.friends.filter(friend =>
    friend.name.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  )
);


// Emit the selected friend back to the parent component
const emit = defineEmits(['friendSelected']);
const selectFriend = (friend) => {
  emit('friendSelected', friend); // Emit selected friend to parent
};

// Helper function to format the time or date
const formatTimeOrDate = (timestamp) => {
  const messageDate = new Date(timestamp);
  const today = new Date();

  // Check if the message is from today
  const isSameDay = messageDate.toDateString() === today.toDateString();

  // Format the message time or date
  if (isSameDay) {
    // Return time in HH:mm format
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    // Return the date in a short format (MM/DD/YYYY)
    return messageDate.toLocaleDateString();
  }
};
</script>

<style scoped>
.friends-list {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100vh;
  width: 300px;
  /* Fixed width on larger screens */
  min-width: 300px;
  max-width: 300px;
  border-right: 1px solid #ddd;
}

/* When the screen width is smaller than 768px, adjust the layout */
@media (max-width: 768px) {
  .friends-list {
    width: 100px;
    /* Shrink to 100px */
    min-width: 100px;
    max-width: 100px;
  }

  /* Hide everything except the avatar */
  .friend-info,
  .time,
  .search-bar {
    display: none;
  }

  /* Adjust the avatar to be centered and occupy the entire width */
  .avatar {
    margin: 0 auto;
    /* Center the avatar */

    width: 50px;
    height: 50px;
  }

  .friends {
    padding: 0;
    /* Remove padding for better alignment */
  }

  .friend-item {
    justify-content: center;
    /* Center the avatar in the list */
    display: flex;
    padding: 0 auto;
    flex-direction: column;
    align-items: center;
  }
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
  overflow-y: auto;
  /* Enable scrolling for the friends list */
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
  max-width: 150px;
  /* Adjust as needed */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time {
  font-size: 12px;
  color: #888;
}
</style>