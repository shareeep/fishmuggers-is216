<template>
  <div v-if="loading" class="loading-container">
    <p class="loading-text">
      <img src="../../../assets/images/loading1.gif" alt="Loading" class="loadinggif" />
      Loading chats<span class="dots"></span>
    </p>
  </div>
  <div class="chat-panel" v-else-if="selectedFriend">
    <!-- Back Button -->
    <div class="chat-header">
      <button class="back-button" @click="switchToConversationsMode"><img src="../../../assets/images/back_arrow.png"
          alt="back"></button>
      <img :src="selectedFriend.avatar" alt="Avatar" class="chat-avatar" />
      <h3>{{ selectedFriend.name }}</h3>
    </div>
    <div class="chat-messages" ref="messageContainer" @scroll="handleScroll">
      <div v-for="(message, index) in selectedFriend.messages" :key="index" class="message">
        <!-- Render message HTML using v-html for clickable links -->
        <p v-html="formatMessage(message.text)" :class="message.sentByYou ? 'message-you' : 'message-them'"></p>
      </div>

    </div>
    <div class="chat-input">
      <div class="input-container">
        <input type="text" v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage" />
        <button @click="sendMessage" class="send-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M2 21l3-9-3-9 18 9-18 9z" />
          </svg>
        </button>
      </div>

    </div>
  </div>
  <div class="no-chat-selected" v-else>
    <button @click='showFindChatPopup' class="start-chat-btn">Start Chatting!</button>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, defineProps } from 'vue';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const props = defineProps({
  selectedFriend: {
    type: Object,
    required: false
  },
  fetchFriends: {
    type: Function,
    required: true
  },
  showFindChatPopup: {
    type: Function,
    required: true
  }
});

const newMessage = ref('');
const userUid = ref(null);
const messageContainer = ref(null);
const isUserScrolledUp = ref(false);
const loading = ref(true);  // Loading state

// Watch for changes in selectedFriend to stop loading
watch(() => props.selectedFriend, (newValue) => {
  if (newValue) loading.value = false;
});

// Function to switch back to conversations mode
const switchToConversationsMode = () => {
  const gridElement = document.querySelector(".chat-container");
  gridElement.classList.add("conversations-mode");
  gridElement.classList.remove("messages-mode");
};

// Send message logic with POST request to backend
const sendMessage = async () => {
  if (newMessage.value.trim() !== '' && props.selectedFriend && userUid.value) {
    try {
      await axios.post('http://localhost:3000/api/messages/send', {
        senderUid: userUid.value,
        receiverUid: props.selectedFriend.senderUid,
        messageText: newMessage.value
      });

      props.selectedFriend.messages.push({
        text: newMessage.value,
        sentByYou: true
      });

      newMessage.value = '';
      await props.fetchFriends();
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }

  }
};

// Function to format messages for clickable links
const formatMessage = (messageText) => {
  // Sanitize or modify if necessary to avoid XSS, otherwise trust the message content
  return messageText;
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
    isUserScrolledUp.value = scrollDifference > 10;
  }
};

// Scroll to bottom function
const scrollToBottom = () => {
  if (!isUserScrolledUp.value) {
    const container = messageContainer.value;
    nextTick(() => {
      container.scrollTop = container.scrollHeight;
    });
  }
};

// Fetch Firebase Auth UID on mount
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userUid.value = user.uid;
    } else {
      console.error('User not authenticated');
    }
  });
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Ensures it takes full height of the viewport */
}

.loading-text {
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 10px;
}

.loadinggif {
  margin-right: -30px;
  width: 200px; /* Adjust the width as desired */
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


input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 2px solid #FFD700;
  border-radius: 25px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus {
  border-color: #FAE588;
  box-shadow: 0 0 0 2px #FFD700;
  color: black;
}

.back-button {
  display: none;
  background: none;
  border: none;
  margin-right: 10px;
}

.back-button img {
  width: 25px;
  height: 25px;
}

.back-button img:hover {
  transform: scale(1.05);
}

@media (max-width: 600px) {
  .back-button {
    display: inline-block;
    position: relative;
  }
}

.sending-message {
  font-size: 0.9rem;
  color: gray;
  text-align: center;
  padding: 5px;
}

.chat-panel {
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  flex-grow: 1;
  /* Ensures the chat panel takes up the remaining space */
  background-color: #f9f9f9;
  height: 100vh;
  /* Full height */
  width: 100%;
  /* Full width */
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
  background-size: cover;
  /* Ensure the background image fills the container */
  background-position: center;
  /* Center the image */
  background-repeat: no-repeat;
  /* Prevents the background from repeating */
  scroll-behavior: smooth;
}

.message {
  display: flex;
  width: 100%;
  /* Ensure the message takes the full width of the container */
  margin-bottom: 10px;
}

.message-you {
  justify-content: flex-end;
  /* Aligns your messages to the right */
  align-items: flex-end;
  /* Aligns the text at the bottom */
  background-color: #FFE047;
  /* Yellow background */
  padding: 8px;
  border-radius: 10px;
  word-break: break-word;
  max-width: 75%;
  margin-left: auto;
  /* Ensures the message aligns to the right */
  color: black;
  /* Black text color */
  text-align: left;
  /* Aligns text to the right */
}

.message-them {
  justify-content: flex-start;
  align-items: flex-start;
  /* Aligns the text at the top */
  background-color: #ececec;
  padding: 8px;
  border-radius: 10px;
  max-width: 75%;
  margin-right: auto;
  /* Ensures the message aligns to the left */
  color: #000;
  /* Black text color */
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #ddd;
  background-color: white;
}

.input-container {
  position: relative;
  width: 100%;
}

.chat-input input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  /* Add padding-right to make space for the button */
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
}

.send-button {
  position: absolute;
  right: 10px;
  /* Adjust this value to fit your design */
  top: 50%;
  transform: translateY(-50%);
  color: #7B61FF;
  border: none;
  background: none;
  cursor: pointer;
}

.send-button svg {
  fill: currentColor;
  /* This ensures the SVG inherits the color from the button */
  transition: fill 0.2s ease;
  /* Smooth color transition */
}

.send-button:active svg {
  fill: #533bca;
  /* Change color of the SVG on press */
}

.send-button i {
  font-size: 16px;
}

@media (max-width: 767px) {
  .chat-input {
    margin-bottom: 40px;
  }
}

.no-chat-selected {
  display: flex;
  justify-content: center;
  /* Center horizontally */
  align-items: center;
  /* Center vertically */
  height: 100vh;
  /* Take up the full viewport height */
  width: 100%;
  /* Take up the full width */
  background-image: url('../../../assets/images/chat_background.png');
  background-size: 100% 100%;
  /* Ensure the background image fills the container */
  background-position: center;
  /* Center the image */
  background-repeat: no-repeat;
  /* Prevents the background from repeating */
  text-align: center;
  /* Center the text */
}

.start-chat-btn {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: #FFD700;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.start-chat-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
  background-color: #E6C200;
}

.start-chat-btn:active {
  transform: scale(0.98);
}

a {
  color: #fff;
 text-decoration: underline;
}
</style>
