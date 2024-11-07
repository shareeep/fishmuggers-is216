<template>
  <div class="chat-container">
    <FriendsList :friends="sortedFriends" :selectedFriend="selectedFriend" @friendSelected="selectFriend"
      @showFindFriendsPopup="showFindChatPopup" />

    <chatPanel :selectedFriend="selectedFriend" :fetchFriends="fetchFriends" :showFindChatPopup="showFindChatPopup" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps } from 'vue';
import FriendsList from '@/components/Protected/Chats/FriendsList.vue';
import ChatPanel from '@/components/Protected/Chats/ChatPanel.vue';
import axios from 'axios';
import { auth } from '../../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const props = defineProps({
  showFindChatPopup: {
    type: Function,
    required: true
  }
});

const selectedFriend = ref(null);
const friends = ref([]);
const userUid = ref(null);
let pollingInterval = null;

const selectFriend = (friend) => {
  selectedFriend.value = friend; // Update selected friend
  console.log("Selected Friend Updated:", selectedFriend.value); // Log for debugging
};

const fetchFriends = async () => {
  try {
    if (userUid.value) {
      const response = await axios.get(`http://localhost:3000/api/messages/user/${userUid.value}`);
      friends.value = response.data;
      // console.log("Fetched friends:", friends.value);
      if (selectedFriend.value) {
        const updatedFriend = friends.value.find(friend => friend.senderUid === selectedFriend.value.senderUid);
        if (updatedFriend) {
          selectedFriend.value = updatedFriend;
        }
      } else if (friends.value.length > 0) {
        selectedFriend.value = friends.value[0];
      }
    }
  } catch (error) {
    console.error('Error fetching friends:', error);
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
</script>



<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
}
</style>
