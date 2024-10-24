<template>
  <div class="chat-panel" v-if="selectedFriend">
    <div class="chat-header">
      <img :src="selectedFriend.avatar" alt="Avatar" class="chat-avatar" />
      <h3>{{ selectedFriend.name }}</h3>
    </div>
    <div class="chat-messages" ref="messageContainer" @scroll="handleScroll">
      <div v-for="(message, index) in selectedFriend.messages" :key="index" class="message">
        <p :class="message.sentByYou ? 'message-you' : 'message-them'">
          {{ message.text }}
        </p>
      </div>
    </div>
    <div class="chat-input">
      <input type="text" v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage" />
    </div>
  </div>
  <div class="no-chat-selected" v-else>
    <h1>Loading</h1>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import axios from 'axios'; // Import axios for HTTP requests
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth

const props = defineProps({
  selectedFriend: {
    type: Object,
    required: false
  },
  fetchFriends: {
    type: Function,
    required: true
  }
});

const newMessage = ref('');
const userUid = ref(null); // Store the Firebase UID
const messageContainer = ref(null); // Reference for the message container
const isUserScrolledUp = ref(false); // To track if the user has manually scrolled up

// Send message logic with POST request to backend
const sendMessage = async () => {
  if (newMessage.value.trim() !== '' && props.selectedFriend && userUid.value) {
    try {
      // Make a POST request to save the message in the backend
      await axios.post('http://localhost:3000/api/messages/send', {
        senderUid: userUid.value, // Use the Firebase Auth UID as senderUid
        receiverUid: props.selectedFriend.senderUid, // The receiver is the selected friend
        messageText: newMessage.value
      });

      // If message is successfully sent to the backend, push it to the UI
      props.selectedFriend.messages.push({
        text: newMessage.value,
        sentByYou: true
      });

      // Clear the input after sending
      newMessage.value = '';

      // Call fetchFriends to update the friends and message lists
      await props.fetchFriends();

      // Scroll to the bottom after sending the message
      scrollToBottom();

    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};

// Watch for changes in selectedFriend's messages and scroll to bottom if needed
watch(() => props.selectedFriend?.messages.length, () => {
  nextTick(() => {
    scrollToBottom();
  });
});

// Handle scroll event to detect if the user is at the bottom or has scrolled up
const handleScroll = () => {
  const container = messageContainer.value;
  if (container) {
    const scrollDifference = container.scrollHeight - container.scrollTop - container.clientHeight;
    isUserScrolledUp.value = scrollDifference > 10; // If user scrolled up by 10px or more
  }
};

// Scroll to bottom function
const scrollToBottom = () => {
  if (!isUserScrolledUp.value) {
    const container = messageContainer.value;
    nextTick(() => {
      container.scrollTop = container.scrollHeight; // Scroll to the bottom
    });
  }
};

// Fetch Firebase Auth UID on mount
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userUid.value = user.uid; // Set the user UID from Firebase
    } else {
      console.error('User not authenticated');
    }
  });
});
</script>


<style scoped>
/* Same styling as before */
</style>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Ensures the chat panel takes up the remaining space */
  background-color: #f9f9f9;
  height: 100vh; /* Full height */
  width: 100%; /* Full width */
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ddd;
  background-color: white;
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.chat-messages {
  flex-grow: 1;
  padding: 15px;
  background-color: #fff;
  overflow-y: auto;
  background-image: url('../../../assets/images/chat_background.png');
  background-size: 100% 100%; /* Ensure the background image fills the container */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevents the background from repeating */
}

.message {
  display: flex;
  width: 100%; /* Ensure the message takes the full width of the container */
  margin-bottom: 10px;
}

.message-you {
  justify-content: flex-end; /* Aligns your messages to the right */
  align-items: flex-end; /* Aligns the text at the bottom */
  background-color: #FFE047; /* Yellow background */
  padding: 8px;
  border-radius: 10px;
  max-width: 75%;
  margin-left: auto; /* Ensures the message aligns to the right */
  color: black; /* Black text color */
  text-align: right; /* Aligns text to the right */
}

.message-them {
  justify-content: flex-start;
  align-items: flex-start; /* Aligns the text at the top */
  background-color: #ececec;
  padding: 8px;
  border-radius: 10px;
  max-width: 75%;
  margin-right: auto; /* Ensures the message aligns to the left */
  color: #000; /* Black text color */
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #ddd;
  background-color: white;
}

.chat-input input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.no-chat-selected {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 100vh; /* Take up the full viewport height */
  width: 100%; /* Take up the full width */
  background-image: url('../../../assets/images/chat_background.png');
  background-size: 100% 100%; /* Ensure the background image fills the container */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevents the background from repeating */
  text-align: center; /* Center the text */
}
</style>
