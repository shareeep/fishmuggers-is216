<template>
  <div class="chat-container">
    <FriendsList :friends="sortedFriends" :selectedFriend="selectedFriend" @friendSelected="selectFriend"
      @showFindFriendsPopup="showFindChatPopup" @switchToMessages="switchToMessagesMode" :loading="loading"/>

    <ChatPanel :selectedFriend="selectedFriend" :fetchFriends="fetchFriends" :showFindChatPopup="showFindChatPopup" :loading="loading"  @updateLoading="loading = false"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps } from 'vue';
import FriendsList from '@/components/Protected/Chats/FriendsList.vue';
import ChatPanel from '@/components/Protected/Chats/ChatPanel.vue';
import api from '@/services/api';
import { auth } from '../../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const props = defineProps({
  showFindChatPopup: {
    type: Function,
    required: true
  },
});

const loading = ref(true); // Define loading as a local ref
const selectedFriend = ref(null);
const friends = ref([]);
const userUid = ref(null);
let pollingInterval = null;

// const selectFriend = (friend) => {
//   selectedFriend.value = friend;
//   console.log("Selected Friend Updated:", selectedFriend.value);
// };
const markMessagesAsRead = async (uid, friendUid) => {
  try {
    const response = await api.post('/api/messages/markAsRead', {
      uid: uid,
      friendUid: friendUid,
    });
    console.log(response.data.message);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

const selectFriend = async (friend) => {
  selectedFriend.value = friend;
  loading.value = false;
  console.log("Selected Friend Updated:", selectedFriend.value);

    // Immediately set the unread count to 0 for the selected friend
  const friendIndex = friends.value.findIndex(f => f.senderUid === friend.senderUid);
  if (friendIndex !== -1) {
    friends.value[friendIndex].unreadCount = 0;
  }
  
  // Call markMessagesAsRead after selecting a friend
  if (userUid.value && selectedFriend.value) {
    await markMessagesAsRead(userUid.value, selectedFriend.value.senderUid);
    // Fetch the updated friends list to refresh unread counts
    await fetchFriends();
  }

  // Switch to messages mode on mobile devices
  switchToMessagesMode();
};


const fetchFriends = async () => {
  try {
    if (userUid.value) {
      const response = await api.get(`/api/messages/user/${userUid.value}`);
      friends.value = response.data;
      if (selectedFriend.value) {
        const updatedFriend = friends.value.find(friend => friend.senderUid === selectedFriend.value.senderUid);
        if (updatedFriend) {
          selectedFriend.value = updatedFriend;
        }
      } else if (friends.value.length > 0) {
        // Set selectedFriend to the latest chat
        selectedFriend.value = friends.value.reduce((latestFriend, friend) => {
          return new Date(friend.latest) > new Date(latestFriend.latest) ? friend : latestFriend;
        });
      }
    }
  } catch (error) {
    console.error('Error fetching friends:', error);
  } finally {
    loading.value = false; // Stop loading after fetching friends
  }
};

const sortedFriends = computed(() => {
  return [...friends.value].sort((a, b) => new Date(b.latest) - new Date(a.latest));
});

const startPolling = () => {
  pollingInterval = setInterval(fetchFriends, 5000);
};

onBeforeUnmount(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userUid.value = user.uid;
      fetchFriends();
      startPolling();
    } else {
      console.error('User not authenticated');
    }
  });
});

// Mobile mode switching
const switchToMessagesMode = () => {
  const gridElement = document.querySelector(".chat-container");
  gridElement.classList.add("messages-mode");
  gridElement.classList.remove("conversations-mode");
};

// const switchToConversationsMode = () => {
//   const gridElement = document.querySelector(".chat-container");
//   gridElement.classList.add("conversations-mode");
//   gridElement.classList.remove("messages-mode");
// };
</script>

<style scoped>
.chat-container {
  display: grid;
  grid-template-columns: 290px 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  overflow-x: hidden;
  transform: translateX(0);
}

@media (max-width: 600px) {
  .chat-container {
    gap: 0;
    position: absolute;
    grid-template-columns: 100vw 100vw;
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .conversations-mode {
    transform: translateX(0);
  }

  .messages-mode {
    transform: translateX(-100vw);
  }
}
</style>
