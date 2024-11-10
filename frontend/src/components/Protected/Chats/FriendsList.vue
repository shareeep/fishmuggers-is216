<template>
  <div class="friends-list">
   
    <!-- Search bar -->
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search" class="search-input" />
    </div>

    <div v-if="isMobileAndLoading" class="loading-container">
      <p class="loading-text">
        <img src="../../../assets/images/loading1.gif" alt="Loading" class="loadinggif" />
        Loading chats<span class="dots"></span>
      </p>
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
        <span v-if="friend.unreadCount > 0" friend.unreadcoun class="unread-badge">{{ friend.unreadCount }}
        </span>

        <!-- Three dots button for showing dropdown -->
        <!-- <button @click.stop="toggleDropdown(index)" class="delete-chat-button" title="Options">
          •••
        </button> -->

        <!-- Dropdown menu -->
        <!-- <div v-if="activeDropdown === index" class="dropdown-menu">
          <button @click.stop="confirmDelete(friend)" class="dropdown-item">
            <i class="fas fa-trash-alt"></i> Delete Chat
          </button>
        </div> -->
      </div>
    </div>

    <!-- Button to find more friends to chat with -->
    <div class="find-more-friends">
      <button @click="findMoreFriends">{{ buttonText }}</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

// Props to receive from the parent component
const props = defineProps({
  friends: {
    type: Array,
    required: true
  },
  selectedFriend: {
    type: Object,
    required: false
  },
  loading: {
    type: Boolean,
    required: true
  }
});
const isMobileAndLoading = computed(() => window.innerWidth <= 600 && props.loading);

const searchQuery = ref('');
const activeDropdown = ref(null); // Track the index of the active dropdown

const filteredFriends = computed(() =>
  props.friends.filter(friend =>
    friend.name.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  )
);

// Emit the selected friend back to the parent component
const emit = defineEmits(['friendSelected', 'showFindFriendsPopup', 'switchToMessages']);

const selectFriend = (friend) => {
  console.log("Selected friend ID:", friend.id); // Debug selected friend
  emit("friendSelected", friend);
  emit("switchToMessages");  // Trigger switchToMessagesMode in Allchats.vue

};

// Emit an event to show the "find friends" popup
const findMoreFriends = () => {
  emit('showFindFriendsPopup');
};

const buttonText = ref('');

function updateButtonText() {
  buttonText.value =
    window.innerWidth <= 600 && props.friends.length === 0
      ? 'Start Chatting'
      : 'Find more friends to chat with!';
}

// Initial button text check on mount
onMounted(() => {
  updateButtonText(); // Set initial button text
  window.addEventListener('resize', handleResize); // Listen for resizing
});

function handleResize() {
  updateButtonText(); // Re-evaluate button text on resize
}

// Watch for changes in the friends array to update button text accordingly
watch(
  () => props.friends.length,
  () => {
    updateButtonText(); // Update button text if friends list changes
  }
);

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});


// Toggle the dropdown menu visibility
// const toggleDropdown = (index) => {
//   activeDropdown.value = activeDropdown.value === index ? null : index;
// };

// Close dropdown if clicked outside
// const handleClickOutside = (event) => {
//   const dropdown = document.querySelector('.dropdown-menu');
//   if (dropdown && !dropdown.contains(event.target)) {
//     activeDropdown.value = null;
//   }
// };

// Add event listener to close dropdown when clicking outside
// onMounted(() => {
//   document.addEventListener('click', handleClickOutside);
// });

// onUnmounted(() => {
//   document.removeEventListener('click', handleClickOutside);
// });

// Emit an event to delete the selected chat
// const confirmDelete = (friend) => {
//   if (confirm(`Are you sure you want to delete the chat with ${friend.name}?`)) {
//     emit('deleteChat', friend); 
//     activeDropdown.value = null; 
//   }
// };

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
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  transform: translateX(-20px);
  /* Ensures it takes full height of the viewport */
}

.loading-text {
  font-family: poppins;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 10px;
}

.loadinggif {
  margin-right: -20px;
  width: 200px;
  /* Adjust the width as desired */
}

.dots::after {
  content: '';
  display: inline-block;
  width: 1em;
  animation: ellipsis 1.5s infinite;
}

@keyframes ellipsis {
  0% {
    content: '';
  }

  33% {
    content: '.';
  }

  66% {
    content: '..';
  }

  100% {
    content: '...';
  }
}

.friend-item.selected {
  background-color: #f0f0f0;
  /* Background for selected friend */
}

@media (max-width:600px) {
  .friend-item.selected {
    background-color: white;
    /* Background for selected friend */
  }
}

/* .delete-chat-button {
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
} */


.friends-list {
  display: flex;
  overflow-y: auto;
  grid-row: 1 / -1;
  flex-direction: column;
  background-color: #fff;
  height: 100vh;
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
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 60%;
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
  position: absolute;
  top: 10px;
  /* Distance from the top */
  right: 10px;
  /* Distance from the right */
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

@media (max-width:767px) {
  .find-more-friends button {
    margin-bottom: 60px;
  }
}


.unread-badge {
  margin-top: 20px;
  margin-right: 5px;
  background-color: #FFD700;
  color: black;
  font-weight: bold;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
}
</style>