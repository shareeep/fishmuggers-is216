<template>
  <div class="chat-panel" v-if="selectedFriend">
    <div class="chat-header">
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
      <input type="text" v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage" />
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
.sending-message {
  font-size: 0.9rem;
  color: gray;
  text-align: center;
  padding: 5px;
}
.chat-panel {
  display: flex;
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
  background-size: 100% 100%;
  /* Ensure the background image fills the container */
  background-position: center;
  /* Center the image */
  background-repeat: no-repeat;
  /* Prevents the background from repeating */
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

.chat-input input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
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

/* Media Query for Small Screens (max-width: 767px) */
@media (max-width: 767px) {
  .chat-panel {
    height: calc(100vh - 50px);
    /* Subtract bottom navbar height */
  }

  .chat-messages {
    padding-bottom: 60px;
    /* Additional padding for chat input area */
  }

  .chat-input {
    padding-bottom: 10px;
    /* Extra padding to lift input above navbar */
  }
}
</style>
