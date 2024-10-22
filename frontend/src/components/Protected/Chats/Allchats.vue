<template>
  <div class="chat-container">
    <friendsList @friendSelected="selectFriend" />
    <chatPanel :selectedFriend="selectedFriend" />
  </div>
</template>

<script setup>
import friendsList from '@/components/Protected/Chats/FriendsList.vue';
import chatPanel from '@/components/Protected/Chats/ChatPanel.vue';
import { ref, onMounted } from 'vue';

const selectedFriend = ref(null);
const friends = ref([
  {
    name: 'Jessica Drew',
    lastMessage: 'Ok, see you later',
    avatar: '/path-to-avatar1.jpg',
    messages: [
      { text: 'Hey Jessica, how are you?', sentByYou: true },
      { text: 'I’m good! Just heading out now.', sentByYou: false }
    ]
  },
  // Add more friends...
]);

// Method to set initial friend (if you want to automatically select the first friend when loading the component)
const getInitialFriend = () => {
  if (friends.value.length > 0) {
    selectedFriend.value = friends.value[0]; // Automatically select the first friend in the list
  }
};

// Method to handle friend selection
const selectFriend = (friend) => {
  selectedFriend.value = friend;
};

// Set the initial friend when the component is mounted
onMounted(() => {
  getInitialFriend();
});
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
}
</style>
