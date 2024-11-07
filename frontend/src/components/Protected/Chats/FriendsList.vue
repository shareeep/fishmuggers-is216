<template>
  <div class="friends-list">
    <!-- Search bar -->
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search" class="search-input" />
    </div>

    <!-- List of friends/chats -->
    <div class="friends">
      <div v-for="(friend, index) in filteredFriends" :key="friend.senderUid" class="friend-item"
        :class="{ selected: selectedFriend && selectedFriend.senderUid === friend.senderUid }"
        @click="selectFriend(friend)">
        <img :src="friend.avatar" alt="Avatar" class="avatar" />
        <div class="friend-info">
          <h3>{{ friend.name }}</h3>
          <p>{{ friend.lastMessage }}</p>
        </div>
        <span class="time">{{ formatTimeOrDate(friend.latest) }}</span>

        <!-- Three dots button for showing dropdown -->
        <button @click.stop="toggleDropdown(index)" class="delete-chat-button" title="Options">
          •••
        </button>

        <!-- Dropdown menu -->
        <div v-if="activeDropdown === index" class="dropdown-menu">
          <button @click.stop="confirmDelete(friend)" class="dropdown-item">
            <i class="fas fa-trash-alt"></i> Delete Chat
          </button>
        </div>
      </div>
    </div>

    <!-- Button to find more friends to chat with -->
    <div class="find-more-friends">
      <button @click="findMoreFriends">Find more friends to chat with!</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Props to receive from the parent component
const props = defineProps({
  friends: {
    type: Array,
    required: true
  },
  selectedFriend: {
    type: Object,
    required: false
  }
});

const searchQuery = ref('');
const activeDropdown = ref(null); // Track the index of the active dropdown

const filteredFriends = computed(() =>
  props.friends.filter(friend =>
    friend.name.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  )
);

// Emit the selected friend back to the parent component
const emit = defineEmits(['friendSelected', 'showFindFriendsPopup', 'deleteChat']);

const selectFriend = (friend) => {
  console.log("Selected friend ID:", friend.id); // Debug selected friend
  emit("friendSelected", friend);
};

// Emit an event to show the "find friends" popup
const findMoreFriends = () => {
  emit('showFindFriendsPopup');
};

// Toggle the dropdown menu visibility
const toggleDropdown = (index) => {
  activeDropdown.value = activeDropdown.value === index ? null : index;
};

// Close dropdown if clicked outside
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.dropdown-menu');
  if (dropdown && !dropdown.contains(event.target)) {
    activeDropdown.value = null;
  }
};

// Add event listener to close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Emit an event to delete the selected chat
const confirmDelete = (friend) => {
  if (confirm(`Are you sure you want to delete the chat with ${friend.name}?`)) {
    emit('deleteChat', friend);
    activeDropdown.value = null; // Close dropdown after deleting
  }
};

// Helper function to format the time or date
const formatTimeOrDate = (timestamp) => {
  const messageDate = new Date(timestamp);
  const today = new Date();

  // Check if the message is from today
  const isSameDay = messageDate.toDateString() === today.toDateString();

  // Format the message time or date
  if (isSameDay) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return messageDate.toLocaleDateString();
  }
};
</script>

<style scoped>
.friend-item.selected {
  background-color: #f0f0f0;
  /* Background for selected friend */
}

.delete-chat-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 18px;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}

.delete-chat-button:hover {
  color: black;
}

/* Dropdown menu styling */
.dropdown-menu {
  position: absolute;
  top: 30px;
  right: 5px;
  background-color: white;
  color: #f28b82;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.dropdown-item {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #f28b82;
  font-weight: bold;
  cursor: pointer;
}

.dropdown-item i {
  margin-right: 8px;
  font-size: 18px;
}

.dropdown-item:hover {
  color: #ff4d4d;
}

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
  position: relative;
  /* Allows absolutely positioned children */
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
  margin-top: 10px;
  font-size: 12px;
  color: #888;
}

.find-more-friends {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.find-more-friends button {
  margin-bottom: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: #FFD700;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  /* Smooth transition */
}

.find-more-friends button:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
  background-color: #E6C200;
}

.find-more-friends button:active {
  transform: scale(0.98);
}
</style>